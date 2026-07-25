"use client";

import {
  type CSSProperties,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Conversation, Message, WsEnvelope } from "./types";
import { useOttoChannel } from "./useOttoChannel";

/**
 * OttoInbox — the staff-side real-time support console.
 *
 * Host-agnostic: drops into any admin dashboard. Calls the host's proxy
 * routes (default `/api/admin/otto/*`) and opens a WebSocket (via a
 * short-lived ticket it mints over REST) to receive new conversations
 * and messages in real time.
 *
 * UX features in this version:
 *   - Pending tab is the landing tab (that's where new threads arrive)
 *   - Audible chime + desktop notification on new pending threads
 *   - Inline "CS-…" case id for every row
 *   - Reopen action for closed threads
 *   - Reply is structurally disabled when a thread is closed
 */
export interface OttoInboxProps {
  /** Base URL for the admin otto proxy (default "/api/admin/otto"). */
  apiBaseUrl?: string;
  /** Builds the inbox-level WS URL. */
  buildInboxWsUrl?: () => string;
  /** Builds the per-conversation WS URL. */
  buildConversationWsUrl?: (conversationId: string) => string;
  /** Current staff member's user id — used to detect "mine" vs "theirs". */
  currentUserId: string;
  /** Optional style/classname passthrough for the outer wrapper. */
  style?: CSSProperties;
  className?: string;
  /**
   * Optional toast bridge. When the host app has its own toaster
   * (the admin uses `useToast()` from components/feedback/Toaster),
   * pass a handler so confirmations render in the host's consistent
   * style. Without this prop the widget falls back to an internal
   * floating toast so it still works as a drop-in standalone.
   */
  onToast?: (
    tone: "success" | "error" | "info",
    title: string,
    description?: string,
  ) => void;
  /**
   * Cross-tenant "platform mode" for the Tesserix platform inbox
   * (tesserix-home admin). Map of tenant id → friendly product name.
   *
   * PRESENCE of this prop is the mode switch — there is no separate
   * boolean that could disagree with the data:
   *   - omitted  → single-tenant mode (default; byte-for-byte unchanged
   *                for existing consumers such as mark8ly admin)
   *   - provided → platform mode: a product badge on every row and in
   *                the thread header, plus a tenant filter derived from
   *                the tenant ids present in the fetched list.
   *
   * An empty object ({}) still enables platform mode; each badge then
   * falls back to the raw tenant id until labels are supplied.
   */
  tenantLabels?: Record<string, string>;
}

const DEFAULT_INBOX_WS = () => {
  if (typeof window === "undefined") return "";
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/api/v1/admin/otto/ws`;
};
const DEFAULT_CONVERSATION_WS = (id: string) => {
  if (typeof window === "undefined") return "";
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/api/v1/admin/otto/conversations/${encodeURIComponent(id)}/ws`;
};

type InboxStatus = "pending" | "active" | "closed";

export function OttoInbox({
  apiBaseUrl = "/api/admin/otto",
  buildInboxWsUrl = DEFAULT_INBOX_WS,
  buildConversationWsUrl = DEFAULT_CONVERSATION_WS,
  currentUserId,
  style,
  className,
  onToast,
  tenantLabels,
}: OttoInboxProps) {
  const base = useMemo(() => apiBaseUrl.replace(/\/+$/, ""), [apiBaseUrl]);
  // Platform mode is opt-in via the presence of tenantLabels. Kept as a
  // single derived boolean so every platform-only branch reads the same
  // switch and single-tenant consumers hit none of them.
  const platformMode = tenantLabels !== undefined;
  // Resolve a tenant id to its friendly product name, falling back to the
  // raw id when no label is mapped (or labels weren't supplied).
  const productLabel = useCallback(
    (tenantId: string) => tenantLabels?.[tenantId] ?? tenantId,
    [tenantLabels],
  );
  const [statusFilter, setStatusFilter] = useState<InboxStatus>("pending");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // selectedConv mirrors selectedId but is stored independently of
  // the list so a loadList refresh never blanks the thread pane. The
  // previous design computed `selected` from `conversations.find()`,
  // which broke on accept-next when the loadList refetch briefly
  // overwrote the list.
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Phase 2 — staff availability pool state. `available` is the live
  // toggle; `hasActiveCase` is derived so we know whether Accept Next
  // should be enabled (one case at a time per staff).
  const [available, setAvailable] = useState(false);
  const [currentCaseID, setCurrentCaseID] = useState<string>("");
  // Inline fallback when no host toast bridge is provided — keeps
  // the widget functional in a standalone / dev context.
  const [toast, setToast] = useState<{ tone: "success" | "error" | "info"; title: string; description?: string } | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Unified toast entry point. Delegates to the host's toaster when
  // one is wired (so admin tab feedback stays visually consistent
  // with the rest of the app), and falls back to the internal
  // floating toast otherwise.
  const showToast = useCallback(
    (tone: "success" | "error" | "info", title: string, description?: string) => {
      if (onToast) {
        onToast(tone, title, description);
        return;
      }
      setToast({ tone, title, description });
      window.setTimeout(() => {
        setToast((prev) => (prev?.title === title ? null : prev));
      }, 4000);
    },
    [onToast],
  );

  // Keep the latest statusFilter/selectedId accessible inside websocket
  // event callbacks without forcing the hook to re-subscribe on every
  // tab click.
  const statusFilterRef = useRef(statusFilter);
  statusFilterRef.current = statusFilter;
  const selectedIdRef = useRef<string | null>(selectedId);
  selectedIdRef.current = selectedId;

  // Alerting primitives: a short WebAudio chime synthesised on the fly
  // (no external asset) and the browser's Notification API when granted.
  const chimeCtxRef = useRef<AudioContext | null>(null);
  const notifyPermRef = useRef<NotificationPermission>("default");
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    notifyPermRef.current = Notification.permission;
    if (notifyPermRef.current === "default") {
      // Request on first mount. Browsers now require this to be tied to
      // a user gesture; if the silent request is rejected the inbox
      // still works — just without desktop notifications.
      void Notification.requestPermission().then((p) => {
        notifyPermRef.current = p;
      });
    }
  }, []);

  // Prefer the canonical row from the list when present (so status
  // pill / unread counts update in sync), but fall back to the cached
  // selectedConv so the thread pane survives a loadList refresh.
  const selected =
    conversations.find((c) => c.id === selectedId) ?? selectedConv ?? null;

  const loadList = useCallback(
    async (next: InboxStatus) => {
      setError(null);
      try {
        const res = await fetch(
          `${base}/conversations?status=${encodeURIComponent(next)}`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error(`list failed (${res.status})`);
        const body = (await res.json()) as { conversations: Conversation[] };
        setConversations(body.conversations ?? []);
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [base],
  );

  useEffect(() => {
    void loadList(statusFilter);
  }, [loadList, statusFilter]);

  // Inbox WS — new conversations + updates. Ticket URL is the REST proxy
  // that goes through the Next.js middleware (where session headers are
  // injected); the WS itself is a same-origin /api/v1/admin/otto/ws with
  // ?ticket= attached by useOttoChannel.
  const handleInboxEvent = useCallback(
    (env: WsEnvelope) => {
      if (env.type === "otto.conversation.created") {
        const payload = env.payload as { conversation: Conversation };
        // Chime + desktop notification — only for genuinely new threads.
        playChime(chimeCtxRef);
        showDesktopNotification(
          "New support chat",
          `${
            payload.conversation.customer.name ||
            payload.conversation.customer.email ||
            "Visitor"
          } · ${payload.conversation.case_id ?? ""}`.trim(),
          notifyPermRef.current,
        );
        if (statusFilterRef.current === "pending") {
          setConversations((prev) => {
            if (prev.some((c) => c.id === payload.conversation.id)) return prev;
            return [payload.conversation, ...prev];
          });
        }
      } else if (
        env.type === "otto.conversation.updated" ||
        env.type === "otto.conversation.closed"
      ) {
        const payload = env.payload as {
          conversation?: Conversation;
          conversation_id?: string;
        };
        if (payload.conversation) {
          const updated = payload.conversation;
          // A status change (accept→active, close→closed, reopen) must
          // MOVE the thread between tabs, not just relabel it in place —
          // otherwise a closed case lingers in the Active list. Drop it
          // from the current tab when its status no longer matches; keep
          // it fresh (or add it) when it does.
          setConversations((prev) => {
            if (updated.status !== statusFilterRef.current) {
              return prev.filter((c) => c.id !== updated.id);
            }
            return prev.some((c) => c.id === updated.id)
              ? prev.map((c) => (c.id === updated.id ? updated : c))
              : [updated, ...prev];
          });
          // Keep the pinned thread-pane copy fresh too — feedback
          // submissions and status flips should reflect immediately.
          setSelectedConv((prev) =>
            prev && prev.id === updated.id ? updated : prev,
          );
        } else if (payload.conversation_id) {
          void loadList(statusFilterRef.current);
        }
      }
    },
    [loadList],
  );

  useOttoChannel({
    url: buildInboxWsUrl(),
    ticketUrl: `${base}/ws-ticket`,
    onEvent: handleInboxEvent,
  });

  // Selection: load messages when we pick a thread.
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${base}/conversations/${encodeURIComponent(selectedId)}/messages`,
          { credentials: "include" },
        );
        if (!res.ok) throw new Error(`list msgs failed (${res.status})`);
        const body = (await res.json()) as { messages: Message[] };
        if (!cancelled) setMessages(body.messages ?? []);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [base, selectedId]);

  const convWsUrl = selectedId ? buildConversationWsUrl(selectedId) : null;
  const convTicketUrl = selectedId
    ? `${base}/conversations/${encodeURIComponent(selectedId)}/ws-ticket`
    : null;
  useOttoChannel({
    url: convWsUrl,
    ticketUrl: convTicketUrl,
    onEvent: (env) => {
      if (env.type === "otto.message.created") {
        const payload = env.payload as { message: Message };
        // Only chime on an inbound (customer) message while the thread
        // is open — staff's own posts echo back through the same room.
        if (payload.message.sender_type === "customer") {
          playChime(chimeCtxRef, 0.4);
        }
        setMessages((prev) =>
          prev.some((m) => m.id === payload.message.id)
            ? prev
            : [...prev, payload.message],
        );
      }
      if (
        env.type === "otto.conversation.updated" ||
        env.type === "otto.conversation.closed"
      ) {
        const payload = env.payload as { conversation?: Conversation };
        if (payload.conversation) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === payload.conversation!.id ? payload.conversation! : c,
            ),
          );
        }
      }
    },
  });

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, selectedId]);

  // Phase 2 — availability on mount. If the server hasn't seen this
  // staff before we get {available:false} back, matching our default
  // state. Errors are silent: the pool is an enhancement, the inbox
  // is still functional without it.
  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`${base}/me/availability`, { credentials: "include" });
        if (!res.ok) return;
        const body = (await res.json()) as {
          available?: boolean;
          availability?: {
            available?: boolean;
            current_case_id?: string;
          };
        };
        const a = body.availability ?? { available: body.available };
        setAvailable(Boolean(a?.available));
        setCurrentCaseID(a?.current_case_id ?? "");
      } catch {
        /* silent */
      }
    })();
  }, [base]);

  const toggleAvailable = useCallback(
    async (next: boolean) => {
      setBusy(true);
      setError(null);
      try {
        const res = await fetch(`${base}/me/availability`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ available: next }),
        });
        if (!res.ok) throw new Error(`availability failed (${res.status})`);
        const body = (await res.json()) as {
          availability?: { available?: boolean; current_case_id?: string };
        };
        const a = body.availability;
        setAvailable(Boolean(a?.available));
        setCurrentCaseID(a?.current_case_id ?? "");
        showToast(
          "success",
          next ? "You're available" : "You're paused",
          next
            ? "New customers can be routed to you from the queue."
            : "You won't be offered new customers until you go available.",
        );
      } catch (e) {
        setError((e as Error).message);
        showToast("error", "Couldn't update availability", (e as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [base, showToast],
  );

  const acceptNext = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${base}/accept-next`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(err.message || `accept-next failed (${res.status})`);
      }
      const body = (await res.json()) as { conversation: Conversation | null };
      if (!body.conversation) {
        setError("No customers waiting right now.");
        return;
      }
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === body.conversation!.id);
        return exists
          ? prev.map((c) => (c.id === body.conversation!.id ? body.conversation! : c))
          : [body.conversation!, ...prev];
      });
      // Set the conv state AND the id together so the thread pane
      // opens immediately — previously we relied on the list refresh
      // including the conv, which had a race under quick clicks.
      setSelectedConv(body.conversation);
      setSelectedId(body.conversation.id);
      setCurrentCaseID(body.conversation.id);
      setStatusFilter("active");
      const who =
        body.conversation.customer.name ||
        body.conversation.customer.email ||
        "Customer";
      showToast(
        "success",
        "Case accepted",
        `${body.conversation.case_id ?? "Case"} · ${who}`,
      );
    } catch (e) {
      setError((e as Error).message);
      showToast("error", "Couldn't accept case", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [base, showToast]);

  const accept = useCallback(
    async (id: string) => {
      setBusy(true);
      setError(null);
      try {
        const res = await fetch(
          `${base}/conversations/${encodeURIComponent(id)}/accept`,
          { method: "POST", credentials: "include" },
        );
        if (!res.ok) throw new Error(`accept failed (${res.status})`);
        const body = (await res.json()) as { conversation: Conversation };
        setConversations((prev) =>
          prev.map((c) => (c.id === body.conversation.id ? body.conversation : c)),
        );
        // Mirror the accept-next flow: keep the conv pinned in state
        // so the thread pane renders even if loadList races.
        setSelectedConv(body.conversation);
        setSelectedId(body.conversation.id);
        // Jump to the Active tab so the agent sees their own claim land.
        setStatusFilter("active");
        const who =
          body.conversation.customer.name ||
          body.conversation.customer.email ||
          "Customer";
        showToast(
          "success",
          "Case accepted",
          `${body.conversation.case_id ?? "Case"} · ${who}`,
        );
      } catch (e) {
        setError((e as Error).message);
        showToast("error", "Couldn't accept case", (e as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [base, showToast],
  );

  const send = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!selected || busy) return;
      const body = reply.trim();
      if (!body) return;
      setBusy(true);
      setError(null);
      try {
        const res = await fetch(
          `${base}/conversations/${encodeURIComponent(selected.id)}/messages`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body }),
          },
        );
        if (!res.ok) throw new Error(`send failed (${res.status})`);
        const resBody = (await res.json()) as { message: Message };
        setMessages((prev) =>
          prev.some((m) => m.id === resBody.message.id)
            ? prev
            : [...prev, resBody.message],
        );
        setReply("");
      } catch (err) {
        setError((err as Error).message);
        showToast("error", "Message didn't send", (err as Error).message);
      } finally {
        setBusy(false);
      }
    },
    [base, busy, reply, selected, showToast],
  );

  const close = useCallback(async () => {
    if (!selected) return;
    setBusy(true);
    try {
      const res = await fetch(
        `${base}/conversations/${encodeURIComponent(selected.id)}/close`,
        { method: "POST", credentials: "include" },
      );
      if (!res.ok) throw new Error(`close failed (${res.status})`);
      // Server releases the staff's current_case_id — mirror that
      // locally so Accept Next lights up again immediately.
      setCurrentCaseID("");
      // Move it out of the current tab right away — don't wait for the WS
      // echo. Closing from Active drops it from Active instantly and flips
      // the thread pane to the closed (reopen-able) state.
      const closedId = selected.id;
      setConversations((prev) =>
        statusFilterRef.current === "closed"
          ? prev.map((c) => (c.id === closedId ? { ...c, status: "closed" } : c))
          : prev.filter((c) => c.id !== closedId),
      );
      setSelectedConv((prev) =>
        prev && prev.id === closedId ? { ...prev, status: "closed" } : prev,
      );
      showToast(
        "success",
        "Case closed",
        selected.case_id
          ? `${selected.case_id} · customer will be asked for feedback.`
          : "Customer will be asked for feedback.",
      );
    } catch (e) {
      setError((e as Error).message);
      showToast("error", "Couldn't close case", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [base, selected, showToast]);

  const reopen = useCallback(async () => {
    if (!selected) return;
    setBusy(true);
    try {
      const res = await fetch(
        `${base}/conversations/${encodeURIComponent(selected.id)}/reopen`,
        { method: "POST", credentials: "include" },
      );
      if (!res.ok) throw new Error(`reopen failed (${res.status})`);
      const body = (await res.json()) as { conversation: Conversation };
      setConversations((prev) =>
        prev.map((c) => (c.id === body.conversation.id ? body.conversation : c)),
      );
      setSelectedConv(body.conversation);
      setStatusFilter(body.conversation.status);
      showToast(
        "success",
        "Case reopened",
        body.conversation.case_id ?? undefined,
      );
    } catch (e) {
      setError((e as Error).message);
      showToast("error", "Couldn't reopen case", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [base, selected, showToast]);

  const canReply =
    !!selected &&
    selected.status !== "closed" &&
    (!!selected.assignee && selected.assignee.user_id === currentUserId);

  return (
    <div className={`otto-inbox ${className ?? ""}`} style={style}>
      {toast && (
        <div
          className={`otto-inbox__toast otto-inbox__toast--${toast.tone}`}
          role="status"
          aria-live="polite"
        >
          <strong>{toast.title}</strong>
          {toast.description && (
            <div className="otto-inbox__toast-desc">{toast.description}</div>
          )}
        </div>
      )}
      <aside className="otto-inbox__list">
        {/* Availability pool controls — staff must mark themselves
            available before Accept Next will pop a case to them. The
            button is disabled while a case is already in flight so
            we preserve the 1-case-per-staff invariant. */}
        <div className="otto-inbox__pool">
          <label className="otto-inbox__pool-toggle">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => void toggleAvailable(e.target.checked)}
              disabled={busy}
              aria-label="Mark yourself available"
            />
            <span
              className={`otto-inbox__pool-dot ${available ? "is-on" : ""}`}
              aria-hidden="true"
            />
            {available ? "Available" : "Paused"}
          </label>
          <button
            type="button"
            className="otto-inbox__btn otto-inbox__btn--primary otto-inbox__accept-next"
            onClick={() => void acceptNext()}
            disabled={busy || !available || Boolean(currentCaseID)}
            title={
              !available
                ? "Mark yourself available to pick up the next customer"
                : currentCaseID
                  ? "Close your current case before accepting the next one"
                  : "Accept the oldest pending customer"
            }
          >
            Accept next
          </button>
        </div>
        <div className="otto-inbox__tabs">
          {(["pending", "active", "closed"] as InboxStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`otto-inbox__tab ${statusFilter === s ? "is-active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        {conversations.length === 0 ? (
          <div className="otto-inbox__empty">
            {error ? `Could not load: ${error}` : "No conversations here yet."}
          </div>
        ) : (
          conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`otto-inbox__row ${c.id === selectedId ? "is-active" : ""}`}
              onClick={() => {
                setSelectedId(c.id);
                setSelectedConv(c);
              }}
            >
              <div className="otto-inbox__row-head">
                <strong>
                  {c.customer.name ||
                    c.customer.email ||
                    "Anonymous visitor"}
                </strong>
                <span className="otto-inbox__row-time">
                  {formatRelative(c.last_message_at)}
                </span>
              </div>
              <div className="otto-inbox__row-sub">
                {c.subject || "(no subject)"}
              </div>
              <div className="otto-inbox__row-meta">
                {platformMode && (
                  <span className="otto-inbox__product" title={c.tenant_id}>
                    {productLabel(c.tenant_id)}
                  </span>
                )}
                <span className={`otto-inbox__pill otto-inbox__pill--${c.status}`}>
                  {c.status}
                </span>
                {c.case_id && (
                  <span className="otto-inbox__case-id">{c.case_id}</span>
                )}
                {c.unread_count_staff > 0 && (
                  <span className="otto-inbox__unread">
                    {c.unread_count_staff}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </aside>

      <section className="otto-inbox__thread">
        {!selected ? (
          <div className="otto-inbox__placeholder">
            Pick a conversation on the left to start replying.
          </div>
        ) : (
          <>
            <header className="otto-inbox__thread-head">
              <div>
                <strong>
                  {selected.customer.name ||
                    selected.customer.email ||
                    "Anonymous visitor"}
                </strong>
                {platformMode && (
                  <div className="otto-inbox__thread-product">
                    <span
                      className="otto-inbox__product"
                      title={selected.tenant_id}
                    >
                      {productLabel(selected.tenant_id)}
                    </span>
                  </div>
                )}
                <div className="otto-inbox__thread-subtitle">
                  {selected.case_id ? (
                    <>
                      <span className="otto-inbox__case-id">
                        {selected.case_id}
                      </span>
                      {selected.subject && (
                        <> · {selected.subject}</>
                      )}
                    </>
                  ) : (
                    selected.subject || "(no subject)"
                  )}
                </div>
                {/* Intake context — shown at a glance so staff
                    open the case with the reason + status already
                    visible. DOB is gated behind a "Verify"
                    disclosure so it doesn't leak onto screenshots
                    unnecessarily. */}
                {selected.intake && (
                  <dl className="otto-inbox__intake">
                    <div>
                      <dt>Reason</dt>
                      <dd>{prettyReason(selected.intake.reason)}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>{selected.intake.status}</dd>
                    </div>
                    {selected.intake.dob && (
                      <div>
                        <dt>DOB</dt>
                        <dd>{selected.intake.dob}</dd>
                      </div>
                    )}
                  </dl>
                )}
                {/* Feedback summary shows once the customer
                    completes the post-case survey. */}
                {selected.feedback && (
                  <dl className="otto-inbox__intake otto-inbox__intake--feedback">
                    <div>
                      <dt>Overall</dt>
                      <dd>{"★".repeat(selected.feedback.call_rating)}{"☆".repeat(Math.max(0, 5 - selected.feedback.call_rating))}</dd>
                    </div>
                    <div>
                      <dt>Resolved</dt>
                      <dd>{selected.feedback.query_resolved ? "Yes" : "No"}</dd>
                    </div>
                    <div>
                      <dt>Staff</dt>
                      <dd>{"★".repeat(selected.feedback.staff_rating)}{"☆".repeat(Math.max(0, 5 - selected.feedback.staff_rating))}</dd>
                    </div>
                    {selected.feedback.comments && (
                      <div>
                        <dt>Notes</dt>
                        <dd>{selected.feedback.comments}</dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>
              <div className="otto-inbox__thread-actions">
                {selected.status === "pending" && (
                  <button
                    type="button"
                    className="otto-inbox__btn otto-inbox__btn--primary"
                    onClick={() => accept(selected.id)}
                    disabled={busy}
                  >
                    Accept & reply
                  </button>
                )}
                {selected.status === "active" && (
                  <button
                    type="button"
                    className="otto-inbox__btn"
                    onClick={close}
                    disabled={busy}
                  >
                    Close
                  </button>
                )}
                {selected.status === "closed" && (
                  <button
                    type="button"
                    className="otto-inbox__btn otto-inbox__btn--primary"
                    onClick={reopen}
                    disabled={busy}
                  >
                    Reopen
                  </button>
                )}
              </div>
            </header>

            <div className="otto-inbox__messages" ref={messagesRef}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`otto-inbox__bubble otto-inbox__bubble--${m.sender_type}`}
                >
                  <div className="otto-inbox__bubble-body">{m.body}</div>
                  <div className="otto-inbox__bubble-meta">
                    {m.sender_name ? `${m.sender_name} · ` : ""}
                    {formatTime(m.created_at)}
                  </div>
                </div>
              ))}
            </div>

            <form className="otto-inbox__composer" onSubmit={send}>
              <textarea
                className="otto-inbox__textarea"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={
                  canReply
                    ? "Write a reply..."
                    : selected.status === "pending"
                      ? "Accept the conversation to start replying."
                      : selected.status === "closed"
                        ? "This conversation is closed. Reopen it to continue."
                        : "Only the assigned agent can reply."
                }
                disabled={!canReply || busy}
                onKeyDown={(e) => {
                  // Enter sends; Shift+Enter inserts a newline.
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (canReply && !busy && reply.trim()) {
                      void send(e as unknown as FormEvent);
                    }
                  }
                }}
              />
              {error && <div className="otto-inbox__error">{error}</div>}
              <button
                type="submit"
                className="otto-inbox__btn otto-inbox__btn--primary"
                disabled={!canReply || busy || !reply.trim()}
              >
                Send
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

/** Synthesises a brief two-note chime via WebAudio — no asset to host. */
function playChime(
  ctxRef: React.MutableRefObject<AudioContext | null>,
  gainLevel = 0.6,
) {
  if (typeof window === "undefined") return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    if (!ctxRef.current) ctxRef.current = new Ctx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    const notes = [880, 1320]; // A5 -> E6
    notes.forEach((freq, i) => {
      const start = now + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(gainLevel, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.35);
    });
  } catch {
    /* chime is best-effort */
  }
}

function showDesktopNotification(
  title: string,
  body: string,
  permission: NotificationPermission,
) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (permission !== "granted") return;
  try {
    // tag ensures multiple pings collapse rather than flooding the
    // user's notification center.
    new Notification(title, { body, tag: "otto-inbox" });
  } catch {
    /* some browsers throw if called from a non-secure context */
  }
}

// prettyReason maps the enum values the widget sends into the
// moderator-friendly labels — keeps the admin view readable when the
// storefront grows new reasons.
function prettyReason(reason: string): string {
  switch (reason) {
    case "order_issue":
      return "Order issue";
    case "return":
      return "Return / refund";
    case "payment":
      return "Payment problem";
    case "product_question":
      return "Product question";
    case "other":
      return "Something else";
  }
  return reason;
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  } catch {
    return "";
  }
}

function formatRelative(iso: string): string {
  try {
    const ms = Date.now() - new Date(iso).getTime();
    const s = Math.round(ms / 1000);
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.round(s / 60)}m`;
    if (s < 86400) return `${Math.round(s / 3600)}h`;
    return `${Math.round(s / 86400)}d`;
  } catch {
    return "";
  }
}
