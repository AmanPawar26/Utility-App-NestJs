
# ---- Stage 1: Build Frontend ----
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/vite-project ./
RUN npm ci
RUN npm run build

# ---- Stage 2: Build Backend ----
FROM node:20 AS backend
WORKDIR /app/backend
COPY backend ./
RUN npm ci
RUN npm run build

# ---- Stage 3: Production Image ----
FROM node:20-slim

WORKDIR /app

# Copy backend build
COPY --from=backend /app/backend/dist ./dist
COPY --from=backend /app/backend/package.json .
COPY --from=backend /app/backend/node_modules ./node_modules

# Copy built React frontend into public folder
COPY --from=frontend /app/frontend/dist ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7000

EXPOSE 7000

CMD ["node", "dist/main"]
