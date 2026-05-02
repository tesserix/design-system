# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
WORKDIR /app

# ---- builder ----
FROM base AS builder
COPY . .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm --filter '@tesserix/utils' --filter '@tesserix/hooks' \
        --filter '@tesserix/tokens' --filter '@tesserix/web' \
        --filter '@tesserix/native' --filter '@tesserix/icons' build
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
