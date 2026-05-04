# Tesserix Design System — Deployment

Storybook and Docs run on the Tesserix prod GKE cluster.

## Live URLs

- Documentation: https://docs.tesserix.app
- Storybook: https://ui.tesserix.app

## How a deploy happens

1. Push to `main` (path-filtered: `apps/docs/**`, `apps/storybook/**`, `packages/**`, `pnpm-lock.yaml`, `package.json`).
2. `.github/workflows/deploy-k8s.yml` builds two Docker images in parallel and pushes to GHCR:
   - `ghcr.io/tesserix/tesserix-docs:sha-<12>`
   - `ghcr.io/tesserix/tesserix-storybook:sha-<12>`
3. The same workflow's `bump-k8s` job commits the new tags into
   `tesserix-k8s/charts/apps/tesserix-{docs,storybook}/values.yaml` on `main`.
4. ArgoCD reconciles within ~3 minutes; pods roll over with the new image.

End-to-end is typically under 10 minutes from merge to live.

You can also trigger the workflow manually:

```bash
gh workflow run deploy-k8s.yml --repo tesserix/design-system --ref main
```

## Rollback

ArgoCD `selfHeal` is on, so `kubectl rollout undo` will be reverted within a sync interval. Roll back via git instead — revert the tag-bump commit in `tesserix-k8s`:

```bash
cd path/to/tesserix-k8s
git revert <bump-commit-sha>      # e.g. the most recent "chore: bump design-system images to ..."
git push origin main
```

ArgoCD reconciles to the previous tag automatically.

## Local development

```bash
pnpm dev:docs                            # docs at localhost:3001
pnpm --filter @tesserix/storybook dev    # storybook at localhost:6006
```

## Building the container images locally

Build context is the monorepo root (so `workspace:*` deps resolve):

```bash
docker build -f apps/docs/Dockerfile      -t tesserix-docs:dev      .
docker build -f apps/storybook/Dockerfile -t tesserix-storybook:dev .

docker run --rm -p 3000:3000 tesserix-docs:dev      # docs at http://localhost:3000
docker run --rm -p 8080:8080 tesserix-storybook:dev # storybook at http://localhost:8080
```

## Where things live

| Concern | Repo / path |
|---|---|
| Source, Dockerfiles, CI workflow | `tesserix/design-system` |
| Helm charts | `tesserix/tesserix-k8s` → `charts/apps/tesserix-{docs,storybook}` |
| ArgoCD applications | `tesserix/tesserix-k8s` → `argocd/prod/apps/global/tesserix-{docs,storybook}.yaml` |
| Image registry (push) | `ghcr.io/tesserix/tesserix-{docs,storybook}` |
| Image registry (cluster pull) | `asia-south1-docker.pkg.dev/tesseracthub-480811/ghcr-remote/tesserix/...` (in-region GAR mirror of GHCR) |
| Cluster routing | Cloudflare wildcard tunnel (`*.tesserix.app`) → Istio gateway `istio-ingress/tesseract-gateway` → VirtualService → Service → Deployment |
| Public access (Istio AuthorizationPolicy) | `tesserix-k8s/argocd/prod/infrastructure/istio-auth-policies.yaml` (inline `frontendApps:` list) |

## Secrets

| Secret | Lives in | Purpose |
|---|---|---|
| `TESSERIX_K8S_BOT` | GitHub repo secret on `tesserix/design-system` | Fine-grained PAT with `Contents: write` on `tesserix/tesserix-k8s` for the `bump-k8s` job. Rotate every 90 days. |
| `GITHUB_TOKEN` | Built-in | GHCR push for both images. |

## Chromatic visual regression

Independent of cluster deploy. Runs on every PR via `.github/workflows/ci-cd.yml` — see that file for details.
