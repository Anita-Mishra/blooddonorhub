FROM node:alpine as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm audit fix --force
RUN npm run build --prod
#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/csci-5409-saiyans-group-project /usr/share/nginx/html
EXPOSE 80