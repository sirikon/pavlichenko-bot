FROM node:10.15-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i --production
COPY main.js .
COPY ./src ./src
CMD npm start
