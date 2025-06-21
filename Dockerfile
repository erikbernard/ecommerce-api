# ------------------ STAGE 1: Build ------------------
# Use uma imagem Node.js oficial como base.
# A tag 'alpine' resulta em uma imagem menor.
FROM node:20-alpine AS development

# Defina o diretório de trabalho dentro do contêiner.
WORKDIR /usr/src/app

# Copie os arquivos de manifesto de pacotes.
# O uso de wildcards garante que ambos package.json e package-lock.json sejam copiados.
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# Instale apenas as dependências de produção.
RUN npm install --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]