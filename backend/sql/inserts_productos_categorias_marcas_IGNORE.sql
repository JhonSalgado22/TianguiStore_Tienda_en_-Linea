    -- Reinicio de tablas relevantes
    DELETE FROM productos;
    DELETE FROM subcategorias;
    DELETE FROM categorias;
    DELETE FROM marcas;
    ALTER TABLE productos AUTO_INCREMENT = 1;
    ALTER TABLE subcategorias AUTO_INCREMENT = 1;
    ALTER TABLE categorias AUTO_INCREMENT = 1;
    ALTER TABLE marcas AUTO_INCREMENT = 1;

    -- Inserción de marcas
    INSERT INTO marcas (marca_id, nombre_marca) VALUES
    (1, 'Arduino'),
    (2, 'Espressif'),
    (3, 'Texas Instruments'),
    (4, 'Aosong'),
    (5, 'Genérica'),
    (6, 'Winsen');

    -- Inserción de categorías
    INSERT INTO categorias (categoria_id, nombre_categoria) VALUES (1, 'Sensores');
    INSERT INTO categorias (categoria_id, nombre_categoria) VALUES (2, 'Microcontroladores');
    INSERT INTO categorias (categoria_id, nombre_categoria) VALUES (3, 'Placas de Desarrollo');
    INSERT INTO categorias (categoria_id, nombre_categoria) VALUES (4, 'Displays');
    INSERT INTO categorias (categoria_id, nombre_categoria) VALUES (5, 'Componentes Pasivos');
    INSERT INTO categorias (categoria_id, nombre_categoria) VALUES (6, 'Fuentes de Energía');
    -- Inserción de subcategorías
    INSERT INTO subcategorias (subcategoria_id, categoria_id, nombre_subcategoria) VALUES (1, 1, 'Temperatura');
    INSERT INTO subcategorias (subcategoria_id, categoria_id, nombre_subcategoria) VALUES (2, 1, 'Humedad');
    INSERT INTO subcategorias (subcategoria_id, categoria_id, nombre_subcategoria) VALUES (3, 1, 'Movimiento');
    INSERT INTO subcategorias (subcategoria_id, categoria_id, nombre_subcategoria) VALUES (4, 1, 'Luz');
    INSERT INTO subcategorias (subcategoria_id, categoria_id, nombre_subcategoria) VALUES (5, 1, 'Gas');
    INSERT INTO subcategorias (subcategoria_id, categoria_id, nombre_subcategoria) VALUES (8, 3, 'Arduino');
    INSERT INTO subcategorias (subcategoria_id, categoria_id, nombre_subcategoria) VALUES (9, 3, 'ESP32');
    -- Inserción de productos
    INSERT INTO productos (producto_id, nombre, descripcion, categoria_id, subcategoria_id, precio, stock, imagen_url, sku, marca_id) VALUES
    (1, 'Sensor de Temperatura LM35 V1 V1', 'Sensor de Temperatura LM35 para proyectos electrónicos educativos y profesionales.', 1, 1, 18.5, 50, 'https://cdn.electronica.com/lm35.jpg', 'SEN-0001', 3),
    (2, 'Sensor DHT11 V1 V1', 'Sensor DHT11 para proyectos electrónicos educativos y profesionales.', 1, 2, 22.0, 50, 'https://cdn.electronica.com/dht11.jpg', 'SEN-0002', 4),
    (3, 'Sensor PIR HC-SR501 V1 V1', 'Sensor PIR HC-SR501 para proyectos electrónicos educativos y profesionales.', 1, 3, 28.0, 50, 'https://cdn.electronica.com/pir.jpg', 'SEN-0003', 5),
    (4, 'Sensor de Luz LDR V1 V1', 'Sensor de Luz LDR para proyectos electrónicos educativos y profesionales.', 1, 4, 5.5, 50, 'https://cdn.electronica.com/ldr.jpg', 'SEN-0004', 5),
    (5, 'Sensor de Gas MQ-2 V1 V1', 'Sensor de Gas MQ-2 para proyectos electrónicos educativos y profesionales.', 1, 5, 30.0, 50, 'https://cdn.electronica.com/mq2.jpg', 'SEN-0005', 6),
    (6, 'Arduino Uno R3 V1', 'Placa de desarrollo con microcontrolador ATmega328P para prototipos electrónicos.', 3, 8, 185.0, 100, 'https://cdn.electronica.com/arduino_uno.jpg', 'DEV-0006', 1),
    (7, 'ESP32 DevKit V1 V1', 'Placa de desarrollo con WiFi + Bluetooth de doble núcleo.', 3, 9, 112.0, 100, 'https://cdn.electronica.com/esp32.jpg', 'DEV-0007', 2),
    (8, 'Sensor de Temperatura LM35 V1 V2', 'Sensor de Temperatura LM35 para proyectos electrónicos educativos y profesionales.', 1, 1, 18.68, 55, 'https://cdn.electronica.com/lm35.jpg', 'SEN-0008', 3),
    (9, 'Sensor DHT11 V1 V2', 'Sensor DHT11 para proyectos electrónicos educativos y profesionales.', 1, 2, 22.22, 55, 'https://cdn.electronica.com/dht11.jpg', 'SEN-0009', 4),
    (10, 'Sensor PIR HC-SR501 V1 V2', 'Sensor PIR HC-SR501 para proyectos electrónicos educativos y profesionales.', 1, 3, 28.28, 55, 'https://cdn.electronica.com/pir.jpg', 'SEN-0010', 5),
    (11, 'Sensor de Luz LDR V1 V2', 'Sensor de Luz LDR para proyectos electrónicos educativos y profesionales.', 1, 4, 5.55, 55, 'https://cdn.electronica.com/ldr.jpg', 'SEN-0011', 5),
    (12, 'Sensor de Gas MQ-2 V1 V2', 'Sensor de Gas MQ-2 para proyectos electrónicos educativos y profesionales.', 1, 5, 30.3, 55, 'https://cdn.electronica.com/mq2.jpg', 'SEN-0012', 6),
    (13, 'Arduino Uno R3 V2', 'Placa de desarrollo con microcontrolador ATmega328P para prototipos electrónicos.', 3, 8, 186.85, 105, 'https://cdn.electronica.com/arduino_uno.jpg', 'DEV-0013', 1),
    (14, 'ESP32 DevKit V1 V2', 'Placa de desarrollo con WiFi + Bluetooth de doble núcleo.', 3, 9, 113.12, 105, 'https://cdn.electronica.com/esp32.jpg', 'DEV-0014', 2),
    (15, 'Sensor de Temperatura LM35 V1 V3', 'Sensor de Temperatura LM35 para proyectos electrónicos educativos y profesionales.', 1, 1, 18.87, 60, 'https://cdn.electronica.com/lm35.jpg', 'SEN-0015', 3),
    (16, 'Sensor DHT11 V1 V3', 'Sensor DHT11 para proyectos electrónicos educativos y profesionales.', 1, 2, 22.44, 60, 'https://cdn.electronica.com/dht11.jpg', 'SEN-0016', 4),
    (17, 'Sensor PIR HC-SR501 V1 V3', 'Sensor PIR HC-SR501 para proyectos electrónicos educativos y profesionales.', 1, 3, 28.56, 60, 'https://cdn.electronica.com/pir.jpg', 'SEN-0017', 5),
    (18, 'Sensor de Luz LDR V1 V3', 'Sensor de Luz LDR para proyectos electrónicos educativos y profesionales.', 1, 4, 5.61, 60, 'https://cdn.electronica.com/ldr.jpg', 'SEN-0018', 5),
    (19, 'Sensor de Gas MQ-2 V1 V3', 'Sensor de Gas MQ-2 para proyectos electrónicos educativos y profesionales.', 1, 5, 30.6, 60, 'https://cdn.electronica.com/mq2.jpg', 'SEN-0019', 6),
    (20, 'Arduino Uno R3 V3', 'Placa de desarrollo con microcontrolador ATmega328P para prototipos electrónicos.', 3, 8, 188.7, 110, 'https://cdn.electronica.com/arduino_uno.jpg', 'DEV-0020', 1),
    (21, 'ESP32 DevKit V1 V3', 'Placa de desarrollo con WiFi + Bluetooth de doble núcleo.', 3, 9, 114.24, 110, 'https://cdn.electronica.com/esp32.jpg', 'DEV-0021', 2),
    (22, 'Sensor de Temperatura LM35 V1 V4', 'Sensor de Temperatura LM35 para proyectos electrónicos educativos y profesionales.', 1, 1, 19.05, 65, 'https://cdn.electronica.com/lm35.jpg', 'SEN-0022', 3),
    (23, 'Sensor DHT11 V1 V4', 'Sensor DHT11 para proyectos electrónicos educativos y profesionales.', 1, 2, 22.66, 65, 'https://cdn.electronica.com/dht11.jpg', 'SEN-0023', 4),
    (24, 'Sensor PIR HC-SR501 V1 V4', 'Sensor PIR HC-SR501 para proyectos electrónicos educativos y profesionales.', 1, 3, 28.84, 65, 'https://cdn.electronica.com/pir.jpg', 'SEN-0024', 5),
    (25, 'Sensor de Luz LDR V1 V4', 'Sensor de Luz LDR para proyectos electrónicos educativos y profesionales.', 1, 4, 5.67, 65, 'https://cdn.electronica.com/ldr.jpg', 'SEN-0025', 5),
    (26, 'Sensor de Gas MQ-2 V1 V4', 'Sensor de Gas MQ-2 para proyectos electrónicos educativos y profesionales.', 1, 5, 30.9, 65, 'https://cdn.electronica.com/mq2.jpg', 'SEN-0026', 6),
    (27, 'Arduino Uno R3 V4', 'Placa de desarrollo con microcontrolador ATmega328P para prototipos electrónicos.', 3, 8, 190.55, 115, 'https://cdn.electronica.com/arduino_uno.jpg', 'DEV-0027', 1),
    (28, 'ESP32 DevKit V1 V4', 'Placa de desarrollo con WiFi + Bluetooth de doble núcleo.', 3, 9, 115.36, 115, 'https://cdn.electronica.com/esp32.jpg', 'DEV-0028', 2),
    (29, 'Sensor de Temperatura LM35 V1 V5', 'Sensor de Temperatura LM35 para proyectos electrónicos educativos y profesionales.', 1, 1, 19.24, 70, 'https://cdn.electronica.com/lm35.jpg', 'SEN-0029', 3),
    (30, 'Sensor DHT11 V1 V5', 'Sensor DHT11 para proyectos electrónicos educativos y profesionales.', 1, 2, 22.88, 70, 'https://cdn.electronica.com/dht11.jpg', 'SEN-0030', 4),
    (31, 'Sensor PIR HC-SR501 V1 V5', 'Sensor PIR HC-SR501 para proyectos electrónicos educativos y profesionales.', 1, 3, 29.12, 70, 'https://cdn.electronica.com/pir.jpg', 'SEN-0031', 5),
    (32, 'Sensor de Luz LDR V1 V5', 'Sensor de Luz LDR para proyectos electrónicos educativos y profesionales.', 1, 4, 5.72, 70, 'https://cdn.electronica.com/ldr.jpg', 'SEN-0032', 5),
    (33, 'Sensor de Gas MQ-2 V1 V5', 'Sensor de Gas MQ-2 para proyectos electrónicos educativos y profesionales.', 1, 5, 31.2, 70, 'https://cdn.electronica.com/mq2.jpg', 'SEN-0033', 6),
    (34, 'Arduino Uno R3 V5', 'Placa de desarrollo con microcontrolador ATmega328P para prototipos electrónicos.', 3, 8, 192.4, 120, 'https://cdn.electronica.com/arduino_uno.jpg', 'DEV-0034', 1),
    (35, 'ESP32 DevKit V1 V5', 'Placa de desarrollo con WiFi + Bluetooth de doble núcleo.', 3, 9, 116.48, 120, 'https://cdn.electronica.com/esp32.jpg', 'DEV-0035', 2),
    (36, 'Sensor de Temperatura LM35 V1 V6', 'Sensor de Temperatura LM35 para proyectos electrónicos educativos y profesionales.', 1, 1, 19.43, 75, 'https://cdn.electronica.com/lm35.jpg', 'SEN-0036', 3),
    (37, 'Sensor DHT11 V1 V6', 'Sensor DHT11 para proyectos electrónicos educativos y profesionales.', 1, 2, 23.1, 75, 'https://cdn.electronica.com/dht11.jpg', 'SEN-0037', 4),
    (38, 'Sensor PIR HC-SR501 V1 V6', 'Sensor PIR HC-SR501 para proyectos electrónicos educativos y profesionales.', 1, 3, 29.4, 75, 'https://cdn.electronica.com/pir.jpg', 'SEN-0038', 5),
    (39, 'Sensor de Luz LDR V1 V6', 'Sensor de Luz LDR para proyectos electrónicos educativos y profesionales.', 1, 4, 5.78, 75, 'https://cdn.electronica.com/ldr.jpg', 'SEN-0039', 5),
    (40, 'Sensor de Gas MQ-2 V1 V6', 'Sensor de Gas MQ-2 para proyectos electrónicos educativos y profesionales.', 1, 5, 31.5, 75, 'https://cdn.electronica.com/mq2.jpg', 'SEN-0040', 6),
    (41, 'Arduino Uno R3 V6', 'Placa de desarrollo con microcontrolador ATmega328P para prototipos electrónicos.', 3, 8, 194.25, 125, 'https://cdn.electronica.com/arduino_uno.jpg', 'DEV-0041', 1),
    (42, 'ESP32 DevKit V1 V6', 'Placa de desarrollo con WiFi + Bluetooth de doble núcleo.', 3, 9, 117.6, 125, 'https://cdn.electronica.com/esp32.jpg', 'DEV-0042', 2),
    (43, 'Sensor de Temperatura LM35 V1 V7', 'Sensor de Temperatura LM35 para proyectos electrónicos educativos y profesionales.', 1, 1, 19.61, 80, 'https://cdn.electronica.com/lm35.jpg', 'SEN-0043', 3),
    (44, 'Sensor DHT11 V1 V7', 'Sensor DHT11 para proyectos electrónicos educativos y profesionales.', 1, 2, 23.32, 80, 'https://cdn.electronica.com/dht11.jpg', 'SEN-0044', 4),
    (45, 'Sensor PIR HC-SR501 V1 V7', 'Sensor PIR HC-SR501 para proyectos electrónicos educativos y profesionales.', 1, 3, 29.68, 80, 'https://cdn.electronica.com/pir.jpg', 'SEN-0045', 5),
    (46, 'Sensor de Luz LDR V1 V7', 'Sensor de Luz LDR para proyectos electrónicos educativos y profesionales.', 1, 4, 5.83, 80, 'https://cdn.electronica.com/ldr.jpg', 'SEN-0046', 5),
    (47, 'Sensor de Gas MQ-2 V1 V7', 'Sensor de Gas MQ-2 para proyectos electrónicos educativos y profesionales.', 1, 5, 31.8, 80, 'https://cdn.electronica.com/mq2.jpg', 'SEN-0047', 6),
    (48, 'Arduino Uno R3 V7', 'Placa de desarrollo con microcontrolador ATmega328P para prototipos electrónicos.', 3, 8, 196.1, 130, 'https://cdn.electronica.com/arduino_uno.jpg', 'DEV-0048', 1),
    (49, 'ESP32 DevKit V1 V7', 'Placa de desarrollo con WiFi + Bluetooth de doble núcleo.', 3, 9, 118.72, 130, 'https://cdn.electronica.com/esp32.jpg', 'DEV-0049', 2),
    (50, 'Sensor de Temperatura LM35 V1 V8', 'Sensor de Temperatura LM35 para proyectos electrónicos educativos y profesionales.', 1, 1, 19.8, 85, 'https://cdn.electronica.com/lm35.jpg', 'SEN-0050', 3),
    (51, 'Sensor DHT11 V1 V8', 'Sensor DHT11 para proyectos electrónicos educativos y profesionales.', 1, 2, 23.54, 85, 'https://cdn.electronica.com/dht11.jpg', 'SEN-0051', 4),
    (52, 'Sensor PIR HC-SR501 V1 V8', 'Sensor PIR HC-SR501 para proyectos electrónicos educativos y profesionales.', 1, 3, 29.96, 85, 'https://cdn.electronica.com/pir.jpg', 'SEN-0052', 5),
    (53, 'Sensor de Luz LDR V1 V8', 'Sensor de Luz LDR para proyectos electrónicos educativos y profesionales.', 1, 4, 5.89, 85, 'https://cdn.electronica.com/ldr.jpg', 'SEN-0053', 5),
    (54, 'Sensor de Gas MQ-2 V1 V8', 'Sensor de Gas MQ-2 para proyectos electrónicos educativos y profesionales.', 1, 5, 32.1, 85, 'https://cdn.electronica.com/mq2.jpg', 'SEN-0054', 6),
    (55, 'Arduino Uno R3 V8', 'Placa de desarrollo con microcontrolador ATmega328P para prototipos electrónicos.', 3, 8, 197.95, 135, 'https://cdn.electronica.com/arduino_uno.jpg', 'DEV-0055', 1),
    (56, 'ESP32 DevKit V1 V8', 'Placa de desarrollo con WiFi + Bluetooth de doble núcleo.', 3, 9, 119.84, 135, 'https://cdn.electronica.com/esp32.jpg', 'DEV-0056', 2),
    (57, 'Sensor de Temperatura LM35 V1 V9', 'Sensor de Temperatura LM35 para proyectos electrónicos educativos y profesionales.', 1, 1, 19.98, 90, 'https://cdn.electronica.com/lm35.jpg', 'SEN-0057', 3),
    (58, 'Sensor DHT11 V1 V9', 'Sensor DHT11 para proyectos electrónicos educativos y profesionales.', 1, 2, 23.76, 90, 'https://cdn.electronica.com/dht11.jpg', 'SEN-0058', 4),
    (59, 'Sensor PIR HC-SR501 V1 V9', 'Sensor PIR HC-SR501 para proyectos electrónicos educativos y profesionales.', 1, 3, 30.24, 90, 'https://cdn.electronica.com/pir.jpg', 'SEN-0059', 5),
    (60, 'Sensor de Luz LDR V1 V9', 'Sensor de Luz LDR para proyectos electrónicos educativos y profesionales.', 1, 4, 5.94, 90, 'https://cdn.electronica.com/ldr.jpg', 'SEN-0060', 5),
    (61, 'Sensor de Gas MQ-2 V1 V9', 'Sensor de Gas MQ-2 para proyectos electrónicos educativos y profesionales.', 1, 5, 32.4, 90, 'https://cdn.electronica.com/mq2.jpg', 'SEN-0061', 6),
    (62, 'Arduino Uno R3 V9', 'Placa de desarrollo con microcontrolador ATmega328P para prototipos electrónicos.', 3, 8, 199.8, 140, 'https://cdn.electronica.com/arduino_uno.jpg', 'DEV-0062', 1),
    (63, 'ESP32 DevKit V1 V9', 'Placa de desarrollo con WiFi + Bluetooth de doble núcleo.', 3, 9, 120.96, 140, 'https://cdn.electronica.com/esp32.jpg', 'DEV-0063', 2),
    (64, 'Sensor de Temperatura LM35 V1 V10', 'Sensor de Temperatura LM35 para proyectos electrónicos educativos y profesionales.', 1, 1, 20.17, 95, 'https://cdn.electronica.com/lm35.jpg', 'SEN-0064', 3),
    (65, 'Sensor DHT11 V1 V10', 'Sensor DHT11 para proyectos electrónicos educativos y profesionales.', 1, 2, 23.98, 95, 'https://cdn.electronica.com/dht11.jpg', 'SEN-0065', 4),
    (66, 'Sensor PIR HC-SR501 V1 V10', 'Sensor PIR HC-SR501 para proyectos electrónicos educativos y profesionales.', 1, 3, 30.52, 95, 'https://cdn.electronica.com/pir.jpg', 'SEN-0066', 5),
    (67, 'Sensor de Luz LDR V1 V10', 'Sensor de Luz LDR para proyectos electrónicos educativos y profesionales.', 1, 4, 6.0, 95, 'https://cdn.electronica.com/ldr.jpg', 'SEN-0067', 5),
    (68, 'Sensor de Gas MQ-2 V1 V10', 'Sensor de Gas MQ-2 para proyectos electrónicos educativos y profesionales.', 1, 5, 32.7, 95, 'https://cdn.electronica.com/mq2.jpg', 'SEN-0068', 6),
    (69, 'Arduino Uno R3 V10', 'Placa de desarrollo con microcontrolador ATmega328P para prototipos electrónicos.', 3, 8, 201.65, 145, 'https://cdn.electronica.com/arduino_uno.jpg', 'DEV-0069', 1),
    (70, 'ESP32 DevKit V1 V10', 'Placa de desarrollo con WiFi + Bluetooth de doble núcleo.', 3, 9, 122.08, 145, 'https://cdn.electronica.com/esp32.jpg', 'DEV-0070', 2);