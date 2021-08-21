FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package*.json ./
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8000

CMD [ "npm", "start"]
