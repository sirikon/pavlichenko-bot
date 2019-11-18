FROM node:10.15-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i --production
COPY ./src ./src

ENV DATA_FOLDER /data
CMD npm run start:prod
