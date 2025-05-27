const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'NiceDbPassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false
});

async function testConnection() {
    try {
        console.log('🔄 Тестирование подключения к базе данных...');
        
        // Проверяем подключение
        const client = await pool.connect();
        console.log('✅ Подключение к PostgreSQL успешно!');
        
        // Проверяем существование таблицы employee
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'employee'
            )
        `);
        
        if (!tableCheck.rows[0].exists) {
            console.log('📋 Создание таблицы employee...');
            await client.query(`
                CREATE TABLE employee (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    position VARCHAR(100) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    phone VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('✅ Таблица employee создана!');
        } else {
            console.log('✅ Таблица employee уже существует');
        }
        
        // Проверяем количество записей
        const countResult = await client.query('SELECT COUNT(*) FROM employee');
        const count = parseInt(countResult.rows[0].count);
        console.log(`📊 Текущее количество сотрудников в БД: ${count}`);
        
        if (count === 0) {
            console.log('📝 Добавление тестовых данных...');
            await client.query(`
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
            console.log('✅ Тестовые данные добавлены!');
        }
        
        // Показываем текущие данные
        const employees = await client.query('SELECT * FROM employee ORDER BY id LIMIT 5');
        console.log('👥 Первые 5 сотрудников в базе данных:');
        employees.rows.forEach((emp, index) => {
            console.log(`${index + 1}. ${emp.name} - ${emp.position} (${emp.email})`);
        });
        
        client.release();
        
        // Тестируем API endpoint
        console.log('🌐 Тестирование API endpoint...');
        try {
            const fetch = require('node-fetch');
            const response = await fetch('http://localhost:3000/api/employees');
            if (response.ok) {
                const apiEmployees = await response.json();
                console.log(`✅ API работает! Получено ${apiEmployees.length} сотрудников`);
            } else {
                console.log(`❌ API недоступен. Статус: ${response.status}`);
            }
        } catch (apiError) {
            console.log('❌ Ошибка при обращении к API:', apiError.message);
            console.log('💡 Убедитесь, что сервер запущен: cd src/server && npm start');
        }
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    } finally {
        await pool.end();
    }
}

testConnection(); 