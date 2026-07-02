# ─── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

# ─── Development stage ────────────────────────────────────────────────────────
FROM node:22-alpine AS development

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# ─── Production stage ─────────────────────────────────────────────────────────
FROM node:22-alpine AS production

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

ENV NODE_ENV=production

# Copy full node_modules (prisma CLI needed for migrate deploy)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package*.json ./

EXPOSE 3000

# Run migrations then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
