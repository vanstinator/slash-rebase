FROM node:12.16.3-alpine3.9

ARG PORT=3000

ARG NODE_ENV=production

ENV PORT=$PORT NODE_ENV=$NODE_ENV PATH=/app/node_modules/.bin:$PATH
EXPOSE $PORT

# git - supporting git operations
RUN apk update && apk add --no-cache git && apk add --no-cache bash && apk add --no-cache python && apk add --no-cache build-base

WORKDIR /app
COPY package-lock.json package.json ./

RUN npm install

WORKDIR /app/src
COPY . ./

CMD npm run start