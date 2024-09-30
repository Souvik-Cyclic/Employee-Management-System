# Dockerfile
FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm run build

CMD ["pnpm", "run", "start:prod"]
