FROM node:20-alpine AS base
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000
ENV NODE_ENV=production

CMD ["node", "server.js"]
