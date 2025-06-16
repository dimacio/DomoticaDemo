// =================================================================
// T.P. Final - Desarrollo de Aplicaciones Web
//           Sistema de Control de Incubadora
//                 Emulador de Hardware ESP32
// =================================================================

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// --- ESTADO INICIAL Y SIMULACIÓN ---

// Estado interno del 'hardware'
let incubatorState = {
    temperature: 25.0, // Grados Celsius
    humidity: 60.0,    // Porcentaje
    dimmer: 0,         // Intensidad de la lámpara (0-100)
    heaterOn: false,   // Placa calefactora
    vaporizerOn: false // Vaporizador
};

// Lógica de simulación física (muy simplificada)
setInterval(() => {
    // Simulación de temperatura
    if (incubatorState.heaterOn) {
        incubatorState.temperature += 0.2; // Calienta rápido
    } else {
        incubatorState.temperature -= 0.05; // Enfría lento
    }
    // Efecto de la lámpara
    incubatorState.temperature += (incubatorState.dimmer / 100) * 0.1;

    // Simulación de humedad
    if (incubatorState.vaporizerOn) {
        incubatorState.humidity += 0.5;
    } else {
        incubatorState.humidity -= 0.1;
    }

    // Limitar los valores a rangos realistas
    incubatorState.temperature = Math.max(15, Math.min(45, incubatorState.temperature));
    incubatorState.humidity = Math.max(30, Math.min(95, incubatorState.humidity));

    // Imprimir estado en consola para debugging
    // console.log(`[EMULATOR] Temp: ${incubatorState.temperature.toFixed(2)}°C, Hum: ${incubatorState.humidity.toFixed(2)}%`);

}, 2000); // La simulación se actualiza cada 2 segundos


// --- ENDPOINTS DEL EMULADOR ---

// Endpoint para que el backend lea el estado de los sensores
app.get('/status', (req, res) => {
    res.json({
        temperature: parseFloat(incubatorState.temperature.toFixed(2)),
        humidity: parseFloat(incubatorState.humidity.toFixed(2))
    });
});

// Endpoint para que el backend controle los actuadores
app.post('/actuator', (req, res) => {
    const { name, value } = req.body;
    console.log(`[EMULATOR] Comando recibido: ${name} = ${value}`);

    switch (name) {
        case 'dimmer':
            incubatorState.dimmer = Math.max(0, Math.min(100, Number(value)));
            break;
        case 'heater':
            incubatorState.heaterOn = Boolean(value);
            break;
        case 'vaporizer':
            incubatorState.vaporizerOn = Boolean(value);
            break;
        default:
            return res.status(400).send({ error: 'Actuador no reconocido.' });
    }

    res.status(200).send({ message: 'OK' });
});

// Endpoint para chequear el estado completo del emulador (para debug)
app.get('/full-state', (req, res) => {
    res.json(incubatorState);
});


// --- INICIO DEL SERVIDOR DEL EMULADOR ---
app.listen(port, () => {
    console.log(`ESP32 Emulator listening on http://localhost:${port}`);
});
