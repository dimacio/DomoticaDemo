// =================================================================
// Archivo: src/backend/device.service.js
// Descripción: Capa de servicio que contiene la lógica de negocio
// e interactúa con la base de datos. (CORREGIDO)
// =================================================================

const util = require('util');
const pool = require('./mysql-connector');

// Promisify pool.query para poder usar async/await en lugar de callbacks.
const pQuery = util.promisify(pool.query).bind(pool);

const deviceService = {
    /**
     * Devuelve todos los dispositivos de la base de datos.
     */
    getAllDevices: async () => {
        const [rows] = await pQuery('SELECT * FROM Devices');
        return rows;
    },

    /**
     * Devuelve un dispositivo específico por su ID.
     */
    getDeviceById: async (deviceId) => {
        const [rows] = await pQuery('SELECT * FROM Devices WHERE id = ?', [deviceId]);
        return rows[0];
    },

    /**
     * Crea un nuevo dispositivo en la base de datos.
     */
    createDevice: async (deviceData) => {
        const { name, description, type, room, icon } = deviceData;
        const result = await pQuery(
            'INSERT INTO Devices (name, description, type, room, icon, state) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, type || 'default', room, icon || 'default', 0] // Estado inicial 0 (apagado)
        );
        return { id: result.insertId, ...deviceData, state: 0 };
    },

    /**
     * Actualiza los datos de un dispositivo existente.
     */
    updateDevice: async (deviceId, deviceData) => {
        const { name, description, type, room, icon } = deviceData;
        await pQuery(
            'UPDATE Devices SET name = ?, description = ?, type = ?, room = ?, icon = ? WHERE id = ?',
            [name, description, type, room, icon, deviceId]
        );
        const [updatedDevice] = await pQuery('SELECT * FROM Devices WHERE id = ?', [deviceId]);
        return updatedDevice[0];
    },

    /**
     * Actualiza solo el estado de un dispositivo.
     */
    updateDeviceState: async (deviceId, state) => {
        await pQuery(
            'UPDATE Devices SET state = ? WHERE id = ?',
            [state, deviceId]
        );
        return { id: deviceId, state: state };
    },

    /**
     * Elimina un dispositivo de la base de datos.
     */
    deleteDevice: async (deviceId) => {
        await pQuery('DELETE FROM Devices WHERE id = ?', [deviceId]);
        return { message: 'Dispositivo eliminado' };
    },
};

module.exports = deviceService;
