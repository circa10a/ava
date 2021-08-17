FROM node
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["npm", "start"]