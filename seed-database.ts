import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
    user: 'postgres',
    password: 'NiceDbPassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false
});

async function createTables() {
    try {
        // Создаем таблицы если они не существуют
        await pool.query(`
            -- Таблица компаний
            CREATE TABLE IF NOT EXISTS companies (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                founded_year INTEGER,
                website VARCHAR(200),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Таблица оборудования
            CREATE TABLE IF NOT EXISTS equipment (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                type VARCHAR(50),
                description TEXT,
                purchase_date DATE,
                status VARCHAR(20),
                company_id INTEGER REFERENCES companies(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Таблица услуг
            CREATE TABLE IF NOT EXISTS services (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10,2),
                duration INTEGER, -- в минутах
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Таблица контактов
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100),
                phone VARCHAR(20),
                position VARCHAR(100),
                company_id INTEGER REFERENCES companies(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Таблицы успешно созданы');

        // Наполняем таблицу компаний
        await pool.query(`
            INSERT INTO companies (name, description, founded_year, website) VALUES
            ('ТехноПром', 'Производство промышленного оборудования', 2010, 'technoprom.ru'),
            ('СтройМаш', 'Строительная техника и оборудование', 2015, 'stroymash.ru'),
            ('ИнноТех', 'Инновационные технологические решения', 2018, 'innotech.ru'),
            ('МедТех', 'Медицинское оборудование', 2012, 'medtech.ru'),
            ('АгроТех', 'Сельскохозяйственное оборудование', 2014, 'agrotech.ru'),
            ('ЭнергоСистемы', 'Энергетическое оборудование', 2016, 'energosystems.ru'),
            ('ЭкоТех', 'Экологичные технологии', 2019, 'ecotech.ru'),
            ('ПищеПром', 'Оборудование для пищевой промышленности', 2013, 'pischeprom.ru'),
            ('ХимПром', 'Оборудование для химической промышленности', 2017, 'chimprom.ru'),
            ('МеталлТех', 'Металлообрабатывающее оборудование', 2011, 'metalltech.ru')
        `);

        // Наполняем таблицу оборудования
        await pool.query(`
            INSERT INTO equipment (name, type, description, purchase_date, status, company_id) VALUES
            ('Станок ЧПУ-1000', 'Станок', 'Станок с числовым программным управлением', '2023-01-15', 'Активен', 1),
            ('Погрузчик XL-500', 'Погрузчик', 'Вилочный погрузчик повышенной грузоподъемности', '2023-02-20', 'Ремонт', 2),
            ('3D-принтер Pro', 'Принтер', 'Промышленный 3D-принтер', '2023-03-10', 'Активен', 3),
            ('МРТ Сканер', 'Медицинское', 'Магнитно-резонансный томограф', '2023-04-05', 'Активен', 4),
            ('Трактор АгроМастер', 'Сельхоз', 'Универсальный трактор', '2023-05-12', 'Активен', 5),
            ('Генератор ЭС-1000', 'Энергетика', 'Промышленный генератор', '2023-06-18', 'Активен', 6),
            ('Фильтр ЭКО-200', 'Очистка', 'Промышленный фильтр для очистки воды', '2023-07-22', 'Тестирование', 7),
            ('Конвейер ПП-500', 'Конвейер', 'Производственный конвейер', '2023-08-30', 'Активен', 8),
            ('Реактор ХП-100', 'Реактор', 'Химический реактор', '2023-09-14', 'Ремонт', 9),
            ('Пресс МТ-2000', 'Пресс', 'Гидравлический пресс', '2023-10-25', 'Активен', 10)
        `);

        // Наполняем таблицу услуг
        await pool.query(`
            INSERT INTO services (name, description, price, duration) VALUES
            ('Монтаж оборудования', 'Профессиональный монтаж промышленного оборудования', 50000.00, 480),
            ('Техническое обслуживание', 'Регулярное ТО оборудования', 15000.00, 240),
            ('Ремонт станков', 'Ремонт станков любой сложности', 35000.00, 360),
            ('Калибровка приборов', 'Точная калибровка измерительных приборов', 8000.00, 120),
            ('Модернизация оборудования', 'Обновление и модернизация устаревшего оборудования', 75000.00, 720),
            ('Диагностика неисправностей', 'Комплексная диагностика оборудования', 12000.00, 180),
            ('Пусконаладочные работы', 'Запуск и настройка нового оборудования', 45000.00, 360),
            ('Обучение персонала', 'Обучение работе с новым оборудованием', 25000.00, 480),
            ('Аварийный ремонт', 'Срочный ремонт при поломках', 40000.00, 240),
            ('Консультации', 'Технические консультации по оборудованию', 5000.00, 60)
        `);

        // Наполняем таблицу контактов
        await pool.query(`
            INSERT INTO contacts (name, email, phone, position, company_id) VALUES
            ('Иванов Иван', 'ivanov@technoprom.ru', '+7(900)123-45-67', 'Генеральный директор', 1),
            ('Петров Петр', 'petrov@stroymash.ru', '+7(900)234-56-78', 'Технический директор', 2),
            ('Сидоров Сидор', 'sidorov@innotech.ru', '+7(900)345-67-89', 'Главный инженер', 3),
            ('Козлов Николай', 'kozlov@medtech.ru', '+7(900)456-78-90', 'Руководитель отдела', 4),
            ('Морозов Андрей', 'morozov@agrotech.ru', '+7(900)567-89-01', 'Менеджер проектов', 5),
            ('Волков Дмитрий', 'volkov@energosystems.ru', '+7(900)678-90-12', 'Главный технолог', 6),
            ('Соловьев Артем', 'soloviev@ecotech.ru', '+7(900)789-01-23', 'Директор по развитию', 7),
            ('Лебедев Максим', 'lebedev@pischeprom.ru', '+7(900)890-12-34', 'Начальник производства', 8),
            ('Комаров Алексей', 'komarov@chimprom.ru', '+7(900)901-23-45', 'Главный механик', 9),
            ('Орлов Владимир', 'orlov@metalltech.ru', '+7(900)012-34-56', 'Технический специалист', 10)
        `);

        console.log('Данные успешно добавлены');

        // Проверяем количество записей в каждой таблице
        const counts = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM companies) as companies_count,
                (SELECT COUNT(*) FROM equipment) as equipment_count,
                (SELECT COUNT(*) FROM services) as services_count,
                (SELECT COUNT(*) FROM contacts) as contacts_count
        `);

        console.log('Количество записей в таблицах:', counts.rows[0]);

    } catch (err) {
        console.error('Ошибка:', err);
    } finally {
        await pool.end();
    }
}

createTables(); 