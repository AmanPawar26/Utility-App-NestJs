# Build frontend
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/vite-project ./vite-project
WORKDIR /app/frontend/vite-project
RUN npm install && npm run build

# Build backend
FROM node:18 AS backend
WORKDIR /app/backend
COPY backend ./backend
WORKDIR /app/backend
RUN npm install && npm run build

# Final image
FROM node:18
WORKDIR /app

# Copy built backend and frontend
COPY --from=backend /app/backend/dist ./backend
COPY --from=frontend /app/frontend/vite-project/dist ./frontend

# Install production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

EXPOSE 3000
CMD ["node", "backend/main"]
