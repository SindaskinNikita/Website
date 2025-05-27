-- Создание таблиц для всех разделов админ-панели

-- Таблица объектов (facilities) - уже существует
-- Добавляем недостающие столбцы если их нет
ALTER TABLE facility ADD COLUMN IF NOT EXISTS cost DECIMAL(15,2) DEFAULT 0;
ALTER TABLE facility ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Таблица оборудования (equipment) - уже существует
-- Добавляем недостающие столбцы если их нет
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'working';
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS cost DECIMAL(15,2) DEFAULT 0;

-- Таблица новостей (news)
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица отчетов (reports)
CREATE TABLE IF NOT EXISTS report (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    content TEXT,
    author VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица расчетов (calculations)
CREATE TABLE IF NOT EXISTS calculation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    result DECIMAL(15,2),
    parameters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица отзывов (reviews)
CREATE TABLE IF NOT EXISTS review (
    id SERIAL PRIMARY KEY,
    author VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица обратной связи (feedback)
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица настроек (settings)
CREATE TABLE IF NOT EXISTS setting (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка тестовых данных для объектов
INSERT INTO facility (name, address, type, status, cost) VALUES
('Производственный цех №1', 'ул. Промышленная, 15', 'Производство', 'active', 2500000.00),
('Склад готовой продукции', 'ул. Складская, 8', 'Склад', 'active', 800000.00),
('Административное здание', 'пр. Центральный, 45', 'Офис', 'active', 1200000.00),
('Цех металлообработки', 'ул. Заводская, 22', 'Производство', 'maintenance', 3200000.00),
('Лаборатория контроля качества', 'ул. Научная, 12', 'Лаборатория', 'active', 950000.00)
ON CONFLICT DO NOTHING;

-- Обновляем существующие записи оборудования и добавляем новые
UPDATE equipment SET 
    location = CASE 
        WHEN id = 1 THEN 'Цех №1'
        WHEN id = 2 THEN 'Цех №1'
        WHEN id = 3 THEN 'Цех металлообработки'
        ELSE 'Склад'
    END,
    status = 'working',
    cost = CASE 
        WHEN id = 1 THEN 450000.00
        WHEN id = 2 THEN 680000.00
        WHEN id = 3 THEN 125000.00
        ELSE 180000.00
    END
WHERE id IN (1, 2, 3, 4);

-- Добавляем новые записи оборудования если их нет
INSERT INTO equipment (name, type, location, status, purchase_date, cost) VALUES
('Компрессор КМ-50', 'Компрессор', 'Цех №1', 'working', '2023-03-12', 180000.00),
('Измерительный комплекс ИК-100', 'Измерительное', 'Лаборатория', 'working', '2023-04-18', 320000.00)
ON CONFLICT DO NOTHING;

-- Вставка тестовых данных для новостей
INSERT INTO news (title, content, author, status) VALUES
('Запуск нового производственного цеха', 'Сегодня состоялось торжественное открытие нового производственного цеха. Это позволит увеличить объемы производства на 30%.', 'Администрация', 'published'),
('Обновление системы контроля качества', 'Внедрена новая автоматизированная система контроля качества продукции, что повысит точность измерений.', 'Отдел качества', 'published'),
('Техническое обслуживание оборудования', 'С 15 по 20 числа будет проводиться плановое техническое обслуживание основного оборудования.', 'Технический отдел', 'published'),
('Повышение квалификации сотрудников', 'Организованы курсы повышения квалификации для операторов станков с ЧПУ.', 'HR отдел', 'draft')
ON CONFLICT DO NOTHING;

-- Вставка тестовых данных для отчетов
INSERT INTO report (title, type, content, author, status) VALUES
('Отчет о производительности за месяц', 'Производство', 'Анализ показателей производительности за текущий месяц показал рост на 15%.', 'Менеджер производства', 'completed'),
('Финансовый отчет Q1', 'Финансы', 'Квартальный финансовый отчет с анализом доходов и расходов.', 'Главный бухгалтер', 'completed'),
('Отчет по безопасности труда', 'Безопасность', 'Анализ соблюдения требований безопасности на производстве.', 'Инженер по ТБ', 'draft'),
('Отчет по качеству продукции', 'Качество', 'Статистика брака и мероприятия по улучшению качества.', 'Начальник ОТК', 'in_progress')
ON CONFLICT DO NOTHING;

-- Вставка тестовых данных для расчетов
INSERT INTO calculation (name, type, description, result, parameters) VALUES
('Расчет себестоимости продукции', 'Экономический', 'Калькуляция себестоимости единицы продукции', 1250.50, '{"materials": 800, "labor": 300, "overhead": 150.50}'),
('Расчет нагрузки на фундамент', 'Технический', 'Расчет допустимой нагрузки на фундамент цеха', 25000.00, '{"area": 100, "load_per_m2": 250}'),
('Энергопотребление за месяц', 'Энергетический', 'Расчет общего энергопотребления предприятия', 45680.75, '{"power": 150, "hours": 720, "rate": 4.2}'),
('Производительность линии', 'Производственный', 'Расчет теоретической производительности', 480.00, '{"cycle_time": 5, "efficiency": 0.8}')
ON CONFLICT DO NOTHING;

-- Вставка тестовых данных для отзывов
INSERT INTO review (author, email, rating, content, status, response) VALUES
('Иван Петров', 'petrov@email.com', 5, 'Отличное качество продукции, быстрая доставка!', 'approved', 'Спасибо за положительный отзыв!'),
('Мария Сидорова', 'sidorova@email.com', 4, 'Хорошее обслуживание, но хотелось бы больше вариантов оплаты.', 'approved', 'Работаем над расширением способов оплаты.'),
('Алексей Козлов', 'kozlov@email.com', 3, 'Продукция неплохая, но были задержки с доставкой.', 'pending', NULL),
('Елена Новикова', 'novikova@email.com', 5, 'Превосходное качество! Рекомендую всем!', 'approved', 'Благодарим за рекомендацию!')
ON CONFLICT DO NOTHING;

-- Вставка тестовых данных для обратной связи
INSERT INTO feedback (name, email, subject, message, status, priority) VALUES
('Дмитрий Волков', 'volkov@email.com', 'Вопрос по гарантии', 'Подскажите, какая гарантия на ваше оборудование?', 'new', 'medium'),
('Ольга Морозова', 'morozova@email.com', 'Предложение о сотрудничестве', 'Хотели бы обсудить возможность долгосрочного сотрудничества.', 'in_progress', 'high'),
('Сергей Лебедев', 'lebedev@email.com', 'Жалоба на качество', 'Получили бракованную деталь, требуем замены.', 'resolved', 'high'),
('Анна Белова', 'belova@email.com', 'Запрос технической документации', 'Нужна техническая документация на модель XZ-100.', 'new', 'low')
ON CONFLICT DO NOTHING;

-- Вставка тестовых данных для настроек
INSERT INTO setting (key, value, category, description, type) VALUES
('company_name', 'ООО "Промышленные решения"', 'system', 'Название компании', 'text'),
('max_upload_size', '10', 'system', 'Максимальный размер загружаемого файла (МБ)', 'number'),
('email_notifications', 'true', 'notification', 'Включить email уведомления', 'boolean'),
('backup_frequency', 'daily', 'system', 'Частота создания резервных копий', 'select'),
('theme_color', '#2196F3', 'appearance', 'Основной цвет темы', 'color'),
('session_timeout', '30', 'security', 'Время сессии (минуты)', 'number'),
('enable_2fa', 'false', 'security', 'Включить двухфакторную аутентификацию', 'boolean'),
('default_language', 'ru', 'appearance', 'Язык по умолчанию', 'select')
ON CONFLICT DO NOTHING; 