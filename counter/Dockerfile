FROM node

WORKDIR /counter

COPY ./package*.json ./

RUN npm install

COPY src/ ./src

CMD ["npm", "run", "dev"]

