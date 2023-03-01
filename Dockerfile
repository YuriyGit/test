FROM node

WORKDIR /app

ARG node_env=production

COPY ./package*.json ./
RUN npm install
COPY . ./app

CMD ["npm","run","dev"]