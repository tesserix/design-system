---
"@tesserix/otto-widget": patch
---

Otto inbox + widget UX fixes:

- **Enter-to-send** in the staff reply box and the customer intake message (Shift+Enter inserts a newline). The active-chat composer already supported this.
- **Closing a case now moves it to Closed in real time.** The inbox WS status handler relocates a conversation between tabs when its status changes (accept → Active, close → Closed, reopen) instead of relabelling it in place, so a closed case no longer lingers in the Active list. The close action also updates the list optimistically and flips the thread pane to the closed (reopen-able) state without a refresh.
