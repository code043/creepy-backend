FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate --schema=prisma/schema.prisma

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run build

RUN ls -la dist/

EXPOSE 8080

CMD ["node", "dist/main"]
