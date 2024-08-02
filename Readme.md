### 1-DEFINIR LA LISTA DE CAMPAÑAS
En el archivo config/ListCedisActive.ts se encuentra el array con la lista de cedis a ejecutar, este es el archivo a configurar junto con el .env

### 1-construir la imagen
```bash
docker build -t novaventa-scrapping .
```

### 2-correr el contenedor
```bash
# -d => correr en segundo plano
# -p <anfitrion>:<contenedor>
# --env-file .archivo-con-variables-de-entorno
# IDS CEDIS TO SCRAPPING - FIRST_CEDI = 1 - SECOND_CEDI = 2 - THIRD_CEDI = 3
docker run -d --name contenedor1 -p 3001:3000 --env-file .env -e FIRST_CEDI=1 -e SECOND_CEDI=2 -e THIRD_CEDI=3 novaventa-scrapping
docker run -d --name contenedor2 -p 3002:3000 --env-file .env -e FIRST_CEDI=4 -e SECOND_CEDI=5 -e THIRD_CEDI=6 novaventa-scrapping
docker run -d --name contenedor3 -p 3003:3000 --env-file .env -e FIRST_CEDI=7 -e SECOND_CEDI=8 -e THIRD_CEDI=9 novaventa-scrapping
docker run -d --name contenedor4 -p 3004:3000 --env-file .env -e FIRST_CEDI=10 -e SECOND_CEDI=11 -e THIRD_CEDI=12 novaventa-scrapping
```

### 3-validar que el contenedor este corriendo
```bash
docker ps # deberia mostrar el nombre del contenedor creado
```

### 4-acceder al contenedor
```bash
docker exec -it contenedor1 /bin/bash
```

### 4.1-salir del contenedor
```bash
exit
```

### eliminar un contenedor
```bash
docker rm -f contenedor1
```

# Pasos para iniciar el proyecto
  1- instale las dependencias
  2- ejecuta npm run swagger
  3- actualice el archivo .env
  4- ejecute npm run dev
