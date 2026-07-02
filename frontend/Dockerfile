# ─── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

RUN corepack enable

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Patch: @angular-devkit/core 21.2.x ships an empty utilities.js (npm publishing bug)
COPY patches/angular-devkit-utilities.js node_modules/@angular-devkit/core/src/workspace/json/utilities.js

COPY . .
RUN npm run build -- --configuration production

# ─── Development stage ────────────────────────────────────────────────────────
FROM node:22-alpine AS development

RUN corepack enable

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

EXPOSE 4000

CMD ["node_modules/.bin/ng", "serve", "--host", "0.0.0.0", "--port", "4000", "--poll", "1000"]

# ─── Production stage ─────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
