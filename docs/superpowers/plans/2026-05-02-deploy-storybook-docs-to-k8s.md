# Deploy Storybook + Docs to k8s — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move `apps/storybook` and `apps/docs` off Vercel and onto the Tesserix prod GKE cluster, keeping the same public URLs (`ui.tesserix.app`, `docs.tesserix.app`), and surface footer links to both from `tesserix.app`.

**Architecture:** Two new Helm charts (`tesserix-docs`, `tesserix-storybook`) deployed into the existing `tesserix` namespace alongside `company`. Plain Deployment + Service + Istio VirtualService. CI lives in `design-system`: matrix-builds two Docker images, pushes to GHCR, then commits new image tags to `tesserix-k8s/main` (mark8ly pattern). ArgoCD reconciles. DNS is the existing `*.tesserix.app` Cloudflare wildcard tunnel — no per-host record needed.

**Tech Stack:** pnpm 10 monorepo, Next.js 16 (Nextra), Storybook 10, Docker (BuildKit), GHCR, GAR remote-repo mirror, Helm, Istio, ArgoCD, GitHub Actions, Cloudflare.

**Reference spec:** `docs/superpowers/specs/2026-05-02-deploy-storybook-docs-to-k8s-design.md`. Read this first if anything below seems under-specified.

**Working directories you will touch:**
- `/Users/Mahesh.Sangawar/personal/tesserix-new/design-system` (this repo) — source code, Dockerfiles, CI
- `/Users/Mahesh.Sangawar/personal/tesserix-new/tesserix-k8s` — Helm charts, ArgoCD apps
- `/Users/Mahesh.Sangawar/personal/tesserix-new/tesserix-home` — footer component

**Repo-level rules to honor:**
- `tesserix-k8s` requires the **public→push→wait green→private** repo visibility cycle on every PR merge. Don't skip this.
- `tesserix-k8s/CLAUDE.md` mandates ArgoCD-only deploys. Never `kubectl apply`. Read-only investigation (`logs`, `describe`, `port-forward`) is fine.
- Single-line commit messages. No co-authored-by, no AI signatures.

**Cluster access (Phase 3 onward):**
```bash
export KUBECONFIG=~/.kube/gke-prod
```

---

## File map

### `design-system` repo
- Modify: `apps/docs/next.config.mjs` — add `output: 'standalone'`
- Create: `.dockerignore` (root)
- Create: `apps/docs/Dockerfile`
- Create: `apps/storybook/Dockerfile`
- Create: `apps/storybook/nginx.conf`
- Create: `.github/workflows/deploy-k8s.yml`
- Delete: `vercel-ui.json`
- Delete: `vercel-docs.json`
- Modify: `package.json` — remove `deploy:ui`, `deploy:docs`, `deploy:all` scripts
- Rewrite: `DEPLOYMENT.md`

### `tesserix-k8s` repo
- Create: `charts/apps/tesserix-docs/` (Chart.yaml, values.yaml, values-prod.yaml, templates/_helpers.tpl, templates/deployment.yaml, templates/service.yaml, templates/serviceaccount.yaml, templates/virtualservice.yaml, templates/network-policy.yaml, templates/pdb.yaml)
- Create: `charts/apps/tesserix-storybook/` (same shape)
- Create: `argocd/prod/apps/global/tesserix-docs.yaml`
- Create: `argocd/prod/apps/global/tesserix-storybook.yaml`
- Modify: `argocd/prod/apps/global/kustomization.yaml` — append both new app YAMLs

### `tesserix-home` repo
- Modify: `components/common/footer.tsx` — add Resources column with two links

---

## Phase 0 — Source prerequisite (design-system)

### Task 1: Add Next.js standalone output to docs

**Files:**
- Modify: `apps/docs/next.config.mjs`

- [ ] **Step 1: Apply the edit**

Replace the existing default export with:

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

- [ ] **Step 2: Verify build still works locally**

```bash
cd /Users/Mahesh.Sangawar/personal/tesserix-new/design-system
pnpm --filter @tesserix/docs build
```

Expected: build succeeds. After build, `apps/docs/.next/standalone/` exists.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/next.config.mjs
git commit -m "feat(docs): emit standalone output for container builds"
```

---

## Phase 1 — Containerization (design-system PR #1)

### Task 2: Add root `.dockerignore`

**Files:**
- Create: `.dockerignore` (repo root)

- [ ] **Step 1: Write the file**

```
node_modules
**/node_modules
.next
**/.next
**/storybook-static
.git
.github
.turbo
.env
.env.*
!.env.example
*.log
coverage
dist
**/dist
.vscode
.idea
.DS_Store
docs/superpowers
```

- [ ] **Step 2: Commit**

```bash
git add .dockerignore
git commit -m "chore: add root .dockerignore for docker builds"
```

---

### Task 3: Add storybook nginx.conf

**Files:**
- Create: `apps/storybook/nginx.conf`

- [ ] **Step 1: Write the file**

```nginx
worker_processes auto;
error_log /dev/stderr notice;
pid /tmp/nginx.pid;
events { worker_connections 1024; }
http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;
  sendfile      on;
  access_log    /dev/stdout;

  client_body_temp_path /tmp/client_body;
  proxy_temp_path       /tmp/proxy;
  fastcgi_temp_path     /tmp/fastcgi;
  uwsgi_temp_path       /tmp/uwsgi;
  scgi_temp_path        /tmp/scgi;

  server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options          "SAMEORIGIN" always;
    add_header X-Content-Type-Options   "nosniff" always;
    add_header Referrer-Policy          "origin-when-cross-origin" always;
    add_header X-DNS-Prefetch-Control   "on" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Permissions-Policy       "camera=(), microphone=(), geolocation=()" always;

    location /assets/ {
      add_header Cache-Control "public, max-age=31536000, immutable";
      try_files $uri =404;
    }

    location / {
      try_files $uri $uri/ /index.html;
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/storybook/nginx.conf
git commit -m "feat(storybook): add nginx config for static container serving"
```

---

### Task 4: Add storybook Dockerfile

**Files:**
- Create: `apps/storybook/Dockerfile`

- [ ] **Step 1: Write the Dockerfile**

```dockerfile
# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
WORKDIR /app

# ---- builder ----
FROM base AS builder
COPY . .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm --filter '@tesserix/web' --filter '@tesserix/native' \
        --filter '@tesserix/icons' --filter '@tesserix/tokens' build
RUN pnpm --filter @tesserix/storybook build-storybook

# ---- runner ----
FROM nginx:1.27-alpine AS runner
RUN apk add --no-cache ca-certificates && rm /etc/nginx/conf.d/default.conf
COPY apps/storybook/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/apps/storybook/storybook-static /usr/share/nginx/html
RUN addgroup -g 1001 -S nginxuser && adduser -u 1001 -S nginxuser -G nginxuser && \
    chown -R nginxuser:nginxuser /usr/share/nginx/html /var/cache/nginx /var/run /etc/nginx
USER 1001
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/ || exit 1
```

- [ ] **Step 2: Build it locally**

```bash
cd /Users/Mahesh.Sangawar/personal/tesserix-new/design-system
DOCKER_BUILDKIT=1 docker build -f apps/storybook/Dockerfile -t tesserix-storybook:dev .
```

Expected: build succeeds. ~5-8 min on first run.

- [ ] **Step 3: Smoke-test the image**

```bash
docker run --rm -p 8080:8080 tesserix-storybook:dev &
sleep 3
curl -sI http://localhost:8080/ | head -1
```

Expected: `HTTP/1.1 200 OK`. `curl http://localhost:8080/` returns Storybook HTML. Stop with `docker ps` + `docker stop`.

- [ ] **Step 4: Commit**

```bash
git add apps/storybook/Dockerfile
git commit -m "feat(storybook): add multi-stage dockerfile (nginx static)"
```

---

### Task 5: Add docs Dockerfile

**Files:**
- Create: `apps/docs/Dockerfile`

- [ ] **Step 1: Write the Dockerfile**

```dockerfile
# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
WORKDIR /app

# ---- builder ----
FROM base AS builder
COPY . .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @tesserix/docs build

# ---- runner ----
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

- [ ] **Step 2: Build it locally**

```bash
cd /Users/Mahesh.Sangawar/personal/tesserix-new/design-system
DOCKER_BUILDKIT=1 docker build -f apps/docs/Dockerfile -t tesserix-docs:dev .
```

Expected: build succeeds.

- [ ] **Step 3: Smoke-test the image**

```bash
docker run --rm -p 3000:3000 tesserix-docs:dev &
sleep 5
curl -sI http://localhost:3000/ | head -1
```

Expected: `HTTP/1.1 200 OK`. `curl http://localhost:3000/` returns docs HTML.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/Dockerfile
git commit -m "feat(docs): add multi-stage dockerfile (nextjs standalone)"
```

---

### Task 6: Open PR #1 (containerization)

- [ ] **Step 1: Push branch and open PR**

```bash
git push -u origin <branch>
gh pr create --title "feat: containerize docs and storybook" \
  --body "Adds Dockerfiles + nginx config + .dockerignore. No deploy wiring yet — that's PR #3."
```

- [ ] **Step 2: Public→build→private cycle, merge**

```bash
gh repo edit tesserix/design-system --visibility public --accept-visibility-change-consequences
# Wait for CI green
gh pr merge --squash <pr-number>
gh repo edit tesserix/design-system --visibility private --accept-visibility-change-consequences
```

---

## Phase 2 — Helm charts + ArgoCD apps (tesserix-k8s PR #2)

> Switch to `/Users/Mahesh.Sangawar/personal/tesserix-new/tesserix-k8s` for all Phase 2 tasks.

### Task 7: Create `tesserix-docs` chart skeleton

**Files:**
- Create: `charts/apps/tesserix-docs/Chart.yaml`
- Create: `charts/apps/tesserix-docs/values.yaml`
- Create: `charts/apps/tesserix-docs/values-prod.yaml`
- Create: `charts/apps/tesserix-docs/templates/_helpers.tpl`

- [ ] **Step 1: Branch in tesserix-k8s**

```bash
cd /Users/Mahesh.Sangawar/personal/tesserix-new/tesserix-k8s
git checkout main && git pull --rebase origin main
git checkout -b feat/tesserix-docs-storybook-charts
```

- [ ] **Step 2: Write `Chart.yaml`**

```yaml
apiVersion: v2
name: tesserix-docs
description: Tesserix design-system documentation site (docs.tesserix.app)
type: application
version: 0.1.0
appVersion: "0.1.0"
maintainers:
  - name: Tesseract Hub Team
home: https://github.com/tesserix/design-system
dependencies:
  - name: common
    version: "1.0.0"
    repository: "file://../common"
```

- [ ] **Step 3: Write `values.yaml`**

```yaml
replicaCount: 2

image:
  repository: asia-south1-docker.pkg.dev/tesseracthub-480811/ghcr-remote/tesserix/tesserix-docs
  pullPolicy: IfNotPresent
  tag: "main-bootstrap"   # CI rewrites this on every push to design-system/main

imagePullSecrets:
  - name: ghcr-secret

nameOverride: ""
fullnameOverride: ""

serviceAccount:
  create: true
  automount: true
  annotations: {}
  name: ""

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  gateway: istio-ingress/tesseract-gateway
  hosts:
    - host: docs.tesserix.app
      paths:
        - path: /
          pathType: Prefix

resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi

podSecurityContext:
  fsGroup: 1001
  runAsNonRoot: true

securityContext:
  runAsUser: 1001
  runAsNonRoot: true
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities:
    drop: ["ALL"]
  seccompProfile:
    type: RuntimeDefault

volumes:
  tmp:
    enabled: true
    mountPath: /tmp
  cache:
    enabled: true
    mountPath: /app/apps/docs/.next/cache

pdb:
  enabled: false
```

- [ ] **Step 4: Write `values-prod.yaml`**

```yaml
pdb:
  enabled: true
  minAvailable: 1
```

- [ ] **Step 5: Write `templates/_helpers.tpl`**

Mirror `charts/apps/company/templates/_helpers.tpl` shape, replacing `company` → `tesserix-docs`. Defines `tesserix-docs.name`, `tesserix-docs.fullname`, `tesserix-docs.chart`, `tesserix-docs.labels`, `tesserix-docs.selectorLabels`, `tesserix-docs.serviceAccountName`. Copy that file verbatim and rename, no logic changes.

- [ ] **Step 6: Commit**

```bash
git add charts/apps/tesserix-docs/Chart.yaml \
        charts/apps/tesserix-docs/values.yaml \
        charts/apps/tesserix-docs/values-prod.yaml \
        charts/apps/tesserix-docs/templates/_helpers.tpl
git commit -m "feat(tesserix-docs): add chart skeleton (Chart, values, helpers)"
```

---

### Task 8: Add `tesserix-docs` templates

**Files:**
- Create: `charts/apps/tesserix-docs/templates/deployment.yaml`
- Create: `charts/apps/tesserix-docs/templates/service.yaml`
- Create: `charts/apps/tesserix-docs/templates/serviceaccount.yaml`
- Create: `charts/apps/tesserix-docs/templates/virtualservice.yaml`
- Create: `charts/apps/tesserix-docs/templates/network-policy.yaml`
- Create: `charts/apps/tesserix-docs/templates/pdb.yaml`

- [ ] **Step 1: Write `deployment.yaml`**

Model after `charts/apps/mark8ly-admin/templates/deployment.yaml` but trim env vars and external secret references. Key elements:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "tesserix-docs.fullname" . }}
  labels: {{- include "tesserix-docs.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels: {{- include "tesserix-docs.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels: {{- include "tesserix-docs.selectorLabels" . | nindent 8 }}
      annotations:
        sidecar.istio.io/inject: "true"
        proxy.istio.io/config: |
          holdApplicationUntilProxyStarts: true
    spec:
      serviceAccountName: {{ include "tesserix-docs.serviceAccountName" . }}
      imagePullSecrets:
        {{- toYaml .Values.imagePullSecrets | nindent 8 }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: web
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.service.targetPort }}
          env:
            - name: NODE_ENV
              value: "production"
            - name: HOSTNAME
              value: "0.0.0.0"
            - name: PORT
              value: {{ .Values.service.targetPort | quote }}
          resources: {{- toYaml .Values.resources | nindent 12 }}
          securityContext:
            {{- toYaml .Values.securityContext | nindent 12 }}
          livenessProbe:
            httpGet: { path: /, port: http }
            initialDelaySeconds: 30
            periodSeconds: 30
          readinessProbe:
            httpGet: { path: /, port: http }
            initialDelaySeconds: 5
            periodSeconds: 10
          volumeMounts:
            {{- if .Values.volumes.tmp.enabled }}
            - name: tmp
              mountPath: {{ .Values.volumes.tmp.mountPath }}
            {{- end }}
            {{- if .Values.volumes.cache.enabled }}
            - name: cache
              mountPath: {{ .Values.volumes.cache.mountPath }}
            {{- end }}
      volumes:
        {{- if .Values.volumes.tmp.enabled }}
        - name: tmp
          emptyDir: {}
        {{- end }}
        {{- if .Values.volumes.cache.enabled }}
        - name: cache
          emptyDir: {}
        {{- end }}
```

- [ ] **Step 2: Write `service.yaml`**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "tesserix-docs.fullname" . }}
  labels: {{- include "tesserix-docs.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: {{ .Values.service.targetPort }}
      protocol: TCP
      name: http
  selector: {{- include "tesserix-docs.selectorLabels" . | nindent 4 }}
```

- [ ] **Step 3: Write `serviceaccount.yaml`**

```yaml
{{- if .Values.serviceAccount.create -}}
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "tesserix-docs.serviceAccountName" . }}
  labels: {{- include "tesserix-docs.labels" . | nindent 4 }}
  annotations:
    {{- with .Values.serviceAccount.annotations }}
    {{- toYaml . | nindent 4 }}
    {{- end }}
automountServiceAccountToken: {{ .Values.serviceAccount.automount | default true }}
{{- end }}
```

- [ ] **Step 4: Write `virtualservice.yaml`**

```yaml
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: {{ include "tesserix-docs.fullname" . }}-vs
  labels: {{- include "tesserix-docs.labels" . | nindent 4 }}
spec:
  gateways: [{{ .Values.ingress.gateway | quote }}]
  hosts: [{{ (index .Values.ingress.hosts 0).host | quote }}]
  http:
    - route:
        - destination:
            host: {{ include "tesserix-docs.fullname" . }}.{{ .Release.Namespace }}.svc.cluster.local
            port:
              number: {{ .Values.service.port }}
      timeout: 30s
```

- [ ] **Step 5: Write `network-policy.yaml`**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ include "tesserix-docs.fullname" . }}-allow-istio-ingress
  namespace: {{ .Release.Namespace }}
  labels: {{- include "tesserix-docs.labels" . | nindent 4 }}
spec:
  podSelector:
    matchLabels: {{- include "tesserix-docs.selectorLabels" . | nindent 6 }}
  policyTypes: [Ingress]
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: istio-ingress
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: istio-system
      ports:
        - port: {{ .Values.service.targetPort }}
          protocol: TCP
```

- [ ] **Step 6: Write `pdb.yaml`**

```yaml
{{- if and .Values.pdb .Values.pdb.enabled }}
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {{ include "tesserix-docs.fullname" . }}
  labels: {{- include "tesserix-docs.labels" . | nindent 4 }}
spec:
  {{- if .Values.pdb.minAvailable }}
  minAvailable: {{ .Values.pdb.minAvailable }}
  {{- else }}
  maxUnavailable: 1
  {{- end }}
  selector:
    matchLabels: {{- include "tesserix-docs.selectorLabels" . | nindent 6 }}
{{- end }}
```

- [ ] **Step 7: Commit**

```bash
git add charts/apps/tesserix-docs/templates/
git commit -m "feat(tesserix-docs): add deployment, service, vs, networkpolicy, pdb"
```

---

### Task 9: Validate `tesserix-docs` chart

- [ ] **Step 1: Pull common dependency**

```bash
cd /Users/Mahesh.Sangawar/personal/tesserix-new/tesserix-k8s
helm dependency update charts/apps/tesserix-docs
```

Expected: succeeds, creates `charts/apps/tesserix-docs/charts/common-1.0.0.tgz`.

- [ ] **Step 2: `helm lint`**

```bash
helm lint charts/apps/tesserix-docs
helm lint charts/apps/tesserix-docs -f charts/apps/tesserix-docs/values-prod.yaml
```

Expected: `0 chart(s) failed`.

- [ ] **Step 3: `helm template` and inspect**

```bash
helm template tesserix-docs charts/apps/tesserix-docs \
  -f charts/apps/tesserix-docs/values.yaml \
  -f charts/apps/tesserix-docs/values-prod.yaml \
  --namespace tesserix > /tmp/tesserix-docs-rendered.yaml
grep -E "kind:|name:|host:" /tmp/tesserix-docs-rendered.yaml
```

Expected output includes: `Deployment`, `Service`, `ServiceAccount`, `VirtualService` (host `docs.tesserix.app`), `NetworkPolicy`, `PodDisruptionBudget`.

---

### Task 10: Create `tesserix-storybook` chart skeleton

**Files:**
- Create: `charts/apps/tesserix-storybook/Chart.yaml`
- Create: `charts/apps/tesserix-storybook/values.yaml`
- Create: `charts/apps/tesserix-storybook/values-prod.yaml`
- Create: `charts/apps/tesserix-storybook/templates/_helpers.tpl`

- [ ] **Step 1: `Chart.yaml`** — same as tesserix-docs but `name: tesserix-storybook`, description "Tesserix design-system Storybook (ui.tesserix.app)".

- [ ] **Step 2: `values.yaml`** — copy from `tesserix-docs/values.yaml` with these deltas:

```yaml
image:
  repository: asia-south1-docker.pkg.dev/tesseracthub-480811/ghcr-remote/tesserix/tesserix-storybook
  # ...rest unchanged

service:
  port: 80
  targetPort: 8080

ingress:
  hosts:
    - host: ui.tesserix.app
      paths: [{ path: /, pathType: Prefix }]

resources:
  requests: { cpu: 50m,  memory: 64Mi }
  limits:   { cpu: 200m, memory: 256Mi }

volumes:
  tmp:
    enabled: true
    mountPath: /tmp
  nginxCache:
    enabled: true
    mountPath: /var/cache/nginx
```

(Drop the `cache` mount; storybook is fully static.)

- [ ] **Step 3: `values-prod.yaml`** — same as tesserix-docs (`pdb.enabled: true, minAvailable: 1`).

- [ ] **Step 4: `templates/_helpers.tpl`** — copy from `tesserix-docs/templates/_helpers.tpl` with all `tesserix-docs` → `tesserix-storybook` substitutions.

- [ ] **Step 5: Commit**

```bash
git add charts/apps/tesserix-storybook/Chart.yaml \
        charts/apps/tesserix-storybook/values.yaml \
        charts/apps/tesserix-storybook/values-prod.yaml \
        charts/apps/tesserix-storybook/templates/_helpers.tpl
git commit -m "feat(tesserix-storybook): add chart skeleton"
```

---

### Task 11: Add `tesserix-storybook` templates

**Files:**
- Create: `charts/apps/tesserix-storybook/templates/{deployment,service,serviceaccount,virtualservice,network-policy,pdb}.yaml`

- [ ] **Step 1: Copy templates from `tesserix-docs`** with two substitutions:
  - All `tesserix-docs` → `tesserix-storybook`
  - In `deployment.yaml`, replace the `cache` volume + mount block with a `nginxCache` block referencing `.Values.volumes.nginxCache`

- [ ] **Step 2: Commit**

```bash
git add charts/apps/tesserix-storybook/templates/
git commit -m "feat(tesserix-storybook): add deployment, service, vs, networkpolicy, pdb"
```

---

### Task 12: Validate `tesserix-storybook` chart

- [ ] **Step 1: Run validations**

```bash
helm dependency update charts/apps/tesserix-storybook
helm lint charts/apps/tesserix-storybook
helm lint charts/apps/tesserix-storybook -f charts/apps/tesserix-storybook/values-prod.yaml
helm template tesserix-storybook charts/apps/tesserix-storybook \
  -f charts/apps/tesserix-storybook/values.yaml \
  -f charts/apps/tesserix-storybook/values-prod.yaml \
  --namespace tesserix > /tmp/tesserix-storybook-rendered.yaml
grep -E "host:|containerPort:" /tmp/tesserix-storybook-rendered.yaml
```

Expected: `host: ui.tesserix.app`, `containerPort: 8080`.

---

### Task 13: Create ArgoCD app manifests

**Files:**
- Create: `argocd/prod/apps/global/tesserix-docs.yaml`
- Create: `argocd/prod/apps/global/tesserix-storybook.yaml`

- [ ] **Step 1: Write `tesserix-docs.yaml`**

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
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - ServerSideApply=true
      - CreateNamespace=false
```

- [ ] **Step 2: Write `tesserix-storybook.yaml`** — same shape, swap `tesserix-docs` → `tesserix-storybook`.

- [ ] **Step 3: Commit**

```bash
git add argocd/prod/apps/global/tesserix-docs.yaml \
        argocd/prod/apps/global/tesserix-storybook.yaml
git commit -m "feat: add argocd apps for tesserix-docs and tesserix-storybook"
```

---

### Task 14: Register apps in kustomization

**Files:**
- Modify: `argocd/prod/apps/global/kustomization.yaml`

- [ ] **Step 1: Read current contents**

```bash
cat argocd/prod/apps/global/kustomization.yaml
```

- [ ] **Step 2: Append both new app YAMLs to the `resources:` list**

Add lines:
```yaml
  - tesserix-docs.yaml
  - tesserix-storybook.yaml
```

- [ ] **Step 3: Validate**

```bash
kustomize build argocd/prod/apps/global > /tmp/k.yaml
grep "name: tesserix-" /tmp/k.yaml
```

Expected: both `tesserix-docs` and `tesserix-storybook` show up.

- [ ] **Step 4: Commit**

```bash
git add argocd/prod/apps/global/kustomization.yaml
git commit -m "chore: register tesserix-docs and tesserix-storybook in argocd kustomization"
```

---

### Task 15: Open PR #2 and merge

- [ ] **Step 1: Push and PR**

```bash
git push -u origin feat/tesserix-docs-storybook-charts
gh pr create --repo tesserix/tesserix-k8s \
  --title "feat: add charts and argocd apps for design-system docs+storybook" \
  --body "Adds charts/apps/tesserix-{docs,storybook} and argocd apps. Image tag is placeholder until design-system CI lands; expect Synced+Degraded after merge."
```

- [ ] **Step 2: Public→build→private cycle**

```bash
gh repo edit tesserix/tesserix-k8s --visibility public --accept-visibility-change-consequences
# Wait CI green
gh pr merge --squash <pr-number> --repo tesserix/tesserix-k8s
gh repo edit tesserix/tesserix-k8s --visibility private --accept-visibility-change-consequences
```

- [ ] **Step 3: Verify ArgoCD picks up apps**

```bash
export KUBECONFIG=~/.kube/gke-prod
kubectl -n argocd get applications tesserix-docs tesserix-storybook
```

Expected: both apps exist. `SYNC STATUS: Synced`, `HEALTH STATUS: Degraded` (because pods can't pull `main-bootstrap` tag — that's correct until Phase 3).

```bash
kubectl -n tesserix get deploy tesserix-docs tesserix-storybook
kubectl -n tesserix describe pod -l app.kubernetes.io/name=tesserix-docs | grep -A2 "Failed"
```

Expected: pods in `ImagePullBackOff` against the placeholder. **This is the expected pre-Phase-3 state.**

---

## Phase 3 — CI wiring (design-system PR #3)

> Switch back to `/Users/Mahesh.Sangawar/personal/tesserix-new/design-system`.

### Task 16: Add `TESSERIX_K8S_BOT` repo secret

This is a **manual GitHub UI step**, not a code change. The CI workflow will fail without it.

- [ ] **Step 1: Confirm token exists**

Find the existing PAT used by `mark8ly`. Inspect mark8ly's repo settings or ask the team. The PAT needs `repo` scope on `tesserix/tesserix-k8s`.

- [ ] **Step 2: Add to design-system repo**

GitHub UI: `tesserix/design-system` → Settings → Secrets and variables → Actions → New repository secret.
Name: `TESSERIX_K8S_BOT`. Value: the classic PAT.

- [ ] **Step 3: Verify**

```bash
gh secret list --repo tesserix/design-system | grep TESSERIX_K8S_BOT
```

Expected: secret listed.

---

### Task 17: Add deploy-k8s workflow

**Files:**
- Create: `.github/workflows/deploy-k8s.yml`

- [ ] **Step 1: Branch**

```bash
cd /Users/Mahesh.Sangawar/personal/tesserix-new/design-system
git checkout main && git pull
git checkout -b feat/k8s-deploy-workflow
```

- [ ] **Step 2: Write the workflow**

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
  group: deploy-k8s-main
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
    steps:
      - uses: actions/checkout@v4

      - name: Compute tag
        id: meta
        run: echo "tag=sha-$(echo ${GITHUB_SHA} | cut -c1-12)" >> $GITHUB_OUTPUT

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
        run: echo "tag=sha-$(echo ${GITHUB_SHA} | cut -c1-12)" >> $GITHUB_OUTPUT

      - name: Checkout tesserix-k8s
        uses: actions/checkout@v4
        with:
          repository: tesserix/tesserix-k8s
          token: ${{ secrets.TESSERIX_K8S_BOT }}
          path: tesserix-k8s
          ref: main
          fetch-depth: 0

      - name: Bump image tags
        working-directory: tesserix-k8s
        run: |
          set -euo pipefail
          for svc in tesserix-docs tesserix-storybook; do
            f="charts/apps/$svc/values.yaml"
            if [ ! -f "$f" ]; then
              echo "WARN: $f does not exist — skipping"; continue
            fi
            if command -v yq >/dev/null; then
              yq -i ".image.tag = \"${{ steps.sha.outputs.tag }}\"" "$f"
            else
              sed -i "s|^\(\s*tag:\s*\).*|\1\"${{ steps.sha.outputs.tag }}\"|" "$f"
            fi
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
            echo "Push failed (attempt $attempt) — rebasing"
            git pull --rebase origin main
          done
          echo "Push failed after 3 rebase attempts"; exit 1
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy-k8s.yml
git commit -m "ci: add k8s deploy workflow (build → ghcr → bump tesserix-k8s)"
```

---

### Task 18: Open PR #3 and validate end-to-end

- [ ] **Step 1: Push and PR**

```bash
git push -u origin feat/k8s-deploy-workflow
gh pr create --title "ci: add k8s deploy workflow" \
  --body "Builds images on push to main, pushes to GHCR, bumps tags in tesserix-k8s. Requires TESSERIX_K8S_BOT secret (Task 16)."
```

- [ ] **Step 2: Public→merge→private cycle**

```bash
gh repo edit tesserix/design-system --visibility public --accept-visibility-change-consequences
gh pr merge --squash <pr-number>
# Watch the workflow that triggers on the merge commit
gh run watch
gh repo edit tesserix/design-system --visibility private --accept-visibility-change-consequences
```

- [ ] **Step 3: Verify GHCR images**

```bash
gh api /orgs/tesserix/packages/container/tesserix-docs/versions --jq '.[0].metadata.container.tags'
gh api /orgs/tesserix/packages/container/tesserix-storybook/versions --jq '.[0].metadata.container.tags'
```

Expected: both include the new `sha-<short12>` tag.

- [ ] **Step 4: Verify tesserix-k8s bump commit**

```bash
cd /Users/Mahesh.Sangawar/personal/tesserix-new/tesserix-k8s
git fetch origin main
git log origin/main -1 --format='%h %s'
grep tag charts/apps/tesserix-docs/values.yaml
grep tag charts/apps/tesserix-storybook/values.yaml
```

Expected: latest commit is `chore: bump design-system images to sha-<short12>`. Both `values.yaml` show that tag.

- [ ] **Step 5: Verify ArgoCD healthy**

```bash
export KUBECONFIG=~/.kube/gke-prod
kubectl -n argocd get applications tesserix-docs tesserix-storybook
kubectl -n tesserix get deploy tesserix-docs tesserix-storybook
kubectl -n tesserix get pods -l 'app.kubernetes.io/name in (tesserix-docs,tesserix-storybook)'
```

Expected: ArgoCD `Synced + Healthy` for both. Deployments `2/2 READY`. All 4 pods `Running`.

- [ ] **Step 6: Port-forward smoke tests**

```bash
kubectl -n tesserix port-forward svc/tesserix-docs 13000:80 &
sleep 2; curl -sI http://localhost:13000/ | head -1
kill %1

kubectl -n tesserix port-forward svc/tesserix-storybook 18080:80 &
sleep 2; curl -sI http://localhost:18080/ | head -1
kill %1
```

Expected: both return `200 OK`.

---

## Phase 4 — DNS / external validation

### Task 19: Cloudflare DNS audit

- [ ] **Step 1: Inspect current DNS in Cloudflare dashboard**

Open Cloudflare → tesserix.app zone → DNS → search for `docs` and `ui`.

- [ ] **Step 2: Delete any per-host records**

If `docs.tesserix.app` or `ui.tesserix.app` have explicit CNAMEs (likely pointing at Vercel), delete them. The `*.tesserix.app` wildcard CNAME → tunnel will then resolve both hosts.

- [ ] **Step 3: Confirm desired final state**

```bash
dig +short docs.tesserix.app
dig +short ui.tesserix.app
```

Expected: both resolve to Cloudflare IPs (the tunnel public-facing edge), same as `tesserix.app`.

---

### Task 20: External smoke tests

- [ ] **Step 1: Verify served from cluster, not Vercel**

```bash
curl -sI https://docs.tesserix.app | grep -iE 'server|x-vercel'
curl -sI https://ui.tesserix.app  | grep -iE 'server|x-vercel'
```

Expected: no `server: Vercel` header. No `x-vercel-id` header. Both `200 OK`.

- [ ] **Step 2: Browser smoke test**

Open both URLs, click through 2-3 pages on docs and one iframe story on storybook. Confirm no broken links, assets load, security headers present (DevTools → Network → Headers).

- [ ] **Step 3: Verify pod logs received the request**

```bash
kubectl -n tesserix logs deploy/tesserix-docs --tail=20
kubectl -n tesserix logs deploy/tesserix-storybook --tail=20
```

Expected: recent log lines correspond to the curl/browser hits.

---

## Phase 5 — Vercel decommission

### Task 21: Day 0 — disconnect Git on Vercel projects

- [ ] **Step 1: Vercel UI**

Vercel dashboard → `tesserix-storybook` project → Settings → Git → Disconnect.
Repeat for `tesserix-docs`.

- [ ] **Step 2: Verify**

Confirm both projects show "No Git repository connected." Pushing to `design-system` should no longer trigger Vercel builds.

### Task 22: Day 7 — delete Vercel projects

- [ ] **Step 1: Wait 7 days from Task 21**

Soak period. Watch for any unexpected k8s-side regressions during this window.

- [ ] **Step 2: Delete projects**

Vercel dashboard → each project → Settings → Advanced → Delete Project.

- [ ] **Step 3: Verify**

```bash
vercel projects ls   # if Vercel CLI authenticated
```

Expected: neither project listed.

---

## Phase 6 — design-system cleanup (PR #4)

### Task 23: Remove Vercel residue

**Files:**
- Delete: `vercel-ui.json`
- Delete: `vercel-docs.json`
- Modify: `package.json` — remove `deploy:ui`, `deploy:docs`, `deploy:all`
- Rewrite: `DEPLOYMENT.md`

- [ ] **Step 1: Branch**

```bash
cd /Users/Mahesh.Sangawar/personal/tesserix-new/design-system
git checkout main && git pull
git checkout -b chore/remove-vercel-residue
```

- [ ] **Step 2: Delete Vercel configs**

```bash
git rm vercel-ui.json vercel-docs.json
```

- [ ] **Step 3: Edit `package.json`**

Remove these three lines from `scripts`:
```json
"deploy:ui": "vercel deploy --prod --yes --local-config vercel-ui.json",
"deploy:docs": "vercel deploy --prod --yes --local-config vercel-docs.json",
"deploy:all": "pnpm deploy:ui && pnpm deploy:docs"
```

- [ ] **Step 4: Rewrite `DEPLOYMENT.md`**

Replace contents with:

```markdown
# Tesserix Design System — Deployment

Storybook and Docs run on the Tesserix prod GKE cluster.

## Live URLs

- Documentation: https://docs.tesserix.app
- Storybook: https://ui.tesserix.app

## How a deploy happens

1. Push to `main` (paths: `apps/docs/**`, `apps/storybook/**`, `packages/**`, `pnpm-lock.yaml`).
2. `.github/workflows/deploy-k8s.yml` builds two Docker images and pushes to GHCR:
   - `ghcr.io/tesserix/tesserix-docs:sha-<12>`
   - `ghcr.io/tesserix/tesserix-storybook:sha-<12>`
3. The same workflow's `bump-k8s` job commits the new tags into
   `tesserix-k8s/charts/apps/tesserix-{docs,storybook}/values.yaml` on `main`.
4. ArgoCD reconciles within ~3 min; pods roll over.

End-to-end is typically <10 min from merge.

## Rollback

ArgoCD `selfHeal` is on, so `kubectl rollout undo` will be reverted.
Roll back via git instead:

```bash
cd path/to/tesserix-k8s
git revert <bump-commit-sha>
git push origin main
```

ArgoCD will reconcile to the previous tag.

## Local development

```bash
pnpm dev:docs              # docs at localhost:3001
pnpm --filter @tesserix/storybook dev   # storybook at localhost:6006
```

## Building the container images locally

```bash
docker build -f apps/docs/Dockerfile -t tesserix-docs:dev .
docker build -f apps/storybook/Dockerfile -t tesserix-storybook:dev .
```

## Where things live

| Concern | Repo / path |
|---|---|
| Source code, Dockerfiles, CI | `tesserix/design-system` |
| Helm charts | `tesserix/tesserix-k8s` → `charts/apps/tesserix-{docs,storybook}` |
| ArgoCD apps | `tesserix/tesserix-k8s` → `argocd/prod/apps/global/tesserix-{docs,storybook}.yaml` |
| Image registry | `ghcr.io/tesserix/tesserix-{docs,storybook}` (cluster pulls via GAR mirror) |
```

- [ ] **Step 5: Verify no Vercel residue**

```bash
git grep -i vercel
```

Expected: only matches in `pnpm-lock.yaml` (transitive deps) or historical changelogs. No source/CI references.

- [ ] **Step 6: Commit**

```bash
git add vercel-ui.json vercel-docs.json package.json DEPLOYMENT.md
git commit -m "chore: remove vercel deployment residue, rewrite DEPLOYMENT.md"
```

- [ ] **Step 7: PR + merge**

```bash
git push -u origin chore/remove-vercel-residue
gh pr create --title "chore: remove vercel residue" --body "Vercel projects deleted; remove configs and update docs."
gh repo edit tesserix/design-system --visibility public --accept-visibility-change-consequences
gh pr merge --squash <pr-number>
gh repo edit tesserix/design-system --visibility private --accept-visibility-change-consequences
```

---

## Phase 7 — tesserix-home footer (PR #5)

### Task 24: Add footer Resources column

**Files:**
- Modify: `components/common/footer.tsx` (in `tesserix-home` repo)

- [ ] **Step 1: Switch to `tesserix-home` repo and branch**

```bash
cd /Users/Mahesh.Sangawar/personal/tesserix-new/tesserix-home
git checkout main && git pull
git checkout -b feat/footer-design-system-links
```

- [ ] **Step 2: Read current footer to find the column structure**

```bash
cat components/common/footer.tsx
```

Identify the existing column pattern (likely an array of `{ title, links: [...] }` or repeated JSX blocks).

- [ ] **Step 3: Add Resources column**

Add a "Resources" column with:

```tsx
{
  title: 'Resources',
  links: [
    { label: 'Documentation', href: 'https://docs.tesserix.app', external: true },
    { label: 'Design System', href: 'https://ui.tesserix.app', external: true },
  ],
}
```

If the existing pattern doesn't have an `external` flag, ensure outbound `<a>` elements get `target="_blank" rel="noreferrer"`. Match the file's existing style and rendering exactly.

- [ ] **Step 4: Run dev server and verify**

```bash
pnpm dev   # or appropriate dev command for tesserix-home
```

Open `http://localhost:<port>` (likely 3000 or 3001), scroll to footer, confirm the new column is visually balanced with siblings, and clicks open the right URLs in a new tab.

- [ ] **Step 5: Commit and PR**

```bash
git add components/common/footer.tsx
git commit -m "feat(footer): add resources column linking docs and design system"
git push -u origin feat/footer-design-system-links
gh pr create --title "feat: footer links to docs and design system" \
  --body "Adds 'Resources' column to homepage footer with links to docs.tesserix.app and ui.tesserix.app."
```

- [ ] **Step 6: Public→merge→private**

```bash
gh repo edit tesserix/tesserix-home --visibility public --accept-visibility-change-consequences
gh pr merge --squash <pr-number>
gh repo edit tesserix/tesserix-home --visibility private --accept-visibility-change-consequences
```

CI deploys the new `company` chart image automatically.

- [ ] **Step 7: Verify on prod**

Open `https://tesserix.app`, scroll to footer, click both links, confirm they open the new k8s-served sites.

---

## Acceptance criteria (from spec §9)

Run these at the end of Phase 4 and again after Phase 7:

- [ ] `curl -sI https://docs.tesserix.app | grep -i vercel` returns no matches.
- [ ] `curl -sI https://ui.tesserix.app  | grep -i vercel` returns no matches.
- [ ] `kubectl -n tesserix get deploy tesserix-docs tesserix-storybook` shows `2/2 READY` for both.
- [ ] A manual `gh workflow run deploy-k8s.yml --repo tesserix/design-system` produces: 2 new GHCR images, 1 bump commit on `tesserix-k8s/main`, ArgoCD `Synced + Healthy` within 5 min.
- [ ] After Phase 5 Day 7: `vercel projects ls` shows neither project.
- [ ] In `design-system`: `git grep -i vercel` shows nothing in source/CI (lockfile/changelog matches OK).
- [ ] On `https://tesserix.app`, the footer shows "Documentation" and "Design System" entries that open the k8s-served URLs.

---

## Risks and rollback

See spec §8. Summary:

- **Bad image:** `git revert <bump-commit-sha>` on `tesserix-k8s/main`. ArgoCD reconciles to prior tag.
- **Bad chart change:** same — `git revert` on `tesserix-k8s`.
- **Cluster down during week 1 of Phase 5:** Vercel projects still alive; re-add `docs.tesserix.app` / `ui.tesserix.app` custom domains to restore. 30-60 min window.
- **Cluster down after Day 7:** Vercel deleted, no fallback. Recover the cluster.
