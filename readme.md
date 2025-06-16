# Sistema de Control de Hogar Inteligente (Smart Home)

¡Bienvenido al proyecto final de Desarrollo de Aplicaciones Web! Esta es una aplicación web full-stack, completamente funcional y containerizada con Docker, que simula un panel de control para un hogar inteligente.

![Panel de control del hogar inteligente](https://placehold.co/800x400/111827/a7a7a7?text=Panel+de+Control+del+Hogar)

## 🌟 Características Principales

* **Panel de Control Interactivo:** Visualiza y controla todos tus dispositivos inteligentes desde una interfaz web moderna y reactiva.
* **Gestión Completa de Dispositivos (CRUD):**
    * **Crear:** Añade nuevos dispositivos a tu hogar a través de un formulario intuitivo.
    * **Leer:** Observa el estado en tiempo real de todos los dispositivos.
    * **Actualizar:** Edita el nombre, la descripción o el tipo de cualquier dispositivo.
    * **Eliminar:** Quita dispositivos que ya no necesites.
* **Controles Avanzados:** Soporte para interruptores (On/Off) y controles de intensidad (sliders para luces y persianas).
* **Arquitectura de Microservicios:** La aplicación está desacoplada en tres servicios independientes:
    1.  **Frontend:** Una Single Page Application (SPA) servida por Nginx.
    2.  **Backend:** Una API RESTful en Node.js y Express que gestiona la lógica de negocio.
    3.  **Base de Datos:** Un servicio MySQL para la persistencia de datos.
* **100% Dockerizado:** Todo el sistema se levanta con un solo comando, facilitando el desarrollo y el despliegue.

## 🛠️ Tecnologías Utilizadas

* **Docker & Docker Compose:** Para la containerización y orquestación de servicios.
* **Backend:** Node.js, Express.js.
* **Frontend:** HTML5, Tailwind CSS, JavaScript (Vanilla).
* **Base de Datos:** MySQL.
* **Servidor Web:** Nginx (actuando como servidor de archivos estáticos y reverse proxy).

## 🚀 Cómo Empezar

Para poner en marcha la aplicación, solo necesitas tener instalados Docker y Docker Compose en tu sistema.

### 1. Prerrequisitos

* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

### 2. Instalación y Ejecución

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_DIRECTORIO>
    ```

2.  **Levanta la aplicación:**
    Ejecuta el siguiente comando desde la raíz del proyecto. Este comando construirá las imágenes de Docker necesarias, creará los contenedores y los pondrá en funcionamiento.

    ```bash
    docker-compose up --build
    ```

    La primera vez que se ejecute, Docker descargará la imagen de MySQL y construirá las imágenes del frontend y backend, lo cual puede tardar unos minutos.

3.  **¡Accede a la aplicación!**
    Una vez que todos los contenedores estén corriendo, abre tu navegador y ve a:
    **[http://localhost:8080](http://localhost:8080)**

    Deberías ver el panel de control del hogar inteligente con los dispositivos de ejemplo.

## 🔧 Estructura del Proyecto


.
├── db
│   └── init.sql              # Script de inicialización de la DB
├── src
│   ├── backend
│   │   ├── controllers         # Controladores de la API
│   │   ├── services            # Lógica de negocio
│   │   ├── Dockerfile
│   │   ├── index.js            # Punto de entrada y rutas
│   │   └── package.json
│   └── frontend
│       ├── Dockerfile
│       ├── index.html          # Interfaz de usuario
│       └── nginx.conf          # Configuración de Nginx
├── docker-compose.yml          # Orquestación de servicios
└── README.md                   # Este archivo


## 📖 Documentación de la API

El backend expone una API RESTful para ser consumida por el frontend. Todas las rutas están prefijadas con `/api`.

| Método | Ruta | Descripción | Body (Ejemplo) |
| :--- | :--- | :--- | :--- |
| `GET` | `/devices` | Obtiene la lista de todos los dispositivos. | N/A |
| `POST` | `/devices` | Agrega un nuevo dispositivo. | `{"name": "Luz", "description": "Luz de techo", ...}` |
| `PUT` | `/devices/:id` | Actualiza los detalles de un dispositivo. | `{"name": "Luz de Mesa", "room": "Oficina"}` |
| `PUT` | `/devices/:id/state` | Actualiza solo el estado de un dispositivo. | `{"state": 75}` |
| `DELETE` | `/devices/:id` | Elimina un dispositivo. | N/A |

## 📄 Licencia

Este proyecto está bajo la Licencia (MIT).
