# Deploy Storybook & Docs from Vercel to tesserix-k8s — Design

**Date:** 2026-05-02
**Author:** Mahesh Sangawar
**Status:** Draft for review
**Repos touched:** `design-system`, `tesserix-k8s`, `tesserix-home`

## 1. Context & goal

The Tesserix design system ships two public sites:

- `apps/storybook` — interactive component playground (Storybook, static build) — currently `ui.tesserix.app` on Vercel.
- `apps/docs` — Nextra-powered documentation site (Next.js 16) — currently `docs.tesserix.app` on Vercel.

Goal: move both off Vercel and onto the Tesserix prod GKE cluster (`tesseract-prod-in-gke`, `asia-south1`), keeping the same public URLs, decommissioning the Vercel projects, and adding footer entry-points from `tesserix.app` so the sites are discoverable from the company homepage.

This consolidates platform spend on a single hosting target (the cluster we already pay for) and pulls these two sites into the same delivery pipeline as the rest of the platform.

## 2. Decisions (locked in via brainstorming)

| Decision | Choice |
|---|---|
| Environments | Prod only — replace Vercel directly. No devtest deployment. |
| Storybook hosting | Static build served by `nginx` in a container, same Helm-chart shape as `apps/docs`. |
| Access control | Both sites fully public (parity with current Vercel). |
| CI ownership | In `design-system` repo. Build → push to GHCR → cross-repo commit to `tesserix-k8s` (mark8ly pattern). Work directly on `tesserix-k8s/main`, with rebase-retry on conflicts. |
| DNS cutover | Big-bang flip after in-cluster validation. Vercel projects kept for a 7-day soak (Git disconnected day 0), deleted after. |
| Homepage links | Footer entries on `tesserix.app` (under Resources/Developers): "Design System" → `ui.tesserix.app`, "Documentation" → `docs.tesserix.app`. |

User has already removed the custom domains from the Vercel projects, so the projects are currently dead weight (no live traffic, no DNS).

## 3. Architecture

```
                     Cloudflare (DNS + TLS, wildcard *.tesserix.app)
                                        │
                                        ▼
                    Cloudflare Tunnel (existing, *.tesserix.app)
                                        │
                                        ▼
                       Istio Gateway istio-ingress/tesseract-gateway
                                        │
                ┌───────────────────────┴────────────────────────┐
                │                                                │
        host: docs.tesserix.app                       host: ui.tesserix.app
                │                                                │
                ▼                                                ▼
         VirtualService                                   VirtualService
         tesserix-docs-vs                                 tesserix-storybook-vs
                │                                                │
                ▼                                                ▼
                              namespace: tesserix
        ┌──────────────────────────────┐    ┌──────────────────────────────┐
        │ Service tesserix-docs        │    │ Service tesserix-storybook   │
        │ ClusterIP, port 80→3000      │    │ ClusterIP, port 80→8080      │
        └──────────────┬───────────────┘    └──────────────┬───────────────┘
                       ▼                                   ▼
        ┌──────────────────────────────┐    ┌──────────────────────────────┐
        │ Deployment (replicas: 2)     │    │ Deployment (replicas: 2)     │
        │ Next.js standalone, node 22  │    │ nginx:1.27-alpine, static    │
        │ image: tesserix-docs:<sha>   │    │ image: tesserix-storybook:<sha>│
        └──────────────────────────────┘    └──────────────────────────────┘
                       │                                   │
                       └───────────────┬───────────────────┘
                                       ▼
                       Image pull: GAR remote-repo mirror of GHCR
                       asia-south1-docker.pkg.dev/tesseracthub-480811/
                       ghcr-remote/tesserix/{tesserix-docs,tesserix-storybook}
```

### Conventions adopted from existing platform

- **Namespace:** `tesserix` (alongside `company` (= tesserix-home), `tesserix-auth-bff`, `tesserix-postgres`).
- **ArgoCD project:** `platform`. App manifests at `argocd/prod/apps/global/`.
- **Image registry:** push to `ghcr.io/tesserix/<name>`; cluster pulls via the in-region GAR remote-repo mirror at `asia-south1-docker.pkg.dev/tesseracthub-480811/ghcr-remote/tesserix/<name>`.
- **Image tag:** per-commit SHA, format `main-<short12>`. Same convention as `mark8ly-*` and `company`.
- **Pull secret:** `ghcr-secret` already exists in the `tesserix` namespace.
- **TLS:** rides existing wildcard `*.tesserix.app` cert at the Istio gateway.
- **Cloudflare tunnel:** existing `*.tesserix.app` ingress entry covers both new hosts. No tunnel config change needed.

### Workload choice: plain Deployment (not Knative)

Both apps run as standard `Deployment` + `Service`. Knative scale-to-zero would add cold-start latency for sites that get steady documentation traffic, with no real cost benefit at this scale. This matches the `company` chart's pattern (it migrated off Knative to KEDA-scaled Deployments).

### What's deliberately omitted from these charts

Compared to `charts/apps/company/`, both new charts skip:

- `externalsecret.yaml` — no env-injected secrets needed for either app.
- `authorization-policy.yaml` — fully public sites.
- `configmap.yaml` — no env config required.
- `hpa.yaml` / `vpa.yaml` / `scaledobject.yaml` — fixed 2 replicas; traffic is low and predictable.
- `clusterrole-rollout.yaml` / `rolebindings-rollout.yaml` — CI doesn't kubectl-patch; it commits to `tesserix-k8s`.
- `uptime-probe-cronjob.yaml` — defer until we see whether external monitoring is needed.

Charts include only: `_helpers.tpl`, `deployment.yaml`, `service.yaml`, `serviceaccount.yaml`, `virtualservice.yaml`, `network-policy.yaml`, `pdb.yaml` (prod, conditional).

## 4. Build artifacts (Dockerfiles)

### Prerequisite source change

`apps/docs/next.config.mjs`:

```js
import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
})

export default withNextra({
  reactStrictMode: true,
  output: 'standalone',
})
```

`output: 'standalone'` is a no-op for `next dev` and Vercel; it only changes the shape of `next build`'s output to produce a self-contained server bundle.

### `apps/docs/Dockerfile` (Next.js standalone, pnpm-aware)

Build context: monorepo root (so `workspace:*` deps resolve).

```dockerfile
# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/docs/package.json apps/docs/
COPY packages/ packages/
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --offline
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @tesserix/docs build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/static ./apps/docs/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/public ./apps/docs/public
USER nextjs
EXPOSE 3000
CMD ["node", "apps/docs/server.js"]
```

### `apps/storybook/Dockerfile` (static → nginx)

```dockerfile
# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
WORKDIR /app

FROM base AS builder
COPY . .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm --filter '@tesserix/web' --filter '@tesserix/native' \
        --filter '@tesserix/icons' --filter '@tesserix/tokens' build
RUN pnpm --filter @tesserix/storybook build-storybook

FROM nginx:1.27-alpine AS runner
RUN apk add --no-cache ca-certificates
COPY apps/storybook/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/storybook/storybook-static /usr/share/nginx/html
RUN addgroup -g 1001 -S nginxuser && adduser -u 1001 -S nginxuser -G nginxuser && \
    chown -R nginxuser:nginxuser /usr/share/nginx/html /var/cache/nginx /var/run /etc/nginx
USER 1001
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/ || exit 1
```

### `apps/storybook/nginx.conf`

Provides:

- Listen on `:8080` (non-root container).
- `try_files` SPA fallback (Storybook iframe routes resolve cleanly).
- Long cache for `/assets/*` (immutable static).
- Same security headers the Vercel `vercel-ui.json` currently sets: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `X-DNS-Prefetch-Control`, `Strict-Transport-Security`, `Permissions-Policy`.

### Build-time auth

All workspace deps are local (`workspace:*`). Neither image needs `NODE_AUTH_TOKEN` or any GHCR credentials at build time, unlike `marketplace-admin` which pulls `@tesserix/web` from GHCR.

### `.dockerignore` (root)

Add at repo root: `node_modules`, `.next`, `apps/*/node_modules`, `apps/*/.next`, `apps/storybook/storybook-static`, `.git`, `.env*`, `.turbo`, `coverage`, `*.log`.

## 5. Helm charts & ArgoCD wiring

### Layout

```
tesserix-k8s/charts/apps/
├── tesserix-docs/
│   ├── Chart.yaml          # depends on 'common' library chart
│   ├── values.yaml
│   ├── values-prod.yaml
│   └── templates/
│       ├── _helpers.tpl
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── serviceaccount.yaml
│       ├── virtualservice.yaml
│       ├── network-policy.yaml
│       └── pdb.yaml
└── tesserix-storybook/      # same shape, different image / port / host
```

### `tesserix-docs/values.yaml` (representative)

```yaml
replicaCount: 2
image:
  repository: asia-south1-docker.pkg.dev/tesseracthub-480811/ghcr-remote/tesserix/tesserix-docs
  pullPolicy: IfNotPresent
  tag: "main-bootstrap"   # CI rewrites this on every push to design-system/main
imagePullSecrets:
  - name: ghcr-secret

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  gateway: istio-ingress/tesseract-gateway
  hosts:
    - host: docs.tesserix.app
      paths: [{ path: /, pathType: Prefix }]

resources:
  requests: { cpu: 100m, memory: 256Mi }
  limits:   { cpu: 500m, memory: 512Mi }

podSecurityContext: { fsGroup: 1001, runAsNonRoot: true }
securityContext:
  runAsUser: 1001
  runAsNonRoot: true
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities: { drop: ["ALL"] }

# Next.js writes prerender cache; emptyDirs satisfy readOnlyRootFilesystem
volumes:
  tmp:   { enabled: true }
  cache: { enabled: true }

pdb:
  enabled: false   # overridden true in values-prod.yaml
```

`values-prod.yaml` for `tesserix-docs`:

```yaml
pdb:
  enabled: true
  minAvailable: 1
```

`tesserix-storybook/values.yaml` mirrors the above with: `targetPort: 8080`, `host: ui.tesserix.app`, single emptyDir for `/var/cache/nginx`, lower memory limit (`256Mi`).

### `virtualservice.yaml` (single-route, no auth carve-outs)

```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: {{ include "tesserix-docs.fullname" . }}-vs
  labels: {{- include "tesserix-docs.labels" . | nindent 4 }}
spec:
  gateways: [istio-ingress/tesseract-gateway]
  hosts: [{{ (index .Values.ingress.hosts 0).host | quote }}]
  http:
    - route:
        - destination:
            host: {{ include "tesserix-docs.fullname" . }}.{{ .Release.Namespace }}.svc.cluster.local
            port:
              number: {{ .Values.service.port }}
      timeout: 30s
```

### ArgoCD app manifests

`argocd/prod/apps/global/tesserix-docs.yaml`:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: tesserix-docs
  namespace: argocd
  labels:
    app.kubernetes.io/part-of: tesserix
    app.kubernetes.io/component: frontend
    environment: prod
spec:
  project: platform
  source:
    repoURL: https://github.com/tesserix/tesserix-k8s.git
    targetRevision: HEAD
    path: charts/apps/tesserix-docs
    helm:
      valueFiles:
        - values.yaml
        - values-prod.yaml
        - ../global-config-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: tesserix
  syncPolicy:
    automated: { prune: true, selfHeal: true }
    syncOptions: [ServerSideApply=true]
```

The `image.tag` is **not** managed via Helm parameters in this manifest — it lives in `values.yaml` and is rewritten on every CI run. ArgoCD reconciles cleanly from git, no `ignoreDifferences` carve-outs needed (this is the mark8ly pattern).

`argocd/prod/apps/global/tesserix-storybook.yaml` follows the same shape with `path: charts/apps/tesserix-storybook`.

Both new app YAMLs are appended to `argocd/prod/apps/global/kustomization.yaml`.

## 6. CI workflow (mark8ly pattern)

### `design-system/.github/workflows/deploy-k8s.yml`

```yaml
name: Deploy to k8s

on:
  push:
    branches: [main]
    paths:
      - 'apps/docs/**'
      - 'apps/storybook/**'
      - 'packages/**'
      - 'pnpm-lock.yaml'
      - 'package.json'
      - '.github/workflows/deploy-k8s.yml'
  workflow_dispatch:

concurrency:
  group: deploy-k8s-${{ github.ref }}
  cancel-in-progress: false

env:
  REGISTRY: ghcr.io

permissions:
  contents: read
  packages: write
  id-token: write

jobs:
  images:
    name: Build & push images
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        include:
          - app: tesserix-docs
            dockerfile: apps/docs/Dockerfile
          - app: tesserix-storybook
            dockerfile: apps/storybook/Dockerfile
    outputs:
      tag: ${{ steps.meta.outputs.tag }}
    steps:
      - uses: actions/checkout@v4

      - name: Compute tag
        id: meta
        run: echo "tag=main-$(echo ${GITHUB_SHA} | cut -c1-12)" >> $GITHUB_OUTPUT

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build & push
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ${{ matrix.dockerfile }}
          platforms: linux/amd64
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ github.repository_owner }}/${{ matrix.app }}:${{ steps.meta.outputs.tag }}
            ${{ env.REGISTRY }}/${{ github.repository_owner }}/${{ matrix.app }}:latest
          cache-from: type=gha,scope=${{ matrix.app }}
          cache-to: type=gha,scope=${{ matrix.app }},mode=max

      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ github.repository_owner }}/${{ matrix.app }}:${{ steps.meta.outputs.tag }}
          format: table
          severity: CRITICAL,HIGH
          exit-code: "0"

  bump-k8s:
    name: Bump tesserix-k8s image tags
    needs: [images]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Compute short SHA
        id: sha
        run: echo "tag=main-$(echo ${GITHUB_SHA} | cut -c1-12)" >> $GITHUB_OUTPUT

      - name: Checkout tesserix-k8s
        uses: actions/checkout@v4
        with:
          repository: tesserix/tesserix-k8s
          token: ${{ secrets.TESSERIX_K8S_BOT }}
          path: tesserix-k8s
          ref: main
          fetch-depth: 0

      - name: Bump image tags via yq
        working-directory: tesserix-k8s
        run: |
          set -euo pipefail
          for svc in tesserix-docs tesserix-storybook; do
            f="charts/apps/$svc/values.yaml"
            if [ ! -f "$f" ]; then
              echo "WARN: $f does not exist — skipping"; continue
            fi
            yq -i ".image.tag = \"${{ steps.sha.outputs.tag }}\"" "$f"
          done

      - name: Commit & push (with rebase retry)
        working-directory: tesserix-k8s
        run: |
          set -euo pipefail
          git config user.name "tesserix-bot"
          git config user.email "tesserix-bot@users.noreply.github.com"
          if git diff --quiet; then
            echo "No tag changes — nothing to commit"; exit 0
          fi
          git add charts/apps/tesserix-docs/values.yaml \
                  charts/apps/tesserix-storybook/values.yaml
          git commit -m "chore: bump design-system images to ${{ steps.sha.outputs.tag }}"
          for attempt in 1 2 3; do
            if git push origin main; then
              echo "Pushed on attempt $attempt"; exit 0
            fi
            echo "Push failed (attempt $attempt) — rebasing on incoming changes"
            git pull --rebase origin main
          done
          echo "Push failed after 3 rebase attempts — aborting"; exit 1
```

### Required secrets

- `GITHUB_TOKEN` — built-in, used for GHCR push.
- `TESSERIX_K8S_BOT` — classic PAT with `repo` scope on `tesserix/tesserix-k8s`. Already exists at the org level (mark8ly's `bump-k8s` job uses it).

### Behaviors

- PRs do **not** trigger this workflow — only push to `main` and manual dispatch. PR-time Dockerfile validation can be added later if it becomes a recurring footgun.
- Concurrency group is `deploy-k8s-main`, **not** cancelled in-progress, so an in-flight `bump-k8s` lands before the next push starts queueing image builds. Avoids two CI runs racing the same `values.yaml`.
- No SARIF upload (per repo policy: GitHub Free plan, no SARIF). Trivy results are CI logs only.
- Existing `ci-cd.yml` (lint, type-check, test, Chromatic) is unchanged.

### Public→private repo cycle

`tesserix-k8s/CLAUDE.md` mandates "make repo public before push, make private after CI is green" for both `design-system` and `tesserix-k8s` because of the GitHub Free private-minutes limit. This workflow does not handle that — it remains the developer's responsibility per existing convention. The cutover runbook (Section 7) calls it out at each merge step.

## 7. Cutover plan

### Phase 0 — Prerequisite source change

Single commit to `design-system`: add `output: 'standalone'` to `apps/docs/next.config.mjs`. Vercel-safe; merges with no side effect.

### Phase 1 — `design-system`: containerization (PR #1)

1. Add `apps/docs/Dockerfile`.
2. Add `apps/storybook/Dockerfile` and `apps/storybook/nginx.conf`.
3. Add root `.dockerignore`.
4. Local sanity check: both `docker build ... -f apps/docs/Dockerfile .` and `docker build ... -f apps/storybook/Dockerfile .` succeed; `docker run -p 3000:3000` and `docker run -p 8080:8080` serve content.
5. No CI change yet. Public→build→private cycle on merge.

### Phase 2 — `tesserix-k8s`: charts + ArgoCD apps (PR #2)

1. Add `charts/apps/tesserix-docs/` (Chart, values, values-prod, templates).
2. Add `charts/apps/tesserix-storybook/` (same).
3. Add `argocd/prod/apps/global/tesserix-docs.yaml`.
4. Add `argocd/prod/apps/global/tesserix-storybook.yaml`.
5. Append both to `argocd/prod/apps/global/kustomization.yaml`.
6. `image.tag` in both `values.yaml` is the placeholder `"main-bootstrap"` — Phase 3's first CI run rewrites it.
7. Public→build→private cycle on merge. ArgoCD will show both apps as `Missing` / `OutOfSync` until Phase 3 lands.

### Phase 3 — `design-system`: CI wiring (PR #3)

1. Add `.github/workflows/deploy-k8s.yml`.
2. Confirm org secret `TESSERIX_K8S_BOT` resolves in this workflow (it must — mark8ly already uses it).
3. Public→build→private cycle on merge. The merge commit triggers:
   - matrix builds two images, pushes to GHCR,
   - `bump-k8s` writes per-commit tags into `tesserix-k8s/charts/apps/tesserix-{docs,storybook}/values.yaml`, commits and pushes to `tesserix-k8s/main`,
   - ArgoCD auto-syncs both apps and brings up pods in the `tesserix` namespace.
4. **In-cluster validation before any DNS work:**
   ```bash
   export KUBECONFIG=~/.kube/gke-prod
   kubectl -n tesserix get pods -l app.kubernetes.io/name=tesserix-docs
   kubectl -n tesserix get pods -l app.kubernetes.io/name=tesserix-storybook
   kubectl -n tesserix port-forward svc/tesserix-docs 3000:80
   kubectl -n tesserix port-forward svc/tesserix-storybook 8080:80
   ```
   Browse `localhost:3000` and `localhost:8080`. Verify a few inner routes for docs, an iframe story for storybook. If broken → fix forward.

### Phase 4 — DNS / external validation

1. Cloudflare DNS audit:
   - List records for `docs.tesserix.app` and `ui.tesserix.app`.
   - If any per-host CNAMEs remain pointing at Vercel, **delete them** so the existing `*.tesserix.app` wildcard tunnel handles routing.
2. External validation:
   ```
   curl -I https://docs.tesserix.app    # expect 200, served from cluster
   curl -I https://ui.tesserix.app      # expect 200
   ```
3. Browser smoke test of both URLs.

### Phase 5 — Vercel decommission

1. Day 0 (immediately after Phase 4 green): in each Vercel project, **disconnect the GitHub integration** (Settings → Git → Disconnect). Stops further builds. Project + history preserved.
2. Day 7: **delete both Vercel projects.**

### Phase 6 — `design-system` repo cleanup (PR #4)

1. Delete `vercel-ui.json`.
2. Delete `vercel-docs.json`.
3. Remove `deploy:ui`, `deploy:docs`, `deploy:all` scripts from `package.json`.
4. Rewrite `DEPLOYMENT.md` to describe the k8s flow (chart paths, image registry, deploy mechanics, rollback).
5. Update `README.md` if it has Vercel-specific references.
6. Public→build→private cycle on merge.

### Phase 7 — `tesserix-home` footer entries (PR #5)

1. Edit `components/common/footer.tsx` in the `tesserix-home` repo:
   - Add a "Resources" (or "Developers") column.
   - Two entries: **Documentation** → `https://docs.tesserix.app`, **Design System** → `https://ui.tesserix.app`.
   - Outbound styling consistent with existing footer links. `target="_blank" rel="noreferrer"` since they leave the homepage domain.
2. Public→build→private cycle on merge of the `tesserix-home` PR. Existing `tesserix-home` CI deploys `company` chart automatically.
3. Verify `tesserix.app` footer shows the two new links and they navigate correctly.

This phase can run in parallel with Phases 5–6 (it doesn't depend on Vercel decommission), but should not land **before** Phase 4 — otherwise the homepage links could 404 if a user clicks them during the brief window.

## 8. Rollback plan

| Failure | Rollback |
|---|---|
| Pod crashloop or bad image rolled out | `kubectl -n tesserix rollout undo deployment/tesserix-{docs,storybook}` |
| Bad chart change in `tesserix-k8s` | `git revert` the offending commit on `tesserix-k8s/main`, push; ArgoCD reconciles to prior state |
| Total cluster failure during Phase 4–5 window (≤ 7 days) | Vercel projects still exist (Git disconnected, runtime alive). Re-add `docs.tesserix.app` / `ui.tesserix.app` custom domains in Vercel; if Cloudflare wildcard interferes, add per-host CNAMEs pointing at Vercel. Realistic restoration: 30–60 min. |
| Total cluster failure after Day 7 | Vercel deleted, no fallback. Recover the cluster — by then we've had a week of soak time. |

## 9. Acceptance criteria

- `https://docs.tesserix.app` and `https://ui.tesserix.app` both serve from cluster pods (verifiable via response headers and source).
- A push to `design-system/main` results in: new image at `ghcr.io/tesserix/tesserix-{docs,storybook}:main-<sha>`, automatic update of `tesserix-k8s/charts/apps/tesserix-{docs,storybook}/values.yaml`, and a clean rolling deploy in cluster within ~5 minutes.
- No Vercel deployment is reachable for either site (Day 7+).
- No remaining Vercel references in `design-system` (`vercel-ui.json`, `vercel-docs.json`, `deploy:*` scripts all removed; `DEPLOYMENT.md` rewritten).
- `tesserix.app` footer surfaces both new sites under a Resources/Developers column.

## 10. Out of scope

- Devtest environment for these sites — prod only by decision.
- Auth gating — both sites stay fully public.
- Custom uptime monitoring (`uptime-probe-cronjob`) — defer until external monitoring needs it.
- HPA / KEDA autoscaling — fixed 2 replicas is sufficient for design-system traffic.
- Migration of `apps/docs` content or `apps/storybook` story authoring — content is unchanged; only the hosting surface moves.
- PR-time Dockerfile validation builds — can be added later if Dockerfile breakage on `main` becomes recurring.
