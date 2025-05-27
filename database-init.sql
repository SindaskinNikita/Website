-- Создание таблицы employees (сотрудники)
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы facilities (объекты)
CREATE TABLE IF NOT EXISTS facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    cost NUMERIC(10, 2) DEFAULT 0
);

-- Добавление тестовых данных в таблицу employees
INSERT INTO employees (name, position, email, phone)
VALUES 
    ('Иванов Иван Иванович', 'Главный инженер', 'ivanov@example.com', '+7 (900) 123-45-67'),
    ('Петрова Елена Сергеевна', 'Менеджер проекта', 'petrova@example.com', '+7 (900) 234-56-78'),
    ('Сидоров Алексей Петрович', 'Технический специалист', 'sidorov@example.com', '+7 (900) 345-67-89'),
    ('Козлова Анна Михайловна', 'Бухгалтер', 'kozlova@example.com', '+7 (900) 456-78-90'),
    ('Новиков Дмитрий Александрович', 'Системный администратор', 'novikov@example.com', '+7 (900) 567-89-01');

-- Добавление тестовых данных в таблицу facilities
INSERT INTO facilities (name, address, type, status, cost)
VALUES 
    ('Офис на Ленина', 'ул. Ленина, 10', 'Офис', 'active', 50000.00),
    ('Складское помещение', 'ул. Промышленная, 2', 'Склад', 'active', 35000.00),
    ('Производственный цех', 'ул. Заводская, 5', 'Производство', 'ready', 120000.00),
    ('Торговый центр "Меркурий"', 'пр. Победы, 25', 'Торговля', 'ready_to_rent', 200000.00),
    ('Офис в бизнес-центре', 'ул. Гагарина, 15', 'Офис', 'rented', 80000.00); 