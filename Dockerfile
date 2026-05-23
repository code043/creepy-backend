# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate --schema=prisma/schema.prisma
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run build && ls -la dist/

# ---- Production stage ----
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copy prisma schema and generated client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY prisma ./prisma

# Copy compiled output
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/main"]
