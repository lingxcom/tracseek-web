# 第一阶段：编译
FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 第二阶段：生产环境托管
FROM nginx:stable-alpine
# 将第一阶段生成的 dist 目录（Vue/React 编译结果）拷贝到 Nginx 目录
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 拷贝自定义的 Nginx 配置，解决跨域反向代理
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]