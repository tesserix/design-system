"use client";

import { useEffect, useRef, useState } from "react";
import type { WsEnvelope } from "./types";

export type ChannelState = "idle" | "connecting" | "open" | "closed" | "error";

export interface UseOttoChannelOptions {
  /** The WebSocket URL (ws:// or wss://). Pass null/undefined to stay
   *  disconnected. The hook appends `?ticket=` automatically once the
   *  ticketUrl POST returns. */
  url: string | null | undefined;
  /** REST endpoint that mints a short-lived signed ticket. The client
   *  must call this BEFORE opening the socket — the WS path itself is
   *  routed direct to Otto by Istio, bypassing the Next.js proxy, so the
   *  usual header-based auth can't reach the service. A fresh ticket is
   *  minted for every reconnect. */
  ticketUrl: string | null | undefined;
  /** Called for every envelope the server sends. */
  onEvent?: (env: WsEnvelope) => void;
  /** Called every time the socket transitions to OPEN — initial connect
   *  and every reconnect. The Otto WS handler has no replay-on-subscribe
   *  semantics, so any event the server broadcast between conversation
   *  creation and the socket actually opening is dropped on the floor.
   *  Hosts use this hook to backfill conversation + message state from
   *  REST so the UI converges to ground truth on every (re)connect. */
  onOpen?: () => void;
  /** Called when the server tells us the conversation is no longer
   *  accessible to this customer's session — typically because the
   *  inactivity sweeper closed it. Without this signal the hook
   *  would retry the WS forever (Otto returns 200 on ws-ticket but
   *  403 on the WS upgrade, since the ticket's session_token no
   *  longer owns the conversation). Host should drop the
   *  conversation id, clear its session-storage state, and fall
   *  back to the empty/welcome UI. */
  onUnauthorized?: () => void;
  /** Exponential backoff cap in milliseconds (default 10s). */
  maxBackoffMs?: number;
}

/**
 * useOttoChannel opens a WebSocket to the otto service and auto-reconnects
 * with exponential backoff. Tickets are fetched fresh on every connect so
 * a stale ticket (TTL = 2 min server-side) can't block reconnection.
 */
export function useOttoChannel({
  url,
  ticketUrl,
  onEvent,
  onOpen,
  onUnauthorized,
  maxBackoffMs = 10_000,
}: UseOttoChannelOptions) {
  const [state, setState] = useState<ChannelState>("idle");
  const socketRef = useRef<WebSocket | null>(null);
  const shouldRunRef = useRef(true);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const onUnauthorizedRef = useRef(onUnauthorized);
  onUnauthorizedRef.current = onUnauthorized;

  useEffect(() => {
    if (!url || !ticketUrl) {
      setState("idle");
      return;
    }
    shouldRunRef.current = true;
    let attempt = 0;
    // Number of WS connects that closed without ever firing onopen.
    // The browser WebSocket API doesn't expose the HTTP status code on
    // failed upgrades (server returned 403 — the JS spec only gives
    // us close code 1006 and no body). Counting close-without-open
    // sequences is the only signal we have for "the server keeps
    // rejecting this conversation". After threshold we treat it as
    // "session no longer authorised for this conversation" and tell
    // the host to drop state instead of retrying forever.
    let failuresWithoutOpen = 0;
    const UNAUTHORIZED_THRESHOLD = 3;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let abort: AbortController | null = null;

    const giveUp = () => {
      shouldRunRef.current = false;
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      setState("closed");
      try {
        onUnauthorizedRef.current?.();
      } catch {
        /* host bug — never let it bubble up */
      }
    };

    const connect = async () => {
      if (!shouldRunRef.current) return;
      setState("connecting");
      abort = new AbortController();
      let ticket: string;
      try {
        const res = await fetch(ticketUrl, {
          method: "POST",
          credentials: "include",
          signal: abort.signal,
        });
        // 401/403 on the ticket itself = the customer's session
        // doesn't own this conversation anymore (sweeper closed it,
        // cookie expired, etc.). Stop retrying immediately —
        // ticket auth doesn't transient-recover.
        if (res.status === 401 || res.status === 403) {
          giveUp();
          return;
        }
        if (!res.ok) throw new Error(`ticket ${res.status}`);
        const body = (await res.json()) as { ticket: string };
        ticket = body.ticket;
      } catch {
        setState("error");
        if (!shouldRunRef.current) return;
        attempt += 1;
        const delay = Math.min(1000 * 2 ** Math.min(attempt, 4), maxBackoffMs);
        retryTimer = setTimeout(() => {
          void connect();
        }, delay);
        return;
      }

      const separator = url.includes("?") ? "&" : "?";
      const wsUrl = `${url}${separator}ticket=${encodeURIComponent(ticket)}`;
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;
      let opened = false;

      ws.onopen = () => {
        opened = true;
        attempt = 0;
        failuresWithoutOpen = 0;
        setState("open");
        // Fire AFTER state flips so consumer's onOpen sees an "open"
        // channel if it inspects state. Wrapped in try/catch so a
        // throwing host callback can't tear down the socket.
        try {
          onOpenRef.current?.();
        } catch {
          /* host bug — never let it kill the WS lifecycle */
        }
      };
      ws.onmessage = (ev) => {
        try {
          const env = JSON.parse(ev.data) as WsEnvelope;
          onEventRef.current?.(env);
        } catch {
          /* ignore malformed */
        }
      };
      ws.onerror = () => setState("error");
      ws.onclose = () => {
        setState("closed");
        if (!shouldRunRef.current) return;
        if (!opened) {
          // Close without ever opening — likely a 403 on the WS
          // upgrade (the browser gives us code 1006 either way).
          // Three of these in a row and we conclude the
          // conversation is no longer authorised; reset host state
          // instead of looping forever.
          failuresWithoutOpen += 1;
          if (failuresWithoutOpen >= UNAUTHORIZED_THRESHOLD) {
            giveUp();
            return;
          }
        }
        attempt += 1;
        const delay = Math.min(1000 * 2 ** Math.min(attempt, 4), maxBackoffMs);
        retryTimer = setTimeout(() => {
          void connect();
        }, delay);
      };
    };

    void connect();

    return () => {
      shouldRunRef.current = false;
      if (retryTimer) clearTimeout(retryTimer);
      abort?.abort();
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [url, ticketUrl, maxBackoffMs]);

  return { state };
}
