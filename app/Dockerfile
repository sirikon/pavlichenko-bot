FROM node:12.13-alpine AS build-app
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY ./ .
RUN npm run lint && npm test && npm run build

FROM node:12.13-alpine
WORKDIR /app
COPY --from=build-app /app/package.json .
COPY --from=build-app /app/package-lock.json .
RUN npm install --production
COPY --from=build-app /app/out .
ENV DATA_FOLDER /data
CMD node src/main.js
