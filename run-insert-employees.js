const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    user: 'postgres',
    password: 'NiceDbPassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false
});

async function insertEmployees() {
    try {
        console.log('Подключение к базе данных...');
        
        // Сначала проверим, существует ли таблица
        const tableExists = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'employee'
            )
        `);
        
        if (!tableExists.rows[0].exists) {
            console.log('Создание таблицы employee...');
            await pool.query(`
                CREATE TABLE employee (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    position VARCHAR(100) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    phone VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('Таблица employee создана.');
        } else {
            console.log('Таблица employee уже существует.');
        }
        
        // Очищаем таблицу перед вставкой новых данных
        console.log('Очистка таблицы employee...');
        await pool.query('DELETE FROM employee');
        
        // Вставляем тестовые данные
        console.log('Вставка тестовых данных сотрудников...');
        await pool.query(`
            INSERT INTO employee (name, position, email, phone, created_at) VALUES
            ('Иванов Иван Иванович', 'Главный инженер', 'ivanov@company.ru', '+7 (900) 123-45-67', NOW()),
            ('Петрова Елена Сергеевна', 'Менеджер проекта', 'petrova@company.ru', '+7 (900) 234-56-78', NOW()),
            ('Сидоров Алексей Петрович', 'Технический специалист', 'sidorov@company.ru', '+7 (900) 345-67-89', NOW()),
            ('Козлова Анна Михайловна', 'Бухгалтер', 'kozlova@company.ru', '+7 (900) 456-78-90', NOW()),
            ('Новиков Дмитрий Александрович', 'Системный администратор', 'novikov@company.ru', '+7 (900) 567-89-01', NOW()),
            ('Морозова Ольга Викторовна', 'HR-менеджер', 'morozova@company.ru', '+7 (900) 678-90-12', NOW()),
            ('Волков Сергей Николаевич', 'Ведущий разработчик', 'volkov@company.ru', '+7 (900) 789-01-23', NOW()),
            ('Лебедева Мария Андреевна', 'Дизайнер', 'lebedeva@company.ru', '+7 (900) 890-12-34', NOW()),
            ('Соколов Андрей Владимирович', 'Тестировщик', 'sokolov@company.ru', '+7 (900) 901-23-45', NOW()),
            ('Федорова Екатерина Игоревна', 'Аналитик', 'fedorova@company.ru', '+7 (900) 012-34-56', NOW())
        `);
        
        console.log('Тестовые данные успешно вставлены!');
        
        // Проверяем результат
        const result = await pool.query('SELECT * FROM employee ORDER BY id');
        console.log('\\nВставленные сотрудники:');
        console.table(result.rows);
        
    } catch (error) {
        console.error('Ошибка:', error);
    } finally {
        await pool.end();
    }
}

insertEmployees(); 