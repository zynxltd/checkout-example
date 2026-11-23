# Plotline — single image: build React, run Express (API + static)
# docker build -t plotline -f Dockerfile .
# docker run --rm -p 5210:5210 plotline

FROM node:22-alpine AS web-build
WORKDIR /web
COPY web/package.json web/package-lock.json* ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM node:22-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5210
ENV WEB_DIST=/app/web/dist

COPY api/package.json api/package-lock.json* ./api/
WORKDIR /app/api
RUN npm ci --omit=dev
COPY api/src ./src
COPY --from=web-build /web/dist /app/web/dist

EXPOSE 5210
CMD ["node", "src/server.js"]
