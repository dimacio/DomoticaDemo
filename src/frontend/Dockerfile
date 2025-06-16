# =================================================================
# Dockerfile para el Frontend con Materialize y TypeScript (Multi-etapa)
# =================================================================

# --- ETAPA 1: Construcción (Compilar TypeScript a JavaScript) ---
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copia los archivos de configuración y dependencias.
COPY package*.json ./
COPY tsconfig.json ./

# Instala las dependencias de desarrollo (typescript).
RUN npm install

# Copia el código fuente de TypeScript.
COPY ./ts ./ts

# Ejecuta el script de 'build' (tsc) para compilar TS a JS.
# El resultado se guardará en /static/js/main.js según tsconfig.json
RUN npm run build


# --- ETAPA 2: Producción (Servir los archivos estáticos con Nginx) ---
FROM nginx:1.21.6-alpine

# Copia la configuración personalizada de Nginx.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia el HTML principal y los assets estáticos (CSS, JS de Materialize).
COPY index.html /usr/share/nginx/html/
COPY ./static /usr/share/nginx/html/static

# Copia el JavaScript de nuestra aplicación compilado desde la etapa 'builder'.
COPY --from=builder /usr/src/app/static/js/main.js /usr/share/nginx/html/static/js/main.js

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
