// =================================================================
// Archivo: src/backend/device.controllers.js
// Descripción: Controladores para manejar las peticiones HTTP (CORREGIDO)
// =================================================================

// La ruta ahora es local porque hemos aplanado la estructura.
const deviceService = require('./device.service.js');

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const deviceController = {
    getAllDevices: asyncHandler(async (req, res) => {
        const devices = await deviceService.getAllDevices();
        res.status(200).json(devices);
    }),

    getDeviceById: asyncHandler(async (req, res) => {
        const device = await deviceService.getDeviceById(req.params.id);
        if (device) {
            res.status(200).json(device);
        } else {
            res.status(404).json({ message: 'Dispositivo no encontrado' });
        }
    }),

    createDevice: asyncHandler(async (req, res) => {
        const newDevice = await deviceService.createDevice(req.body);
        res.status(201).json(newDevice);
    }),

    updateDevice: asyncHandler(async (req, res) => {
        const updatedDevice = await deviceService.updateDevice(req.params.id, req.body);
        res.status(200).json(updatedDevice);
    }),

    updateDeviceState: asyncHandler(async (req, res) => {
        const { state } = req.body;
        if (typeof state === 'undefined') {
            return res.status(400).json({ message: 'El valor del estado es requerido.' });
        }
        const updatedDevice = await deviceService.updateDeviceState(req.params.id, state);
        res.status(200).json(updatedDevice);
    }),

    deleteDevice: asyncHandler(async (req, res) => {
        await deviceService.deleteDevice(req.params.id);
        res.status(204).send();
    }),
};

module.exports = deviceController;
