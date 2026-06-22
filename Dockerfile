# syntax=docker/dockerfile:1.4
# ⭐ Bắt buộc dùng :1.4 để --cache-to type=inline hoạt động

# ============================================================
# Stage 1: base — image nền tảng, ít khi thay đổi
# ============================================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat   # an toàn cho sharp trên musl/alpine
WORKDIR /app

# ============================================================
# Stage 2: deps — chỉ cài dependencies
# ⭐ KEY CACHE: layer này CHỈ invalidate khi package.json/package-lock.json đổi
# ============================================================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit
# ↑ --prefer-offline: ưu tiên cache local (.npm/) thay vì luôn gọi registry
# ↑ --no-audit: bỏ qua security check (CI không cần, tiết kiệm ~10s)

# ============================================================
# Stage 3: builder — build Next.js production
# ============================================================
FROM base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Copy node_modules từ deps (cache hit cực cao)
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
# ⭐ QUAN TRỌNG: phải có .dockerignore để loại trừ node_modules, .next, .git
COPY . .

# Build arguments cho version info
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_APP_BUILD_DATE
ARG NEXT_PUBLIC_COMMIT_SHA
ARG NEXT_PUBLIC_BRANCH_NAME

# Set làm ENV để Next.js embed vào client bundle
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION
ENV NEXT_PUBLIC_APP_BUILD_DATE=$NEXT_PUBLIC_APP_BUILD_DATE
ENV NEXT_PUBLIC_COMMIT_SHA=$NEXT_PUBLIC_COMMIT_SHA
ENV NEXT_PUBLIC_BRANCH_NAME=$NEXT_PUBLIC_BRANCH_NAME

RUN npm run build

# ============================================================
# Stage 4: runner — image production, nhỏ gọn
# ============================================================
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=8080 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy output từ builder (standalone mode → image rất nhỏ)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Seed data cho runtime (forum/comments/views/posts)
COPY --from=builder --chown=nextjs:nodejs /app/src/data ./src/data

USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
