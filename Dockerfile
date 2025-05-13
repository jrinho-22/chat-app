FROM node:18 AS build

WORKDIR /usr/src/app

COPY novo2/. /usr/src/app

RUN npm install
RUN npx nx build angular-app
RUN npx nx build express-app

FROM nginx:1.25-alpine

RUN apk update && \
    apk add --no-cache curl nodejs npm

COPY --from=build /usr/src/app/dist/apps/angular-app/browser /usr/share/nginx/html

COPY --from=build /usr/src/app/dist/apps/node-app /usr/src/backend

WORKDIR /usr/src/backend

RUN npm install --production

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;' & \
    node main.js    

EXPOSE $PORT    