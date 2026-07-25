// Compile-only regression guard (not shipped — see package.json "files").
// Proves the OttoInbox public prop surface stays source-compatible for
// existing single-tenant consumers, and that platform mode type-checks.
import { OttoInbox } from "../src/index";

// 1. Legacy single-tenant usage (mark8ly admin) — existing props only.
//    Must keep compiling with no changes.
export function LegacyConsumer() {
  return (
    <OttoInbox
      apiBaseUrl="/api/admin/otto"
      buildInboxWsUrl={() => "wss://example/api/v1/admin/otto/ws"}
      buildConversationWsUrl={(id) =>
        `wss://example/api/v1/admin/otto/conversations/${id}/ws`
      }
      currentUserId="staff-1"
      onToast={(_tone, _title, _desc) => {}}
    />
  );
}

// 2. Minimal legacy usage — only the required prop.
export function MinimalConsumer() {
  return <OttoInbox currentUserId="staff-1" />;
}

// 3. Platform-mode usage — tenantLabels present.
export function PlatformConsumer() {
  return (
    <OttoInbox
      apiBaseUrl="/api/admin/otto"
      currentUserId="staff-1"
      tenantLabels={{ homechef: "HomeChef", fanzone: "FanZone" }}
    />
  );
}

// 4. Platform-mode with empty labels (opt-in, raw ids as fallback).
export function PlatformEmptyLabels() {
  return <OttoInbox currentUserId="staff-1" tenantLabels={{}} />;
}
