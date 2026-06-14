# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat   # an toàn cho sharp trên musl/alpine
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Add build arguments for version and build date
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_APP_BUILD_DATE

# Set them as environment variables during build
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION
ENV NEXT_PUBLIC_APP_BUILD_DATE=$NEXT_PUBLIC_APP_BUILD_DATE

RUN npm run build

FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=8080 HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
# seed data file-based (forum/comments/views/posts) + đúng owner để nextjs ghi được
COPY --from=build --chown=nextjs:nodejs /app/src/data ./src/data
USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]