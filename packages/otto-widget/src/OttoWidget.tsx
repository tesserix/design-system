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
import { buildOttoApi } from "./api";
import type {
  Conversation,
  Message,
  QueueSnapshot,
  WsEnvelope,
} from "./types";
import { useOttoChannel } from "./useOttoChannel";

// Intake reason shape — each option is a value/label pair the backend
// recognises, plus a flag that toggles the date-of-birth field on the
// intake form (we only ask for DOB when the conversation is going to
// look up an account — orders, returns, payments — not for a generic
// product question).
//
// The shape is exported so host apps can build product-specific menus.
// Each product (fanzone, homechef, stockpilot, …) maintains its own
// list because a marketplace's "Order issue" makes no sense to a
// stock-analysis user. Backend tenants accept their own reason values
// — see slm-support-platform/services/otto/internal/conversation
// /model.go for the per-tenant whitelist.
export interface ReasonOption {
  value: string;
  label: string;
  requiresDob?: boolean;
  /** When false, the widget hides the "Current status / one-line
   *  summary" field and the backend skips its check. Use this for
   *  quick-ask reasons (general questions, FAQs) where the message
   *  body alone is enough context. Defaults to true (status required)
   *  to keep parity with the marketplace intake flow. */
  requiresStatus?: boolean;
}

// Default reasons match the marketplace shape Otto was originally
// designed for (mark8ly storefront). Any non-marketplace consumer
// MUST pass its own `reasons` prop.
const DEFAULT_REASON_OPTIONS: readonly ReasonOption[] = [
  { value: "general_question", label: "Ask a quick question", requiresStatus: false },
  { value: "order_issue", label: "Order issue", requiresDob: true },
  { value: "return", label: "Return / refund", requiresDob: true },
  { value: "payment", label: "Payment problem", requiresDob: true },
  { value: "product_question", label: "Product question", requiresDob: false },
  { value: "other", label: "Something else", requiresDob: false },
] as const;

// The widget talks to the host app over /api/otto (REST) and /api/otto/ws
// (WebSocket). Hosts configure both paths via props so they can mount the
// proxy wherever they like — not just in a marketplace storefront.
export interface OttoWidgetProps {
  /** REST base for the otto proxy (default "/api/otto"). */
  apiBaseUrl?: string;
  /** Function returning the WebSocket URL for a given conversation id.
   *  Default opens wss://{host}/api/v1/storefront/otto/conversations/:id/ws
   *  — routed directly to Otto by Istio, bypassing the Next.js proxy. */
  buildWsUrl?: (conversationId: string) => string;
  /** Displayed in the launcher pill. */
  launcherLabel?: string;
  /** Shown in the header when a conversation is in progress. */
  productName?: string;
  /** Welcome copy shown before the customer sends their first message. */
  intro?: string;
  /** Optional customer name prefill (for logged-in users). When both
   *  name and email are provided the OTP step is skipped entirely — the
   *  host has already vouched for the identity. Forwarded as
   *  `X-Client-User-Name` on every Otto REST call so the storefront
   *  proxy can re-emit it as `X-User-Name` for Otto's CustomerContext. */
  customerName?: string;
  /** Optional customer email prefill. Forwarded as
   *  `X-Client-User-Email` so the storefront proxy can skip OTP for
   *  already-authenticated visitors. */
  customerEmail?: string;
  /** Optional stable per-user id from the host app (e.g. firebase uid,
   *  Keycloak sub, Auth.js id). When set, forwarded as
   *  `X-Client-User-Id` — the storefront proxy needs this to mark the
   *  Otto conversation as belonging to the logged-in customer rather
   *  than starting an anonymous OTP flow. */
  customerId?: string;
  /** Optional style override (position, offsets, z-index). */
  style?: CSSProperties;
  /** Optional theme — maps to CSS custom properties. */
  theme?: Partial<OttoTheme>;
  /** Intake reasons shown in the "What can we help with?" dropdown.
   *  Each product passes its own list so the menu matches the domain
   *  (e.g. stockpilot doesn't show "Order issue"). The values are
   *  forwarded to the backend, which validates them against the
   *  tenant's whitelist. If omitted, the marketplace defaults are used. */
  reasons?: readonly ReasonOption[];
  /** Placeholder text for the "Current status / one-line summary"
   *  field. Each product passes a domain-appropriate example
   *  (e.g. fanzone -> "Points not updating after IPL #2042 match")
   *  so the marketplace-shaped "Order #2041 arrived damaged"
   *  doesn't leak into non-marketplace products. */
  statusPlaceholder?: string;
  /** Stable per-product tenant identifier (e.g. "mark8ly", "fanzone",
   *  "homechef", "stockpilot", "gameverse", "horoscope", "scrapper").
   *  Sent as the `X-Tenant-ID` header on every Otto API call so the
   *  service can route the conversation to the right per-product SLM
   *  + MCP knowledge base. Required for anything other than mark8ly. */
  tenantId?: string;
}

export interface OttoTheme {
  primary: string;
  primaryFg: string;
  accent: string;
}

const DEFAULT_BUILD_WS_URL = (conversationId: string) => {
  if (typeof window === "undefined") return "";
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/api/otto/conversations/${encodeURIComponent(conversationId)}/ws`;
};

// The widget moves through four phases:
//   collect    — customer enters name/email/message + intake (anonymous)
//                OR just the intake + message (logged-in; initial phase
//                flips to collect so the intake form can render).
//   verify     — customer enters the 6-digit code we just emailed
//   chat       — thread is live; WebSocket is open. While the case is
//                still pending, a queue overlay sits on top showing
//                position + estimated wait.
//   feedback   — case closed; 3-question survey.
type Phase = "collect" | "verify" | "chat" | "feedback";

/**
 * OttoWidget — the customer-facing floating support chat.
 *
 * Designed to be host-agnostic: drop it in any React 19 app, point
 * `apiBaseUrl` at a proxy that forwards to the otto service, done.
 * Session binding (which customer sees which thread) is handled by an
 * HttpOnly cookie the service issues; this component never reads it.
 */
export function OttoWidget({
  apiBaseUrl = "/api/otto",
  buildWsUrl = DEFAULT_BUILD_WS_URL,
  launcherLabel = "Chat with support",
  productName = "Support",
  intro = "Leave a message and someone from our team will be with you shortly. You'll see their reply here in real time.",
  customerName,
  customerEmail,
  customerId,
  style,
  theme,
  reasons = DEFAULT_REASON_OPTIONS,
  statusPlaceholder = "e.g. Order #2041 arrived damaged",
  tenantId,
}: OttoWidgetProps) {
  const api = useMemo(
    () =>
      buildOttoApi(apiBaseUrl, tenantId, {
        userId: customerId,
        email: customerEmail,
        name: customerName,
      }),
    [apiBaseUrl, tenantId, customerId, customerEmail, customerName],
  );
  // Look up DOB requirement off the configured reasons list — every
  // product can mark its own "needs an account lookup" reasons.
  const reasonRequiresDob = useCallback(
    (value: string) => reasons.some((r) => r.value === value && r.requiresDob),
    [reasons],
  );
  // The "current status / one-line summary" field is required unless
  // the selected reason explicitly opts out (general/quick-ask reasons).
  // Defaulting to true keeps the marketplace shape unchanged.
  const reasonRequiresStatus = useCallback(
    (value: string) => {
      const r = reasons.find((opt) => opt.value === value);
      return !r || r.requiresStatus !== false;
    },
    [reasons],
  );
  // The WS ticket endpoint is always the same-origin REST proxy, so the
  // Next.js layer can attach our auth cookie + internal-auth header.
  const ticketUrl = useMemo(() => {
    const base = apiBaseUrl.replace(/\/+$/, "");
    return (conversationId: string) =>
      `${base}/conversations/${encodeURIComponent(conversationId)}/ws-ticket`;
  }, [apiBaseUrl]);

  // Logged-in users (both name + email prefilled) skip OTP verification
  // but still walk through the intake form (reason + status + dob for
  // order-linked cases). So everyone starts on "collect"; logged-in
  // users just see the intake-only variant of the form.
  const isLoggedIn = Boolean(
    customerName?.trim() && customerEmail?.trim(),
  );

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("collect");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState(customerName ?? "");
  const [email, setEmail] = useState(customerEmail ?? "");
  const [pendingMessage, setPendingMessage] = useState("");
  const [chatDraft, setChatDraft] = useState("");
  // Intake form — collected on the first screen, sent with the
  // startConversation call. The backend validates reason + status
  // are non-empty and dob is present when the reason demands it.
  const [reason, setReason] = useState<string>("");
  const [statusInfo, setStatusInfo] = useState("");
  const [dob, setDob] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(() =>
    new Array(6).fill(""),
  );
  const [maskedEmail, setMaskedEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Live queue snapshot while the case is in "pending" status.
  const [queue, setQueue] = useState<QueueSnapshot | null>(null);
  // Feedback form state — populated on the feedback phase.
  const [fbCall, setFbCall] = useState(0);
  const [fbResolved, setFbResolved] = useState<boolean | null>(null);
  const [fbStaff, setFbStaff] = useState(0);
  const [fbComments, setFbComments] = useState("");
  const [fbSubmitted, setFbSubmitted] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const otpInputsRef = useRef<HTMLInputElement[]>([]);

  const wsUrl = conversation ? buildWsUrl(conversation.id) : null;

  const handleEvent = useCallback((env: WsEnvelope) => {
    if (env.type === "otto.message.created") {
      const payload = env.payload as { message: Message };
      setMessages((prev) => mergeMessages(prev, [payload.message]));
    } else if (
      env.type === "otto.conversation.updated" ||
      env.type === "otto.conversation.closed"
    ) {
      const payload = env.payload as { conversation?: Conversation };
      if (payload.conversation) setConversation(payload.conversation);
    }
  }, []);

  // backfill — re-reads conversation + messages from REST and reconciles
  // local state. Called on every WebSocket (re)connect and whenever the
  // queue-poll observes a status transition. This is the single safety
  // net that closes the well-known race between conversation creation
  // and the WS actually opening: the Otto server has no replay-on-
  // subscribe, so any envelope broadcast in that window (typically the
  // first AI/MCP reply + the pending→active status flip) is lost.
  // Without this the customer sees "Connecting to support…" until they
  // refresh, even though the server has already responded.
  const backfill = useCallback(
    async (id: string) => {
      try {
        const [fresh, list] = await Promise.all([
          api.getConversation(id),
          api.listMessages(id),
        ]);
        setConversation(fresh.conversation);
        setMessages((prev) => mergeMessages(prev, list.messages));
      } catch {
        /* transient — next reconnect or queue tick will retry */
      }
    },
    [api],
  );

  const wsTicketUrl = conversation ? ticketUrl(conversation.id) : null;
  const activeConversationId = conversation?.id;
  useOttoChannel({
    url: wsUrl,
    ticketUrl: wsTicketUrl,
    onEvent: handleEvent,
    onOpen: () => {
      if (activeConversationId) void backfill(activeConversationId);
    },
  });

  // Resume on mount — if the otto_session cookie points at an open
  // thread, restore it so page reloads don't wipe the conversation.
  // Silent failure is fine: a missing / expired cookie returns
  // {conversation: null} and the widget keeps its default state.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.resume();
        if (cancelled || !res.conversation) return;
        setConversation(res.conversation);
        setMessages(res.messages ?? []);
        setPhase(
          res.conversation.status === "closed" && !res.conversation.feedback
            ? "feedback"
            : "chat",
        );
        if (res.conversation.feedback) {
          setFbSubmitted(true);
        }
      } catch {
        /* silent — widget falls back to the collect/chat phase defaults */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api]);

  // Poll the queue endpoint while the case is pending. This is cheap
  // and gives the customer a live position/wait estimate even if the
  // WebSocket connection is flaky — once status flips to active the
  // server broadcasts a `conversation.updated` event, we stop polling.
  useEffect(() => {
    if (!conversation || conversation.status !== "pending") {
      setQueue(null);
      return;
    }
    let cancelled = false;
    const id = conversation.id;
    const tick = async () => {
      try {
        const snap = await api.queueStatus(id);
        if (cancelled) return;
        setQueue(snap);
        // Status flipped server-side (AI replied → active, staff
        // accepted → active, or sweeper closed it). Backfill both
        // conversation AND messages — the AI reply that triggered the
        // transition is itself a message envelope that the WS may have
        // missed, so refetching conversation alone leaves the customer
        // staring at an empty thread until they refresh.
        if (snap.status && snap.status !== "pending") {
          if (!cancelled) await backfill(id);
        }
      } catch {
        /* transient error — keep previous snapshot */
      }
    };
    void tick();
    const handle = window.setInterval(tick, 5_000);
    return () => {
      cancelled = true;
      window.clearInterval(handle);
    };
  }, [api, conversation, backfill]);

  // If the conversation transitions to closed while we're in the chat
  // phase, surface the feedback survey (unless the customer has
  // already submitted it on a prior session).
  useEffect(() => {
    if (!conversation) return;
    if (conversation.status === "closed" && !conversation.feedback && !fbSubmitted) {
      setPhase("feedback");
    }
  }, [conversation, fbSubmitted]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, open, phase]);

  // Auto-focus the first OTP input when we transition to the verify phase.
  useEffect(() => {
    if (phase === "verify") {
      otpInputsRef.current[0]?.focus();
    }
  }, [phase]);

  const resetError = () => setError(null);

  const otpValue = useMemo(() => otpDigits.join(""), [otpDigits]);
  const otpComplete = otpValue.length === 6 && /^\d{6}$/.test(otpValue);

  // startConversationNow is declared first because both the collect and
  // verify submit handlers below need it in their useCallback deps —
  // referencing a later const would trip the temporal dead zone at
  // render time.
  const startConversationNow = useCallback(
    async (input: { otpCode: string | undefined; message: string }) => {
      if (!reason) throw new Error("Please select a reason.");
      const needsStatus = reasonRequiresStatus(reason);
      if (needsStatus && !statusInfo.trim()) {
        throw new Error("Please describe the issue.");
      }
      if (reasonRequiresDob(reason) && !dob.trim()) {
        throw new Error("Date of birth is required for this type of case.");
      }
      const res = await api.startConversation({
        message: input.message,
        otp_code: input.otpCode,
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        reason,
        status_info: needsStatus ? statusInfo.trim() : "",
        dob: reasonRequiresDob(reason) ? dob.trim() : undefined,
      });
      setConversation(res.conversation);
      setMessages([res.first_message]);
      setPendingMessage("");
      setChatDraft("");
      setPhase("chat");
    },
    [api, email, name, reason, statusInfo, dob, reasonRequiresStatus, reasonRequiresDob],
  );

  // ── Phase 1: collect ─────────────────────────────────────────────────
  const submitCollect = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (busy) return;
      const trimmedEmail = email.trim();
      const msg = pendingMessage.trim();
      if (!isLoggedIn && !trimmedEmail) {
        setError("Email is required.");
        return;
      }
      if (!msg) {
        setError("Please describe what you need help with in the message box.");
        return;
      }
      // Intake gates — same rules the backend enforces, surfaced
      // inline so the customer doesn't round-trip to find out.
      if (!reason) {
        setError("Please pick a reason so we can route your case.");
        return;
      }
      if (reasonRequiresStatus(reason) && !statusInfo.trim()) {
        setError("A one-liner on the current status helps staff come up to speed.");
        return;
      }
      if (reasonRequiresDob(reason) && !dob.trim()) {
        setError(
          "Date of birth is required for order-related cases so staff can verify identity before sharing details.",
        );
        return;
      }
      setBusy(true);
      setError(null);
      try {
        if (isLoggedIn) {
          // Signed-in: skip OTP and go straight to creating the case.
          await startConversationNow({ otpCode: undefined, message: msg });
          return;
        }
        const res = await api.requestOtp({
          email: trimmedEmail,
          name: name.trim() || undefined,
          store_name: productName,
        });
        setMaskedEmail(res.masked_to);
        setOtpDigits(new Array(6).fill(""));
        setPhase("verify");
      } catch (err) {
        setError((err as Error).message || "Could not send the code, try again.");
      } finally {
        setBusy(false);
      }
    },
    [
      api,
      busy,
      email,
      isLoggedIn,
      name,
      pendingMessage,
      productName,
      startConversationNow,
      reason,
      statusInfo,
      dob,
    ],
  );

  // ── Phase 2: verify ──────────────────────────────────────────────────
  const submitVerify = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (busy || !otpComplete) return;
      setBusy(true);
      setError(null);
      try {
        await startConversationNow({
          otpCode: otpValue,
          message: pendingMessage.trim(),
        });
      } catch (err) {
        setError((err as Error).message || "Could not verify that code.");
        // Blank the OTP so the customer can retype cleanly.
        setOtpDigits(new Array(6).fill(""));
        otpInputsRef.current[0]?.focus();
      } finally {
        setBusy(false);
      }
    },
    [busy, otpComplete, otpValue, pendingMessage, startConversationNow],
  );

  // Re-request a fresh OTP (new challenge, reset cooldown).
  const resendOtp = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.requestOtp({
        email: email.trim(),
        name: name.trim() || undefined,
        store_name: productName,
      });
      setMaskedEmail(res.masked_to);
      setOtpDigits(new Array(6).fill(""));
      otpInputsRef.current[0]?.focus();
    } catch (err) {
      setError((err as Error).message || "Could not resend the code.");
    } finally {
      setBusy(false);
    }
  }, [api, busy, email, name, productName]);

  // ── Phase 3: chat ────────────────────────────────────────────────────
  // Logged-in users: submitting from the chat phase (their first message
  // is entered here too) must call startConversation directly if they
  // haven't opened a thread yet.
  const submitChat = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (busy) return;
      const text = chatDraft.trim();
      if (!text) return;
      setBusy(true);
      setError(null);
      try {
        if (!conversation) {
          // Logged-in path — no OTP.
          await startConversationNow({ otpCode: undefined, message: text });
        } else {
          const res = await api.sendMessage(conversation.id, text);
          setMessages((prev) => mergeMessages(prev, [res.message]));
          setChatDraft("");
        }
      } catch (err) {
        setError((err as Error).message || "Message did not send.");
      } finally {
        setBusy(false);
      }
    },
    [api, busy, chatDraft, conversation, startConversationNow],
  );

  // ── Phase 4: feedback ───────────────────────────────────────────────
  const submitFeedbackNow = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (busy || !conversation) return;
      if (fbResolved === null) {
        setError("Let us know whether your query was resolved.");
        return;
      }
      setBusy(true);
      setError(null);
      try {
        await api.submitFeedback(conversation.id, {
          call_rating: fbCall,
          query_resolved: fbResolved,
          staff_rating: fbStaff,
          comments: fbComments.trim() || undefined,
        });
        setFbSubmitted(true);
      } catch (err) {
        setError((err as Error).message || "Could not submit feedback.");
      } finally {
        setBusy(false);
      }
    },
    [api, busy, conversation, fbCall, fbResolved, fbStaff, fbComments],
  );

  const themedStyle = useMemo<CSSProperties>(() => {
    const vars: Record<string, string> = {};
    if (theme?.primary) vars["--otto-primary"] = theme.primary;
    if (theme?.primaryFg) vars["--otto-primary-fg"] = theme.primaryFg;
    if (theme?.accent) vars["--otto-accent"] = theme.accent;
    return { ...vars, ...style } as CSSProperties;
  }, [style, theme]);

  const subtitle = conversation
    ? statusSubtitle(conversation)
    : isLoggedIn
      ? `Hi ${firstWord(customerName)} — we reply within a few minutes`
      : "Usually replies within a few minutes";

  return (
    <div className="otto-widget" style={themedStyle}>
      {!open ? (
        <button
          type="button"
          className="otto-widget__launcher"
          onClick={() => {
            setOpen(true);
            resetError();
          }}
          aria-label="Open support chat"
        >
          <span className="otto-widget__launcher-dot" aria-hidden="true" />
          {launcherLabel}
        </button>
      ) : (
        <section className="otto-widget__panel" role="dialog" aria-label="Support chat">
          <header className="otto-widget__header">
            <div className="otto-widget__title">
              <strong>{productName}</strong>
              <span className="otto-widget__subtitle" title={subtitle}>
                {subtitle}
              </span>
              {conversation?.case_id && (
                <span
                  className="otto-widget__case-id"
                  title="Quote this reference if you contact us again"
                >
                  Case {conversation.case_id}
                </span>
              )}
            </div>
            <button
              type="button"
              className="otto-widget__close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          {conversation && (
            <div
              className="otto-widget__status"
              data-tone={conversation.status === "active" ? "active" : conversation.status}
            >
              {statusLabel(conversation)}
            </div>
          )}

          {/* COLLECT */}
          {phase === "collect" && (
            <>
              <div className="otto-widget__intro">
                <strong>Start a conversation</strong>
                <p style={{ marginTop: 6, marginBottom: 0 }}>{intro}</p>
              </div>
              <form className="otto-widget__form" onSubmit={submitCollect}>
                {!isLoggedIn && (
                  <div className="otto-widget__row">
                    <input
                      className="otto-widget__input"
                      placeholder="Your name (optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={busy}
                      aria-label="Your name"
                    />
                    <input
                      className="otto-widget__input"
                      placeholder="Email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={busy}
                      aria-label="Your email"
                    />
                  </div>
                )}

                {/* Intake — reason routes the case, status is the
                    short "what's happening" summary, dob is only asked
                    when the reason implies an account/order lookup. */}
                <label
                  className="otto-widget__field-label"
                  htmlFor="otto-reason"
                >
                  What can we help with?
                </label>
                <select
                  id="otto-reason"
                  className="otto-widget__input"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as string)}
                  disabled={busy}
                  required
                  aria-label="Reason"
                >
                  <option value="">Select a reason…</option>
                  {reasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>

                {/* Quick-ask reasons (general_question) skip this field
                    so a one-tap message lands without a second input. */}
                {reason && reasonRequiresStatus(reason) && (
                  <>
                    <label
                      className="otto-widget__field-label"
                      htmlFor="otto-status"
                    >
                      Current status / one-line summary
                    </label>
                    <input
                      id="otto-status"
                      className="otto-widget__input"
                      placeholder={statusPlaceholder}
                      value={statusInfo}
                      onChange={(e) => setStatusInfo(e.target.value)}
                      disabled={busy}
                      required
                      aria-label="Status summary"
                    />
                  </>
                )}

                {reason && reasonRequiresDob(reason) && (
                  <>
                    <label
                      className="otto-widget__field-label"
                      htmlFor="otto-dob"
                    >
                      Date of birth <span style={{ opacity: 0.6 }}>(for verification)</span>
                    </label>
                    <input
                      id="otto-dob"
                      className="otto-widget__input"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      disabled={busy}
                      required
                      aria-label="Date of birth"
                    />
                  </>
                )}

                <label
                  className="otto-widget__field-label"
                  htmlFor="otto-message"
                >
                  Your message
                </label>
                <textarea
                  id="otto-message"
                  className="otto-widget__textarea"
                  placeholder="Type your message..."
                  value={pendingMessage}
                  onChange={(e) => setPendingMessage(e.target.value)}
                  disabled={busy}
                  aria-label="Message"
                />
                {error && <div className="otto-widget__error">{error}</div>}
                <button
                  type="submit"
                  className="otto-widget__submit"
                  disabled={
                    busy ||
                    (!isLoggedIn && !email.trim()) ||
                    !pendingMessage.trim() ||
                    !reason ||
                    // Quick-ask reasons (requiresStatus: false) skip the
                    // status field entirely — only enforce it when the
                    // selected reason actually requires it.
                    (reasonRequiresStatus(reason || "") && !statusInfo.trim()) ||
                    (reasonRequiresDob(reason || "") && !dob.trim())
                  }
                >
                  {busy
                    ? isLoggedIn
                      ? "Starting…"
                      : "Sending code..."
                    : isLoggedIn
                      ? "Start chat"
                      : "Continue"}
                </button>
                {!isLoggedIn && (
                  <p className="otto-widget__fineprint">
                    We&apos;ll email you a 6-digit code to confirm it&apos;s really you.
                  </p>
                )}
              </form>
            </>
          )}

          {/* VERIFY */}
          {phase === "verify" && (
            <>
              <div className="otto-widget__intro">
                <strong>Check your inbox</strong>
                <p style={{ marginTop: 6, marginBottom: 0 }}>
                  We sent a 6-digit code to <strong>{maskedEmail || email}</strong>.
                  Enter it below to continue.
                </p>
              </div>
              <form className="otto-widget__form" onSubmit={submitVerify}>
                <div
                  className="otto-widget__otp-row"
                  role="group"
                  aria-label="6-digit verification code"
                >
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        if (el) otpInputsRef.current[idx] = el;
                      }}
                      className="otto-widget__otp-cell"
                      inputMode="numeric"
                      autoComplete={idx === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 1);
                        setOtpDigits((prev) => {
                          const next = [...prev];
                          next[idx] = v;
                          return next;
                        });
                        if (v && idx < 5) otpInputsRef.current[idx + 1]?.focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
                          otpInputsRef.current[idx - 1]?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        const pasted = e.clipboardData
                          .getData("text")
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        if (pasted.length === 0) return;
                        e.preventDefault();
                        const next = new Array(6).fill("");
                        for (let i = 0; i < pasted.length; i++) {
                          next[i] = pasted[i];
                        }
                        setOtpDigits(next);
                        const nextIdx = Math.min(pasted.length, 5);
                        otpInputsRef.current[nextIdx]?.focus();
                      }}
                      disabled={busy}
                      aria-label={`Digit ${idx + 1}`}
                    />
                  ))}
                </div>
                {error && <div className="otto-widget__error">{error}</div>}
                <button
                  type="submit"
                  className="otto-widget__submit"
                  disabled={busy || !otpComplete}
                >
                  {busy ? "Verifying..." : "Start chat"}
                </button>
                <div className="otto-widget__verify-actions">
                  <button
                    type="button"
                    className="otto-widget__link"
                    onClick={resendOtp}
                    disabled={busy}
                  >
                    Resend code
                  </button>
                  <button
                    type="button"
                    className="otto-widget__link"
                    onClick={() => {
                      setPhase("collect");
                      setOtpDigits(new Array(6).fill(""));
                      resetError();
                    }}
                    disabled={busy}
                  >
                    Edit email
                  </button>
                </div>
              </form>
            </>
          )}

          {/* CHAT */}
          {phase === "chat" && (
            <>
              {/* Queue overlay — sits above the messages while the
                  case is pending. Position polls every 5s. Once a
                  staff member accepts, status flips to "active" and
                  this block disappears. */}
              {conversation?.status === "pending" && (
                <div
                  className="otto-widget__queue"
                  role="status"
                  aria-live="polite"
                >
                  <div className="otto-widget__queue-spinner" aria-hidden="true" />
                  <div>
                    <strong>Connecting to support…</strong>
                    {queue && queue.position > 0 && (
                      <p className="otto-widget__queue-line">
                        You are <strong>#{queue.position}</strong> in the queue.
                        {queue.estimated_wait_seconds > 0 && (
                          <>
                            {" "}Approx wait{" "}
                            <strong>
                              {formatWait(queue.estimated_wait_seconds)}
                            </strong>.
                          </>
                        )}
                      </p>
                    )}
                    {queue && queue.position === 1 && queue.total_pending > 0 && (
                      <p className="otto-widget__queue-line">
                        You&apos;re next — holding for the first available
                        team member.
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="otto-widget__messages" ref={messagesRef}>
                {messages.length === 0 && !conversation && (
                  <p className="otto-widget__empty">
                    {isLoggedIn
                      ? "Your messages will appear here."
                      : "Your messages will appear here."}
                  </p>
                )}
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
              </div>
              <form className="otto-widget__form" onSubmit={submitChat}>
                <textarea
                  className="otto-widget__textarea"
                  placeholder={
                    conversation?.status === "closed"
                      ? "This conversation is closed."
                      : "Type your message..."
                  }
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  disabled={busy || conversation?.status === "closed"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void submitChat(e as unknown as FormEvent);
                    }
                  }}
                  aria-label="Message"
                />
                {error && <div className="otto-widget__error">{error}</div>}
                <button
                  type="submit"
                  className="otto-widget__submit"
                  disabled={
                    busy ||
                    !chatDraft.trim() ||
                    conversation?.status === "closed"
                  }
                >
                  {busy ? "Sending..." : conversation ? "Send" : "Start chat"}
                </button>
              </form>
            </>
          )}

          {/* FEEDBACK */}
          {phase === "feedback" && (
            <div className="otto-widget__feedback">
              {fbSubmitted ? (
                <ClosedCaseSummary
                  conversation={conversation}
                  reasons={reasons}
                  onStartNew={() => {
                    // Start fresh — new intake, new case, new
                    // position in the queue. Closed cases cannot be
                    // resumed by the customer from this side, so we
                    // deliberately clear everything.
                    setConversation(null);
                    setMessages([]);
                    setFbSubmitted(false);
                    setFbCall(0);
                    setFbStaff(0);
                    setFbResolved(null);
                    setFbComments("");
                    setReason("");
                    setStatusInfo("");
                    setDob("");
                    setPendingMessage("");
                    setChatDraft("");
                    setError(null);
                    setPhase("collect");
                  }}
                />
              ) : (
                <>
                  <div className="otto-widget__intro">
                    <strong>How did we do?</strong>
                    <p style={{ marginTop: 6, marginBottom: 0 }}>
                      Your case has been closed. Three quick questions
                      to help us get better.
                    </p>
                  </div>
                  <form
                    className="otto-widget__form"
                    onSubmit={submitFeedbackNow}
                  >
                    <FeedbackStars
                      label="How was the support experience overall?"
                      value={fbCall}
                      onChange={setFbCall}
                      disabled={busy}
                    />

                    <fieldset className="otto-widget__resolved-row">
                      <legend className="otto-widget__field-label">
                        Was your query resolved?
                      </legend>
                      <label className="otto-widget__radio">
                        <input
                          type="radio"
                          name="fb-resolved"
                          checked={fbResolved === true}
                          onChange={() => setFbResolved(true)}
                          disabled={busy}
                        />
                        Yes
                      </label>
                      <label className="otto-widget__radio">
                        <input
                          type="radio"
                          name="fb-resolved"
                          checked={fbResolved === false}
                          onChange={() => setFbResolved(false)}
                          disabled={busy}
                        />
                        No
                      </label>
                    </fieldset>

                    <FeedbackStars
                      label={
                        conversation?.assignee?.name
                          ? `How was ${conversation.assignee.name}?`
                          : "How was the team member who helped you?"
                      }
                      value={fbStaff}
                      onChange={setFbStaff}
                      disabled={busy}
                    />

                    <label
                      className="otto-widget__field-label"
                      htmlFor="otto-fb-comments"
                    >
                      Anything else?{" "}
                      <span style={{ opacity: 0.6 }}>(optional)</span>
                    </label>
                    <textarea
                      id="otto-fb-comments"
                      className="otto-widget__textarea"
                      value={fbComments}
                      onChange={(e) => setFbComments(e.target.value)}
                      disabled={busy}
                      placeholder="Share anything that stood out — good or bad"
                      aria-label="Additional comments"
                    />
                    {error && <div className="otto-widget__error">{error}</div>}
                    <button
                      type="submit"
                      className="otto-widget__submit"
                      disabled={busy || fbResolved === null}
                    >
                      {busy ? "Submitting…" : "Submit feedback"}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ClosedCaseSummary is the final screen a customer sees after they
// submit feedback on a closed case. Shows the case reference, the
// reason they originally gave, when it closed, and whether the
// automation closed it (inactivity) vs. staff closed it. Ends with a
// "Start a new chat" action — the closed case is intentionally NOT
// resumable from here, so starting a new conversation means a fresh
// case id and a fresh position in the queue.
function ClosedCaseSummary({
  conversation,
  onStartNew,
  reasons,
}: {
  conversation: Conversation | null;
  onStartNew: () => void;
  reasons: readonly ReasonOption[];
}) {
  if (!conversation) {
    return (
      <div className="otto-widget__intro">
        <strong>Thanks for the feedback.</strong>
        <p style={{ marginTop: 6, marginBottom: 0 }}>
          It goes straight to the team.
        </p>
      </div>
    );
  }
  const closedByInactivity = Boolean(conversation.inactivity_closed_at);
  const closedAt = conversation.closed_at ?? conversation.inactivity_closed_at;
  const labelForReason = conversation.intake
    ? reasonLabel(reasons, conversation.intake.reason)
    : null;
  return (
    <div className="otto-widget__summary">
      <div className="otto-widget__intro">
        <strong>Thanks — your feedback is in.</strong>
        <p style={{ marginTop: 6, marginBottom: 0 }}>
          Here&apos;s a record of this case for your reference. You
          can&apos;t reopen this case, but you&apos;re welcome to
          start a new chat anytime.
        </p>
      </div>
      <dl className="otto-widget__summary-list">
        {conversation.case_id && (
          <div>
            <dt>Case</dt>
            <dd>{conversation.case_id}</dd>
          </div>
        )}
        {labelForReason && (
          <div>
            <dt>Reason</dt>
            <dd>{labelForReason}</dd>
          </div>
        )}
        {conversation.intake?.status && (
          <div>
            <dt>Summary</dt>
            <dd>{conversation.intake.status}</dd>
          </div>
        )}
        {conversation.assignee?.name && (
          <div>
            <dt>Handled by</dt>
            <dd>{conversation.assignee.name}</dd>
          </div>
        )}
        {closedAt && (
          <div>
            <dt>Closed</dt>
            <dd>
              {new Date(closedAt).toLocaleString()}
              {closedByInactivity && (
                <span className="otto-widget__summary-hint">
                  {" "}· auto-closed after 15 min of no reply
                </span>
              )}
            </dd>
          </div>
        )}
      </dl>
      <button
        type="button"
        className="otto-widget__submit"
        onClick={onStartNew}
      >
        Start a new chat
      </button>
    </div>
  );
}

// Per-render lookup so the summary screen can show the human-readable
// label for whichever `reasons` list the host configured.
function reasonLabel(reasons: readonly ReasonOption[], value: string): string {
  return reasons.find((r) => r.value === value)?.label ?? value;
}

// FeedbackStars renders a 1-5 star picker for a single survey
// question. We store 0 as "not answered" so the backend can
// distinguish a skipped question from a one-star rating.
function FeedbackStars({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="otto-widget__field-label">{label}</div>
      <div className="otto-widget__stars" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`otto-widget__star${n <= value ? " otto-widget__star--on" : ""}`}
            onClick={() => onChange(n)}
            disabled={disabled}
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

// mergeMessages reconciles a (possibly stale) local list with a fresh
// server list. The server list is canonical, but we preserve any local
// messages whose ids haven't reached the server snapshot yet (e.g. a
// just-sent customer message whose REST response races the listMessages
// refetch). Result is sorted by created_at so backfill, WS events, and
// optimistic sends all interleave in chronological order regardless of
// which path landed them.
function mergeMessages(prev: Message[], incoming: Message[]): Message[] {
  if (incoming.length === 0) return prev;
  const byId = new Map<string, Message>();
  for (const m of prev) byId.set(m.id, m);
  for (const m of incoming) byId.set(m.id, m);
  const merged = Array.from(byId.values());
  merged.sort((a, b) => {
    if (a.created_at === b.created_at) return a.id.localeCompare(b.id);
    return a.created_at < b.created_at ? -1 : 1;
  });
  return merged;
}

// formatWait turns "180" into "3 min" and "45" into "<1 min". Keeps
// the customer-facing copy tight.
function formatWait(seconds: number): string {
  if (seconds <= 0) return "";
  const mins = Math.round(seconds / 60);
  if (mins <= 1) return "<1 min";
  return `${mins} min`;
}

function MessageBubble({ message }: { message: Message }) {
  const className =
    message.sender_type === "customer"
      ? "otto-widget__msg otto-widget__msg--customer"
      : message.sender_type === "staff"
        ? "otto-widget__msg otto-widget__msg--staff"
        : "otto-widget__msg otto-widget__msg--system";
  return (
    <div className={className}>
      {message.body}
      {message.sender_type !== "system" && (
        <span className="otto-widget__msg-meta">
          {message.sender_name ? `${message.sender_name} · ` : ""}
          {formatTime(message.created_at)}
        </span>
      )}
    </div>
  );
}

function statusLabel(c: Conversation): string {
  if (c.status === "pending") return "Waiting for an agent to join...";
  if (c.status === "closed") return "This conversation has been closed.";
  const who = c.assignee?.name ?? c.assignee?.email ?? "An agent";
  return `${who} is helping you now.`;
}

function statusSubtitle(c: Conversation): string {
  if (c.status === "closed") return "Closed";
  if (c.status === "pending") return "Queued — we'll be right with you";
  return c.assignee?.name ?? c.assignee?.email ?? "Agent connected";
}

function firstWord(name: string | undefined): string {
  if (!name) return "there";
  return name.trim().split(/\s+/)[0] || "there";
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
