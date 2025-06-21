FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY backend/package*.json ./

RUN npm install

COPY backend/. .

RUN npm run build

# STAGE 2 - Production
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY backend/package*.json ./

RUN npm install --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
