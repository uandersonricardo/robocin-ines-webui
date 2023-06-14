FROM node:18

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3030

CMD ["yarn", "dev"]
