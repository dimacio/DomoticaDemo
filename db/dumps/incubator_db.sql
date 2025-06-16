-- Creación de la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `smart_garden`;
USE `smart_garden`;

-- Se eliminan las tablas en orden para evitar problemas de foreign key
DROP TABLE IF EXISTS `SensorLogs`;
DROP TABLE IF EXISTS `Devices`;
DROP TABLE IF EXISTS `Incubators`;

-- Tabla para identificar las incubadoras
CREATE TABLE `Incubators` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `location` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Dispositivos (Sensores y Actuadores)
CREATE TABLE `Devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `incubator_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` varchar(128) NOT NULL,
  `category` ENUM('actuator', 'sensor') NOT NULL,
  `type` varchar(32) NOT NULL COMMENT 'Ej: dimmer, heater, dht22',
  `state` int(11) NOT NULL DEFAULT '0' COMMENT 'Para actuadores: 0:OFF, 1:ON. Para dimmer: 0-100.',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`incubator_id`) REFERENCES `Incubators`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para logs de sensores
CREATE TABLE `SensorLogs` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) NOT NULL,
  `temperature` float NOT NULL,
  `humidity` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  FOREIGN KEY (`device_id`) REFERENCES `Devices`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserción de datos de ejemplo
-- 1. Crear una incubadora
INSERT INTO `Incubators` (`id`, `name`, `location`) VALUES
(1, 'Incubadora Principal', 'Laboratorio A');

-- 2. Registrar los dispositivos para esa incubadora
-- Actuadores
INSERT INTO `Devices` (`id`, `incubator_id`, `name`, `description`, `category`, `type`, `state`) VALUES
(1, 1, 'Lámpara Infrarroja', 'Lámpara calefactora con dimmer', 'actuator', 'dimmer', 0),
(2, 1, 'Placa Calefactora', 'Calefactor de base ON/OFF', 'actuator', 'heater', 0),
(3, 1, 'Vaporizador', 'Generador de humedad ultrasónico', 'actuator', 'vaporizer', 0);

-- Sensor
INSERT INTO `Devices` (`id`, `incubator_id`, `name`, `description`, `category`, `type`) VALUES
(4, 1, 'Sensor DHT22', 'Sensor de Temperatura y Humedad', 'sensor', 'dht22');
