FROM node:18-alpine AS build

WORKDIR /app

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python

COPY package.json ./

RUN yarn install  --ignore-optional 2> >(grep -v warning 1>&2)

RUN npm i serverless
RUN serverless config credentials --provider aws --key AKIAVQSWOMCQCTKTS3W7 --secret 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 --profile aman

COPY . ./

FROM node:18-alpine AS test

WORKDIR /app

COPY --from=build /app ./

CMD ["npm", "run", "test"]

FROM node:18-alpine AS package

ARG NODE_ENV=dev
ARG STAGE
ARG AWS_REGION 
ARG ACCESS_TOKEN_SECRET
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

ENV NODE_ENV=$NODE_ENV
ENV STAGE=$STAGE
ENV AWS_REGION =$AWS_REGION 
ENV ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

WORKDIR /app

COPY --from=build /app ./

RUN mkdir logs && touch logs/package.log
RUN npm run package | tee logs/package.log

FROM node:18-alpine AS deploy

# Install serverless


ARG NODE_ENV=prod
ARG STAGE
ARG AWS_REGION
ARG ACCESS_TOKEN_SECRET
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

ENV NODE_ENV=$NODE_ENV
ENV STAGE=$STAGE
ENV AWS_REGION=$AWS_REGION
ENV ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

WORKDIR /app

COPY --from=package /app ./



CMD ["npm", "run", "deploy-prod"]


FROM node:18-alpine AS local

WORKDIR /app

RUN apk add vim
RUN apk add bash

COPY --from=build /app ./

EXPOSE 4000
EXPOSE 9229
CMD ["npm", "run", "dev:server"]
