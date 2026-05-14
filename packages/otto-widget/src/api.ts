import type { Conversation, Message, QueueSnapshot } from "./types";

export interface OttoApi {
  /** Start a new thread. Returns conversation + opening message. The
   *  `otp_code` field is required for anonymous callers — logged-in users
   *  (whose identity the storefront proxy forwards server-side) can omit
   *  it and are accepted on their existing session.
   *
   *  Intake fields (`reason`, `status_info`, optional `dob`) are
   *  required per backend policy — `reason` and `status_info` are
   *  always required; `dob` is required when reason ∈ {order_issue,
   *  return, payment}. The widget collects them on a dedicated screen
   *  before this call fires. */
  startConversation(input: {
    subject?: string;
    name?: string;
    email?: string;
    message: string;
    otp_code?: string;
    reason: string;
    status_info: string;
    dob?: string;
  }): Promise<{ conversation: Conversation; first_message: Message }>;
  /** Request a 6-digit verification code be emailed to the given address. */
  requestOtp(input: {
    email: string;
    name?: string;
    store_name?: string;
  }): Promise<{ sent: boolean; masked_to: string }>;
  /** Fetch the conversation the caller is currently bound to. */
  getConversation(id: string): Promise<{ conversation: Conversation }>;
  /** Fetch full message history for a thread. */
  listMessages(id: string): Promise<{ messages: Message[] }>;
  /** Send a new message as the customer. */
  sendMessage(id: string, body: string): Promise<{ message: Message }>;
  /** Close the conversation from the customer side. */
  closeConversation(id: string): Promise<{ conversation: Conversation }>;
  /** Resume the customer's most recent open thread. Returns
   *  `{ conversation: null }` (200) when there's nothing to resume —
   *  the widget falls through to its start-fresh flow in that case. */
  resume(): Promise<{
    conversation: Conversation | null;
    messages?: Message[];
  }>;
  /** Poll the queue position + estimated wait while status is pending. */
  queueStatus(id: string): Promise<QueueSnapshot>;
  /** Submit post-case feedback. Returns the updated conversation. */
  submitFeedback(
    id: string,
    input: {
      call_rating: number;
      query_resolved: boolean;
      staff_rating: number;
      comments?: string;
    },
  ): Promise<{ conversation: Conversation }>;
  /** Per-message reaction (thumbs up / down). Best-effort — the
   *  widget keeps the local optimistic state even when this
   *  returns 404 (backend not yet wired) or otherwise errors,
   *  so a missing endpoint can't break the chat UX. */
  reactToMessage(
    conversationId: string,
    messageId: string,
    reaction: "up" | "down",
  ): Promise<{ ok: boolean }>;
}

/**
 * buildOttoApi returns a ready-to-use client scoped to the given base URL.
 * In the storefront this is `/api/otto` (the Next.js proxy prefix).
 * In the admin app — or any future host — swap the base and the calls work
 * identically.
 */
export interface OttoApiIdentity {
  /** Stable per-user id from the host app (e.g. firebase uid).
   *  Forwarded as `X-Client-User-Id` so the storefront proxy can skip
   *  the OTP step for logged-in users. */
  userId?: string;
  /** Logged-in user's email — forwarded as `X-Client-User-Email`. */
  email?: string;
  /** Display name — forwarded as `X-Client-User-Name`. */
  name?: string;
}

export function buildOttoApi(
  baseUrl: string,
  tenantId?: string,
  identity?: OttoApiIdentity,
): OttoApi {
  const base = baseUrl.replace(/\/+$/, "");
  // X-Tenant-ID lets the backend route the request to the per-product
  // SLM and MCP knowledge base. Set by the host app from a stable
  // product identifier ("fanzone", "homechef", "stockpilot", etc.). If
  // omitted the backend falls back to its default tenant (mark8ly's
  // marketplace shape) — which is why every non-marketplace product
  // MUST pass tenantId explicitly.
  //
  // X-Client-User-* headers carry the logged-in customer's identity
  // through the storefront proxy. The proxy re-emits them as
  // X-User-* headers Otto's CustomerContext middleware reads, which
  // skips the OTP step entirely. Anonymous customers leave these
  // unset — they go through email + OTP.
  const baseHeaders: Record<string, string> = {};
  if (tenantId) baseHeaders["X-Tenant-ID"] = tenantId;
  if (identity?.userId) baseHeaders["X-Client-User-Id"] = identity.userId;
  if (identity?.email) baseHeaders["X-Client-User-Email"] = identity.email;
  if (identity?.name) baseHeaders["X-Client-User-Name"] = identity.name;
  const post = async <T,>(path: string, body?: unknown): Promise<T> => {
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...baseHeaders },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw await toError(res);
    return (await res.json()) as T;
  };
  const get = async <T,>(path: string): Promise<T> => {
    const res = await fetch(`${base}${path}`, {
      credentials: "include",
      headers: baseHeaders,
    });
    if (!res.ok) throw await toError(res);
    return (await res.json()) as T;
  };

  return {
    startConversation: (input) => post("/conversations", input),
    requestOtp: (input) => post("/verify/start", input),
    getConversation: (id) => get(`/conversations/${encodeURIComponent(id)}`),
    listMessages: (id) =>
      get(`/conversations/${encodeURIComponent(id)}/messages`),
    sendMessage: (id, body) =>
      post(`/conversations/${encodeURIComponent(id)}/messages`, { body }),
    closeConversation: (id) =>
      post(`/conversations/${encodeURIComponent(id)}/close`, {}),
    resume: () => get("/resume"),
    queueStatus: (id) => get(`/conversations/${encodeURIComponent(id)}/queue`),
    submitFeedback: (id, input) =>
      post(`/conversations/${encodeURIComponent(id)}/feedback`, input),
    reactToMessage: (id, messageId, reaction) =>
      post(
        `/conversations/${encodeURIComponent(id)}/messages/${encodeURIComponent(messageId)}/reaction`,
        { reaction },
      ),
  };
}

async function toError(res: Response): Promise<Error> {
  let msg = `request failed (${res.status})`;
  try {
    const body = (await res.json()) as { error?: string; message?: string };
    if (body.message) msg = body.message;
    else if (body.error) msg = body.error;
  } catch {
    /* keep default */
  }
  const e = new Error(msg) as Error & { status?: number };
  e.status = res.status;
  return e;
}
