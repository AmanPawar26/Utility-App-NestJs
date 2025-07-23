# -------- Stage 1: Build Frontend --------
FROM node:20 AS frontend

WORKDIR /app/frontend

# Copy and install dependencies first for caching
COPY frontend/vite-project/package*.json ./
RUN npm ci

# Copy all frontend source files
COPY frontend/vite-project ./

# Build the frontend
RUN npm run build


# -------- Stage 2: Build Backend --------
FROM node:20 AS backend

WORKDIR /app/backend

# Copy and install dependencies
COPY backend/package*.json ./
RUN npm ci

# Copy backend source
COPY backend ./

# Build backend
RUN npm run build


# -------- Stage 3: Production Image --------
FROM node:20 AS production

WORKDIR /app

# Copy backend build output and dependencies
COPY --from=backend /app/backend/dist ./dist
COPY --from=backend /app/backend/package*.json ./
COPY --from=backend /app/backend/node_modules ./node_modules

# Rebuild native modules like sqlite3
RUN npm rebuild sqlite3

# Copy built frontend (what NestJS will serve statically)
COPY --from=frontend /app/frontend/dist ./frontend

# Set environment variables
ENV NODE_ENV=production
ENV PORT=7000

# Expose the port
EXPOSE 7000

# Start the backend server
CMD ["node", "dist/src/main.js"]
