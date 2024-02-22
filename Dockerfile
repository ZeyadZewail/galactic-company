FROM node:lts
EXPOSE 8080
RUN apt-get -y update

WORKDIR /root
COPY ./ ./
RUN npm install
RUN npm run build
CMD npm run host
