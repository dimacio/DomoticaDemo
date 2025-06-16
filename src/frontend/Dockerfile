# STAGE 1: Build - Compilar el TypeScript a JavaScript
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración de dependencias y de typescript
COPY package*.json ./
COPY ts/tsconfig.json ./ts/

# Instalar dependencias (typescript)
RUN npm install

# Copiar el código fuente de TypeScript
COPY ts ./ts

# Compilar el proyecto. Esto leerá tsconfig.json y generará los .js en /app/static/js
RUN npm run build


# STAGE 2: Production - Servir los archivos estáticos con Nginx
FROM nginx:stable-alpine

# Copiar los archivos estáticos (CSS, JS compilado desde el 'builder', etc.)
COPY --from=builder /app/static /usr/share/nginx/html/static
COPY ./index.html /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
