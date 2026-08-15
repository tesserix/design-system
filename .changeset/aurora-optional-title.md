---
"@tesserix/web": patch
---

Make `AuroraAuthPanel`'s `title` optional.

Hosts that already render their own heading — the Zitadel login, where every
step supplies its own translated `<h1>` — were forced to either nest headings
or leave an empty one in the card.
