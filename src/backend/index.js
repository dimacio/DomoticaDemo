// =================================================================
// T.P. Final - Desarrollo de Aplicaciones Web
//           Sistema de Control de Incubadora
//                    Backend Principal (v2)
// =================================================================
const express = require('express');
const app = express();
const port = 3000;
const pool = require('./mysql-connector');
const cors = require('cors');
const axios = require('axios');

app.use(cors());
app.use(express.json());

const ESP32_EMULATOR_URL = process.env.ESP32_EMULATOR_URL || 'http://localhost:3001';

// ======================= RUTAS DE API (v2) ============================

// --- Rutas para Incubadoras ---

// Obtener todas las incubadoras
app.get('/api/incubators', (req, res) => {
    pool.query('SELECT * FROM Incubators', (err, results) => {
        if (err) return res.status(500).send('Error en el servidor');
        res.json(results);
    });
});

// Obtener todos los dispositivos de una incubadora (sensores y actuadores)
app.get('/api/incubators/:incubatorId/devices', (req, res) => {
    const { incubatorId } = req.params;
    pool.query('SELECT * FROM Devices WHERE incubator_id = ?', [incubatorId], (err, results) => {
        if (err) return res.status(500).send('Error en el servidor');
        res.json(results);
    });
});

// Obtener la lectura actual de los sensores de una incubadora
app.get('/api/incubators/:incubatorId/sensors/reading', async (req, res) => {
    // En un sistema real, incubatorId se usaría para dirigir la petición al hardware correcto.
    // Aquí, siempre llamamos al único emulador disponible.
    try {
        const response = await axios.get(`${ESP32_EMULATOR_URL}/status`);
        res.json(response.data);
    } catch (error) {
        console.error("Error al comunicar con el emulador ESP32:", error.message);
        res.status(500).json({ error: 'No se pudo obtener el estado del emulador.' });
    }
});

// Controlar un actuador específico de una incubadora
app.post('/api/incubators/:incubatorId/actuators/:deviceId', async (req, res) => {
    const { deviceId } = req.params;
    const { value } = req.body;

    if (value === undefined) {
        return res.status(400).send('El parámetro "value" es requerido.');
    }

    // 1. Obtener el tipo de actuador desde la DB para enviar el comando correcto al emulador
    pool.query('SELECT type FROM Devices WHERE id = ? AND category = "actuator"', [deviceId], async (err, results) => {
        if (err) return res.status(500).send('Error en la base de datos');
        if (results.length === 0) return res.status(404).send('Actuador no encontrado');

        const actuatorType = results[0].type; // 'dimmer', 'heater', etc.

        try {
            // 2. Enviar el comando al emulador
            await axios.post(`${ESP32_EMULATOR_URL}/actuator`, { name: actuatorType, value });

            // 3. Actualizar el estado en la base de datos
            pool.query('UPDATE Devices SET state = ? WHERE id = ?', [value, deviceId], (err, updateResult) => {
                if (err) {
                    console.error("Error actualizando el estado del actuador en DB:", err);
                    // No bloquea la respuesta, pero loguea el fallo.
                }
            });

            res.status(200).send({ message: `Actuador ${deviceId} (${actuatorType}) actualizado.` });
        } catch (error) {
            console.error(`Error controlando el actuador ${actuatorType}:`, error.message);
            res.status(500).json({ error: 'No se pudo controlar el actuador.' });
        }
    });
});

// Obtener historial de sensores de una incubadora
app.get('/api/incubators/:incubatorId/history', (req, res) => {
    // Para simplificar, obtenemos el id del sensor de la incubadora 1
    const sensorDeviceId = 4; // Hardcodeado para el MVP
    const query = 'SELECT temperature, humidity, timestamp FROM SensorLogs WHERE device_id = ? ORDER BY timestamp DESC LIMIT 50';
    pool.query(query, [sensorDeviceId], (err, results) => {
        if (err) return res.status(500).send('Error en el servidor');
        res.json(results.reverse());
    });
});

// --- Guardado periódico de datos de sensores ---
const logSensorData = async () => {
    try {
        const sensorDeviceId = 4; // ID del sensor DHT22
        const response = await axios.get(`${ESP32_EMULATOR_URL}/status`);
        const { temperature, humidity } = response.data;
        
        const query = 'INSERT INTO SensorLogs (device_id, temperature, humidity) VALUES (?, ?, ?)';
        pool.query(query, [sensorDeviceId, temperature, humidity], (err, results) => {
            if (err) {
                console.error("Error al guardar log de sensor en DB:", err);
            } else {
                console.log("Log de sensor guardado en DB:", { temperature, humidity });
            }
        });
    } catch (error) {
        console.error("Error en el logging periódico de sensores:", error.message);
    }
};

setInterval(logSensorData, 30000);

// ======================= INICIO DEL SERVIDOR ======================
app.listen(port, () => {
    console.log(`Backend server (v2) listening on http://localhost:${port}`);
});
