FROM 14.1.0-alpine3.10

ARG NODE_ENV=production

ENV NODE_ENV=$NODE_ENV
EXPOSE 3000

# git - supporting git options
RUN apk update && apk add --no-cache git

WORKDIR /app
COPY package-lock.json package.json ./
# yarn-cache-install.sh is available from the production-cloud image
RUN npm run install

WORKDIR /app/src
COPY . ./

RUN npm run start