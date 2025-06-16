-- =================================================================
-- Script de Inicialización para la Base de Datos 'smart_home'
-- Crea la base de datos, la tabla de dispositivos y la puebla con datos de ejemplo.
-- Este script es ejecutado automáticamente por Docker al iniciar el contenedor de MySQL por primera vez.
-- =================================================================

-- Creación de la base de datos si no existe, y se selecciona para su uso.
CREATE DATABASE IF NOT EXISTS `smart_home`;
USE `smart_home`;

-- Se eliminan las tablas si existen para empezar de cero en cada reconstrucción del volumen.
DROP TABLE IF EXISTS `Devices`;

-- --- Tabla de Dispositivos (Luces, Ventiladores, Persianas, etc.) ---
-- Almacena toda la información de cada dispositivo del hogar.
CREATE TABLE `Devices` (
  `id`          INT(11) NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(64) NOT NULL COMMENT 'Nombre legible para el usuario (Ej: Luz de la Sala)',
  `description` VARCHAR(128) DEFAULT NULL COMMENT 'Descripción adicional del dispositivo',
  `type`        VARCHAR(32) NOT NULL COMMENT 'Tipo de control en la UI (ej: light, fan, blinds, tv)',
  `state`       INT(11) NOT NULL DEFAULT '0' COMMENT 'Estado del dispositivo. Para On/Off: 0=OFF, 1=ON. Para sliders: 0-100.',
  `room`        VARCHAR(64) DEFAULT NULL COMMENT 'Habitación donde se encuentra el dispositivo',
  `icon`        VARCHAR(64) DEFAULT NULL COMMENT 'Nombre del icono a mostrar en la UI (ej: lightbulb, fan)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- --- Inserción de Datos de Ejemplo ---
-- Se puebla la base con un conjunto diverso de dispositivos para demostrar la funcionalidad.
INSERT INTO `Devices` (`id`, `name`, `description`, `type`, `state`, `room`, `icon`) VALUES
(1, 'Luz del Living', 'Luz principal de la sala de estar', 'light', 75, 'Sala de Estar', 'lightbulb'),
(2, 'Ventilador de Techo', 'Ventilador en el dormitorio principal', 'fan', 0, 'Dormitorio', 'fan'),
(3, 'Persianas Oficina', 'Persianas de la ventana de la oficina', 'blinds', 100, 'Oficina', 'blinds'),
(4, 'Luz del Baño', 'Luz sobre el espejo del baño', 'light', 0, 'Baño', 'lightbulb'),
(5, 'Smart TV', 'Televisor Samsung 55" en la sala', 'tv', 1, 'Sala de Estar', 'tv'),
(6, 'Luz Cocina', 'Luz sobre la mesada', 'light', 0, 'Cocina', 'lightbulb');

