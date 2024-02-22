#Stage 1
FROM node:17-alpine as builder
WORKDIR /app
COPY package*.json .
COPY yarn*.lock .
RUN npm install
COPY . .

ARG BACKEND_URL
ENV REACT_APP_BACKEND_URL=$BACKEND_URL

RUN npm run build

#################################################

#Stage 2
FROM nginx:1.19.0
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
