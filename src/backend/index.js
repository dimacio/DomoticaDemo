// =================================================================
// Archivo: src/backend/index.js
// Descripción: Punto de entrada principal del backend (CORREGIDO)
// =================================================================

const express = require('express');
const cors = require('cors');
// La ruta ahora es local porque hemos aplanado la estructura.
const deviceController = require('./device.controllers.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ======================= RUTAS DE LA API ============================
app.get('/api/devices', deviceController.getAllDevices);
app.get('/api/devices/:id', deviceController.getDeviceById);
app.post('/api/devices', deviceController.createDevice);
app.put('/api/devices/:id', deviceController.updateDevice);
app.put('/api/devices/:id/state', deviceController.updateDeviceState);
app.delete('/api/devices/:id', deviceController.deleteDevice);


// ======================= MIDDLEWARE DE MANEJO DE ERRORES ==================
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({
        status: 'error',
        message: err.message || 'Ocurrió un error en el servidor.'
    });
});

// ======================= INICIO DEL SERVIDOR ======================
app.listen(port, () => {
    console.log(`Backend server for Smart Home listening at http://localhost:${port}`);
});
