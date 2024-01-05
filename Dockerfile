FROM node:18

ENV NODE_ENV production

WORKDIR /app

COPY ./ /app

RUN npm install --ignore-scripts
RUN npm run build

EXPOSE 8080 

CMD npm start
