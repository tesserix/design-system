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
  maxBackoffMs = 10_000,
}: UseOttoChannelOptions) {
  const [state, setState] = useState<ChannelState>("idle");
  const socketRef = useRef<WebSocket | null>(null);
  const shouldRunRef = useRef(true);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!url || !ticketUrl) {
      setState("idle");
      return;
    }
    shouldRunRef.current = true;
    let attempt = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let abort: AbortController | null = null;

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

      ws.onopen = () => {
        attempt = 0;
        setState("open");
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
