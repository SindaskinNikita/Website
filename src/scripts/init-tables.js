const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'NiceDbPassword',
    port: 5432,
    ssl: false
});

async function initTables() {
    try {
        console.log('Подключение к базе данных...');
        const client = await pool.connect();

        // Создаем таблицу сотрудников
        console.log('Создание таблицы employee...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS employee (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                position VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Создаем таблицу объектов
        console.log('Создание таблицы facility...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS facility (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                type VARCHAR(50),
                status VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Создаем таблицу обратной связи
        console.log('Создание таблицы feedback...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS feedback (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Все таблицы успешно созданы!');
        client.release();
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при создании таблиц:', error);
        process.exit(1);
    }
}

initTables(); 