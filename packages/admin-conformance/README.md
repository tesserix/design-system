# @tesserix/admin-conformance

Checks a product's `/admin/*` surface against the **Product Admin Integration
Contract**, in that product's own CI.

> A document alone produces exactly the drift it describes. The enforcement
> mechanism is the deliverable.
> — the contract, §5

## Usage

```bash
ADMIN_CONFORMANCE_SECRET=… npx @tesserix/admin-conformance \
  --base https://your-product/api/v1/platform \
  --slug your-product
```

Exit codes are deliberately distinct:

| code | meaning |
|---|---|
| `0` | every declared endpoint conforms |
| `1` | a declared endpoint deviates |
| `2` | the suite could not run (no secret, bad flags, unreadable declaration) |

A CI job that cannot tell `1` from `2` will eventually treat a broken harness
as a failing product.

## Declaring what you implement

Commit an `admin-conformance.json` at your repo root:

```json
{
  "slug": "mark8ly",
  "contractVersion": 2,
  "endpoints": {
    "audit-logs": true,
    "health": true,
    "entities": { "types": ["tenants", "users"] },
    "inbox": { "slaDeclared": true },
    "tenant-lifecycle": true,
    "lifecycle/reason-codes": true
  }
}
```

**Absence means not implemented.** Undeclared endpoints are skipped, and
declaring one is what opts it into enforcement. Partial implementation is
legitimate; silent deviation is not.

A typo'd endpoint key is a hard error rather than a silent skip — a key that
quietly meant "not implemented" would report as a pass, which is the exact
failure this file exists to prevent.

`entities` requires `types`, because its path is incomplete without them.
`inbox` takes `slaDeclared`: `due_at` is required of an item only where an SLA
exists, and a product with no SLA looks identical on the wire to one that
forgot the field.

## The secret

Read from `ADMIN_CONFORMANCE_SECRET`, never from a flag. Anything on `argv` is
visible in `ps`, in CI logs that echo the command, and in shell history — so
`--secret` is refused with an error telling you where it belongs.

## A note on `--base`

Point it at the **full** front door, including any platform prefix. mark8ly
serves this surface at `/api/v1/platform`, not `/api/v1`, because its service
mesh denies un-JWT'd requests to `/api/v1/admin/*` — and this surface
authenticates by HMAC rather than JWT. Get it wrong and the mesh answers `403`
before the application sees the request, so nothing appears in the product's
own logs. The CLI warns when `--base` looks unprefixed.

## What it asserts

Per-endpoint rules from §3, and the conventions from §4 over every response:

- **§4.1** the pagination envelope, exactly: `{ data, pagination: { page, limit, total } }`
- **§4.2** money in minor units with an explicit currency, never a bare number
- **§4.3** timestamps as ISO 8601 **with an offset** — a naive local time fails
- **§4.4** errors carrying a stable machine-readable `error` code — applied to a **4xx**,
  which is a refusal the caller provoked and whose shape is the whole contract. A **5xx**
  is the endpoint failing, and fails the run outright however well-formed its error body:
  §4.1's envelope was never demonstrated, so there is nothing to pass.
- **§4.5** an empty result is `200` + `[]`, never `null` and never `{}`
- **§3.1** `/admin/kpis` is a flat map, and answers `501` when uninstrumented rather than `{}`
- **§3.2** every inbox item carries `waiting_since`, and `due_at` where an SLA is declared
- **§3.3** `/admin/audit-logs` is scoped to the calling product
- **§8.8** `/admin/lifecycle/reason-codes` publishes both verbs' codes, snake_case, each labelled
- **§8.8** a product declaring `tenant-lifecycle` also declares `lifecycle/reason-codes`
- **§8.9** every `/admin/entities/{type}` row carries a non-empty string `id` and `label`; `sublabel` is optional, but sending it as `null` or `""` instead of omitting it fails, and `source` must not be sent at all

## The one endpoint that is never called

`tenant-lifecycle` is declarable but has no wire check at all. §8.3's suspend
and unsuspend are writes against a real merchant's tenant, and there is no
sandbox tenant to point a conformance run at — a suite that exercised them
would be a worse outcome than an unchecked route.

It is declarable anyway, because it is the antecedent of a rule. §8.3 requires
a reason code on those writes and §8.8 requires the accepted codes to be
*fetchable*; declaring the writes without `lifecycle/reason-codes` fails the
run. That gap is not hypothetical — mark8ly validated a closed set of codes it
published nowhere, so the console hand-copied them out of a Go source file
(tesserix-home#345), and a copied vocabulary drifts silently in the direction
nobody sees: a newly added code is simply missing from the menu, and the
operator picks the nearest wrong one.

## Skips are honest, not lenient

A check reports **skip** when it genuinely cannot conclude — a response with no
money field, an empty page that proves nothing, `/admin/audit-logs` rows that
carry no product attribution to compare. A green tick there would claim
something the suite cannot see from outside your service, which is the failure
mode conformance exists to remove. Skips never fail the build.

## Signing

Requests are signed with the platform HMAC scheme. The implementation is
checked against golden vectors published by the reference implementation and
copied here byte-for-byte, because this scheme has one trap that a plausible
port falls straight into: query values use `application/x-www-form-urlencoded`
escaping, which `encodeURIComponent` does not implement. A space must become
`+` (not `%20`), and — undocumented upstream, verified against Go 1.26 —
`!` `*` `'` `(` `)` must be percent-encoded where `encodeURIComponent` leaves
them literal. A port that misses the second half passes all four vectors and
still fails on `?actor=O'Brien`.

`signedHeaders` is exported for products whose own integration tests need to
make signed calls, so there is no reason to hand-roll a second implementation.
