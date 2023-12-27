# --- Stage 1: Build ---
FROM --platform=linux/amd64 node:18-alpine3.16 AS build

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --production=false

COPY . .

RUN npx nest build

# --- Stage 2: Run ---
FROM --platform=linux/amd64 node:18-alpine3.16 AS production

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --production

COPY --from=build /apps/dist /app/dist

ENV PORT=8080
EXPOSE 8080

CMD ["node", "/app/dist/main"]
