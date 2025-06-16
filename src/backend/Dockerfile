# =================================================================
# Dockerfile para el servicio de Backend (Node.js)
# Define los pasos para construir la imagen de Docker de la API.
# =================================================================

# 1. Usar una imagen base oficial de Node.js (versión 18, Alpine para un tamaño reducido).
FROM node:18-alpine

# 2. Establecer el directorio de trabajo dentro del contenedor.
WORKDIR /usr/src/app

# 3. Copiar los archivos de definición de dependencias.
# Se copian primero para aprovechar el caché de Docker. Si estos archivos no cambian,
# no se volverá a ejecutar 'npm install' en reconstrucciones posteriores.
COPY package*.json ./

# 4. Instalar las dependencias del proyecto.
RUN npm install

# 5. Instalar 'nodemon' globalmente dentro del contenedor para el desarrollo.
# Esto permite que el servidor se reinicie automáticamente cuando detecta cambios en el código.
RUN npm install -g nodemon

# 6. Copiar el resto del código fuente de la aplicación.
COPY . .

# 7. Exponer el puerto en el que la aplicación correrá dentro del contenedor.
EXPOSE 3000

# 8. El comando para iniciar la aplicación usando nodemon.
# Este comando se ejecutará cuando se inicie un contenedor a partir de esta imagen.
CMD [ "nodemon", "index.js" ]
