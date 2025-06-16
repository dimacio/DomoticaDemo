// =================================================================
// Archivo: src/backend/mysql-connector.js
// Descripción: Configura y exporta el pool de conexiones a la base de datos MySQL.
// Usar un pool es una buena práctica para manejar conexiones de forma eficiente en Express.
// =================================================================

const mysql = require('mysql');

// Se crea un pool de conexiones utilizando las variables de entorno
// definidas en docker-compose.yml. Esto desacopla la configuración
// del código y la hace más segura y flexible.
const pool = mysql.createPool({
    connectionLimit: 10, // Límite de conexiones simultáneas.
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

// No es necesario llamar a .connect() con un pool. El pool maneja las
// conexiones y las abre/cierra según sea necesario.

module.exports = pool;
