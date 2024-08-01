# Esta es la version de linux con nodejs instalado
FROM node:22-alpine3.20

# Instala bash y dependencias de Puppeteer
RUN apk update && apk add --no-cache \
    bash \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji


# esta version ya viene con una carpeta llamada /app - /usr /etc /var /lib ... y otras mas
# esto seria como hacer "cd app"
WORKDIR /app

# para ejecutar la aplicacion primero tendriamos que traer los archivos a la carpeta /app
# para eso usamos el comando COPY que copia los archivos de la carpeta actual a la carpeta actual del linuz /app
# COPY source destination
COPY package.json ./

# para instalar las dependencias de la aplicacion usamos el comando RUN
RUN npm install

# Instala PM2 globalmente
RUN npm install pm2 -g

# Copia el resto del código de la aplicación
COPY . .

# Compila el proyecto TypeScript a JavaScript
RUN npm run build

# Expone el puerto que la aplicación usará
EXPOSE 3000

# el cmd se ejecuta cuando se levante la imagen en un contenedor
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]




# how to start docker container witch uses pm2
# https://www.youtube.com/watch?v=4C7-yWQWjxk&ab_channel=WillNguyen
