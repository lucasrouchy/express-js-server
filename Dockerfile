FROM node:16
WORKDIR /usr/src/app

COPY . .
RUN npm install
EXPOSE 3000
ENV MONGODB_USER=lucasrouchy1
ENV MONGODB_PASSWORD=guest
ENV MONGODB_DB=MyResourcesDB
CMD [ "node", "app.js" ]