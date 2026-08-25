---
"@tesserix/admin-conformance": patch
---

Fix the `admin-conformance` binary, which npm stripped at publish time. The `bin` path was `./dist/cli.js`; npm rejects the `./` prefix and silently removed the entry, so `npx @tesserix/admin-conformance` — the invocation the contract documents — resolved to nothing. The built CLI also carried no shebang, so it could not have executed even with a valid `bin` entry.
