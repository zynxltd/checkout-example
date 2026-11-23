FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5210

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY src ./src

EXPOSE 5210
CMD ["node", "src/server.js"]
