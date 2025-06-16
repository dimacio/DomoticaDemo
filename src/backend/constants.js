/*
=================================================================
File: src/backend/constants.js
=================================================================
*/

// A central place for application-wide constants.
const PROTECTED_DEVICE_ID = 4; // Main sensor cannot be deleted
const ESP32_EMULATOR_URL = process.env.ESP32_EMULATOR_URL || 'http://localhost:3001';

module.exports = {
    PROTECTED_DEVICE_ID,
    ESP32_EMULATOR_URL
};
