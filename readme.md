Sistema de Control de Incubadora
¡Ayudaría mucho si apoyaras este proyecto con una ⭐ en Github!

Este proyecto es una aplicación web full-stack que se ejecuta sobre el ecosistema Docker. Se ha personalizado para controlar y monitorear una incubadora IoT, demostrando una arquitectura de microservicios robusta y desacoplada.

La aplicación consta de un frontend interactivo desarrollado en TypeScript, un backend que actúa como API gateway en NodeJS, una base de datos MySQL para la persistencia de datos, y un emulador de hardware (ESP32) que simula en tiempo real los sensores y actuadores de la incubadora.

El objetivo es presentar una aplicación funcional que permita visualizar datos de sensores (temperatura y humedad) y controlar actuadores (lámpara, calefactor, vaporizador) a través de una interfaz web intuitiva, registrando el historial de mediciones para su posterior análisis.

En esta imagen puedes ver la arquitectura de la solución implementada.

Comenzando 🚀
Esta sección es una guía con los pasos esenciales para que puedas poner en marcha la aplicación.

Instalar las dependencias
Para correr este proyecto es necesario que instales Docker y Docker Compose.

En este artículo publicado en nuestra web están los detalles para instalar Docker y Docker Compose en una máquina Linux. Si querés instalar ambas herramientas en una Raspberry Pi podés seguir este artículo de nuestra web que te muestra todos los pasos necesarios.

En caso que quieras instalar las herramientas en otra plataforma o tengas algún inconveniente, puedes leer la documentación oficial de Docker y también la de Docker Compose.

Descargar el código
Para descargar el código, lo más conveniente es que realices un fork de este proyecto a tu cuenta personal. Una vez que ya tengas el fork a tu cuenta, descárgalo con este comando (acuérdate de poner tu usuario en el link):

git clone [https://github.com/USER/app-fullstack-base.git](https://github.com/USER/app-fullstack-base.git)

En caso que no tengas una cuenta en Github puedes clonar directamente este repo.

Ejecutar la aplicación
Para ejecutar la aplicación tienes que correr el comando docker-compose up --build desde la raíz del proyecto. Este comando va a construir las imágenes de Docker para cada servicio (frontend, backend, emulador) y descargar la de la base de datos, para luego ponerlas todas en funcionamiento.

Para acceder al cliente web, ingresa a la URL: http://localhost:8080/

Si pudiste acceder al cliente web, significa que la aplicación se encuentra corriendo correctamente.

Si te aparece un error la primera vez que corres la app, detén el proceso (Ctrl + C) y volvé a iniciarla. Esto puede ocurrir si el backend intenta conectarse a la base de datos antes de que esta esté completamente lista.

Configuraciones de funcionamiento 🔩
Al crearse la aplicación se ejecutan los contenedores de Docker de cada servicio y se inicializa la base de datos con una estructura predefinida.

Configuración de la DB
Las credenciales y configuración de la base de datos se definen como variables de entorno en el archivo docker-compose.yml para los servicios backend y db.

Si quisieras cambiar la contraseña, puertos, hostname u otras configuraciones de la DB deberías modificar el servicio db en el archivo docker-compose.yml y luego actualizar las variables de entorno del servicio backend para que coincidan.

Estructura de la DB
Al iniciar el servicio de la base de datos por primera vez, Docker Compose utiliza el script SQL ubicado en db/dumps/incubator_db.sql para crear la base de datos smart_garden y sus tablas (Incubators, Devices, SensorLogs).

Si quisieras cambiar la estructura (por ejemplo, añadir un nuevo tipo de dispositivo o un nuevo campo), deberías modificar este archivo SQL. Para que los cambios surtan efecto, es necesario eliminar el volumen de Docker que persiste los datos de la base de datos, para que se vuelva a crear desde cero. Puedes hacerlo con el comando docker-compose down -v.

Detalles principales 🔍
En esta sección encontrarás las características más relevantes del proyecto.

Arquitectura de la aplicación
La aplicación se ejecuta sobre el ecosistema Docker, orquestando cuatro servicios independientes para lograr un alta cohesión y bajo acoplamiento.

El cliente web (Frontend)
Es una Single Page Application (SPA) desarrollada con TypeScript, HTML5 y CSS3. Se comunica con el backend mediante peticiones HTTP para obtener datos y enviar comandos. Utiliza Materialize.css para los estilos y Chart.js para la visualización de datos históricos en tiempo real. Es servida de forma estática y eficiente por un servidor Nginx.

El servicio web (Backend)
Es una API RESTful desarrollada en NodeJS con el framework Express. Actúa como un gateway o intermediario:

Expone endpoints para que el frontend los consuma.

Valida y procesa las peticiones.

Se comunica con la base de datos MySQL para persistir y consultar datos (configuración de dispositivos, logs de sensores).

Se comunica con el Emulador ESP32 para leer el estado de los sensores y enviar comandos a los actuadores.

El Emulador ESP32
Es un microservicio independiente en NodeJS que simula el comportamiento de un dispositivo de hardware real. Expone su propia API para:

Devolver valores simulados de temperatura y humedad que cambian con el tiempo según el estado de los actuadores.

Recibir comandos para encender/apagar actuadores o cambiar su valor (ej. dimmer).

Esta simulación permite un desarrollo y prueba completos del stack de software sin necesidad de disponer del hardware físico.

La base de datos
Se utiliza un motor MySQL para la persistencia de los datos. La base de datos smart_garden almacena:

La configuración de las incubadoras y sus dispositivos asociados (sensores y actuadores).

El estado actual de los actuadores.

Un log histórico de las mediciones de los sensores, que se utiliza para alimentar el gráfico del frontend.

Compilación y Ejecución
El proyecto está 100% containerizado. Cada servicio tiene su propio Dockerfile que define cómo debe ser construido. El docker-compose.yml orquesta la construcción de estas imágenes y la ejecución de los contenedores, configurando las redes y dependencias entre ellos para que puedan comunicarse. El código TypeScript del frontend se compila a JavaScript durante la fase de construcción de su imagen de Docker.

Organización del proyecto
.
├── db
│   └── dumps
│       └── incubator_db.sql     # Script de inicialización de la DB
├── doc                          # Documentación general (imágenes)
└── src
    ├── backend                  # Código fuente del Backend (Node.js + Express)
    │   ├── Dockerfile
    │   ├── index.js
    │   ├── mysql-connector.js
    │   └── package.json
    ├── esp32-emulator           # Código fuente del Emulador (Node.js + Express)
    │   ├── Dockerfile
    │   ├── index.js
    │   └── package.json
    └── frontend                 # Código fuente del Frontend
        ├── static
        │   ├── css
        │   └── js
        ├── ts
        │   ├── main.ts
        │   └── tsconfig.json
        ├── Dockerfile
        ├── index.html
        ├── nginx.conf
        └── package.json
├── docker-compose.yml           # Archivo principal de orquestación de Docker
└── README.md                    # Este archivo

Detalles de implementación 💻
Frontend
El frontend, al cargarse, inicia un ciclo de actualización que cada 5 segundos realiza dos acciones:

Pide al backend el estado actual de los sensores y actualiza los medidores de temperatura y humedad.

Pide al backend el historial reciente de mediciones y actualiza el gráfico de Chart.js.

Cuando un usuario interactúa con un control (un slider o un switch), el frontend envía una petición POST al endpoint correspondiente del backend, incluyendo el id del dispositivo a controlar y el nuevo valor.

Backend
El backend expone una API RESTful para ser consumida por el cliente. Las rutas principales están diseñadas de forma jerárquica para representar la relación entre incubadoras y dispositivos.

GET /api/incubators/:incubatorId/devices

Descripción: Obtiene la lista completa de dispositivos (sensores y actuadores) asociados a una incubadora.

Respuesta (200 OK):

[
    { "id": 1, "incubator_id": 1, "name": "Lámpara Infrarroja", "category": "actuator", "type": "dimmer", "state": 50 },
    { "id": 4, "incubator_id": 1, "name": "Sensor DHT22", "category": "sensor", "type": "dht22", "state": 0 }
]

GET /api/incubators/:incubatorId/sensors/reading

Descripción: Obtiene la lectura más reciente de los sensores de la incubadora desde el emulador.

Respuesta (200 OK):

{
    "temperature": 28.5,
    "humidity": 65.2
}

POST /api/incubators/:incubatorId/actuators/:deviceId

Descripción: Envía un comando para cambiar el estado de un actuador.

Request Body:

{
    "value": 75
}

Respuesta (200 OK):

{
    "message": "Actuador 1 (dimmer) actualizado."
}

GET /api/incubators/:incubatorId/history

Descripción: Obtiene los últimos 50 registros de los sensores para construir el gráfico.

Respuesta (200 OK):

[
    { "temperature": 28.4, "humidity": 65.1, "timestamp": "2025-06-16T18:30:00.000Z" },
    { "temperature": 28.5, "humidity": 65.2, "timestamp": "2025-06-16T18:30:30.000Z" }
]

Tecnologías utilizadas 🛠️
Docker & Docker Compose: Para la containerización y orquestación de servicios.

Node.js & Express.js: Para el desarrollo del backend y el emulador de hardware.

MySQL: Como motor de base de datos relacional.

Nginx: Como servidor web de alto rendimiento para el frontend.

TypeScript: Como superset de JavaScript para un desarrollo frontend más robusto.

Materialize.css: Framework CSS basado en Material Design para la UI.

Chart.js: Librería para la creación de gráficos interactivos.


Licencia 📄
Este proyecto está bajo Licencia (MIT).

