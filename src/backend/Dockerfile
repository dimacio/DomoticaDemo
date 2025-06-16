# Usar una imagen base ligera de Node.js para el backend
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar los archivos de definición de dependencias
COPY package*.json ./

# Instalar las dependencias de producción para el backend
RUN npm install --only=production

# Copiar el resto de los archivos de la aplicación (index.js, mysql-connector.js, etc.)
COPY . .

# Exponer el puerto 3000 que usa la API del backend
EXPOSE 3000

# Comando para iniciar la aplicación del backend
CMD [ "node", "index.js" ]
