-- Наполнение таблиц тестовыми данными

-- Очистка таблиц перед вставкой
DROP TABLE IF EXISTS feedback_responses, feedback, reviews, calculations, reports, news, equipment, facilities, employees, users CASCADE;

-- Создание таблиц заново
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'EMPLOYEE', 'GUEST')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Офис', 'Склад', 'Производство', 'Торговля')),
    cost DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'ready', 'ready_to_rent', 'rented')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    facility_id INTEGER REFERENCES facilities(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive')),
    last_maintenance TIMESTAMP,
    next_maintenance TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление пользователей
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YIpjR5qi', 'ADMIN'),
('manager', 'manager@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YIpjR5qi', 'MANAGER'),
('employee1', 'employee1@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YIpjR5qi', 'EMPLOYEE'),
('employee2', 'employee2@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YIpjR5qi', 'EMPLOYEE'),
('guest', 'guest@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YIpjR5qi', 'GUEST');

-- Добавление сотрудников
INSERT INTO employees (name, position, email, phone) VALUES
('Иванов Иван Иванович', 'Генеральный директор', 'ivanov@example.com', '+7 (999) 123-45-67'),
('Петров Петр Петрович', 'Финансовый директор', 'petrov@example.com', '+7 (999) 234-56-78'),
('Сидорова Анна Владимировна', 'HR-менеджер', 'sidorova@example.com', '+7 (999) 345-67-89'),
('Козлов Дмитрий Сергеевич', 'Технический директор', 'kozlov@example.com', '+7 (999) 456-78-90'),
('Морозова Елена Александровна', 'Бухгалтер', 'morozova@example.com', '+7 (999) 567-89-01'),
('Новиков Артем Игоревич', 'Системный администратор', 'novikov@example.com', '+7 (999) 678-90-12'),
('Федорова Мария Павловна', 'Менеджер по продажам', 'fedorova@example.com', '+7 (999) 789-01-23'),
('Волков Андрей Николаевич', 'Инженер', 'volkov@example.com', '+7 (999) 890-12-34'),
('Соколова Ольга Дмитриевна', 'Юрист', 'sokolova@example.com', '+7 (999) 901-23-45'),
('Михайлов Сергей Александрович', 'Менеджер проектов', 'mikhailov@example.com', '+7 (999) 012-34-56');

-- Добавление объектов
INSERT INTO facilities (name, address, type, cost, status) VALUES
('Бизнес-центр "Горизонт"', 'ул. Ленина, 1', 'Офис', 15000000.00, 'active'),
('Складской комплекс "Логистик"', 'ул. Складская, 10', 'Склад', 25000000.00, 'active'),
('Производственный цех №1', 'ул. Заводская, 5', 'Производство', 45000000.00, 'active'),
('Торговый центр "Меркурий"', 'пр. Победы, 15', 'Торговля', 85000000.00, 'active'),
('Офисное здание "Престиж"', 'ул. Центральная, 8', 'Офис', 35000000.00, 'ready_to_rent'),
('Складской терминал "Восток"', 'ул. Промышленная, 20', 'Склад', 28000000.00, 'active'),
('Производственная база', 'ул. Индустриальная, 12', 'Производство', 55000000.00, 'inactive'),
('Торговый комплекс "Планета"', 'пр. Гагарина, 25', 'Торговля', 95000000.00, 'rented');

-- Добавление оборудования
INSERT INTO equipment (name, type, facility_id, status, last_maintenance, next_maintenance) VALUES
('Кондиционер FS-2500', 'Климатическое оборудование', 1, 'active', NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months'),
('Котел Viessmann', 'Отопительное оборудование', 2, 'active', NOW() - INTERVAL '2 months', NOW() + INTERVAL '1 month'),
('Компрессор AirFlow XL', 'Промышленное оборудование', 3, 'inactive', NOW() - INTERVAL '3 months', NOW()),
('Система видеонаблюдения SecureView', 'Охранное оборудование', 4, 'active', NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months'),
('Лифт OTIS Gen2', 'Подъемное оборудование', 1, 'active', NOW() - INTERVAL '2 weeks', NOW() + INTERVAL '3 months'),
('Система пожаротушения FireStop', 'Противопожарное оборудование', 2, 'active', NOW() - INTERVAL '1 month', NOW() + INTERVAL '5 months'),
('Станок ЧПУ MasterCut', 'Производственное оборудование', 3, 'active', NOW() - INTERVAL '2 months', NOW() + INTERVAL '1 month'),
('Холодильная установка FrostMaster', 'Холодильное оборудование', 4, 'active', NOW() - INTERVAL '3 months', NOW() + INTERVAL '1 month'),
('Система контроля доступа SecurePass', 'Охранное оборудование', 5, 'active', NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months'),
('Вентиляционная система AirMaster', 'Климатическое оборудование', 6, 'active', NOW() - INTERVAL '2 weeks', NOW() + INTERVAL '3 months');

-- Добавление новостей
INSERT INTO news (title, content, author_id, date) VALUES
('Открытие нового офиса', 'Мы рады сообщить об открытии нового офиса в центре города', 1, NOW() - INTERVAL '5 days'),
('Модернизация оборудования', 'Завершена модернизация производственного оборудования', 1, NOW() - INTERVAL '3 days'),
('Корпоративное обучение', 'Старт новой программы корпоративного обучения', 2, NOW() - INTERVAL '1 day'),
('Расширение складских помещений', 'Начато строительство нового складского комплекса', 1, NOW() - INTERVAL '7 days'),
('Внедрение новой CRM системы', 'Успешно завершено внедрение современной CRM системы', 2, NOW() - INTERVAL '2 days'),
('Экологическая инициатива', 'Запуск программы по сокращению выбросов CO2', 1, NOW() - INTERVAL '4 days'),
('Новое партнерство', 'Подписано соглашение о стратегическом партнерстве', 2, NOW() - INTERVAL '6 days'),
('Достижение ISO сертификации', 'Компания получила сертификат ISO 9001:2015', 1, NOW() - INTERVAL '8 days');

-- Проверка наполнения таблиц
SELECT 
    'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'facilities', COUNT(*) FROM facilities
UNION ALL
SELECT 'equipment', COUNT(*) FROM equipment
UNION ALL
SELECT 'news', COUNT(*) FROM news
ORDER BY table_name; 