const { Pool } = require('pg');

// Настройки подключения к БД
const pool = new Pool({
    user: 'postgres',         // Имя пользователя PostgreSQL
    password: 'NiceDbPassword',  // Правильный пароль для PostgreSQL
    host: 'localhost',        // Хост базы данных
    port: 5432,               // Порт PostgreSQL
    database: 'postgres',     // Сначала подключаемся к базе postgres
    ssl: false                // Отключаем SSL для локальной разработки
});

async function initializeDatabase() {
    let client;
    try {
        console.log('Подключение к базе данных...');
        client = await pool.connect();
        
        // Проверяем существование базы данных website_db
        const dbExists = await client.query(
            "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = 'website_db')"
        );
        
        if (!dbExists.rows[0].exists) {
            console.log('Создание базы данных website_db...');
            await client.query('CREATE DATABASE website_db');
            console.log('База данных website_db создана успешно.');
        } else {
            console.log('База данных website_db уже существует.');
        }
        
        // Закрываем текущее соединение
        client.release();
        
        // Переподключаемся к базе данных website_db
        console.log('Подключение к базе данных website_db...');
        const websitePool = new Pool({
            user: 'postgres',
            password: 'NiceDbPassword',  // Правильный пароль для PostgreSQL
            host: 'localhost',
            port: 5432,
            database: 'website_db',
            ssl: false
        });
        
        client = await websitePool.connect();
        
        // Проверяем существование типа user_role
        const typeExists = await client.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_type WHERE typname = 'user_role'
            )
        `);
        
        if (!typeExists.rows[0].exists) {
            console.log('Создание типа user_role...');
            await client.query("CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee', 'guest')");
            console.log('Тип user_role создан успешно.');
        } else {
            console.log('Тип user_role уже существует.');
        }
        
        // Проверяем существование таблицы users
        const tableExists = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            )
        `);
        
        if (!tableExists.rows[0].exists) {
            console.log('Создание таблицы users...');
            await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) NOT NULL UNIQUE,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role user_role NOT NULL DEFAULT 'guest',
                    token VARCHAR(255),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            console.log('Создание индексов...');
            await client.query('CREATE INDEX idx_users_username ON users(username)');
            await client.query('CREATE INDEX idx_users_email ON users(email)');
            await client.query('CREATE INDEX idx_users_role ON users(role)');
            
            console.log('Создание триггерной функции для обновления updated_at...');
            await client.query(`
                CREATE OR REPLACE FUNCTION update_updated_at_column()
                RETURNS TRIGGER AS $$
                BEGIN
                    NEW.updated_at = CURRENT_TIMESTAMP;
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql
            `);
            
            console.log('Создание триггера...');
            await client.query(`
                CREATE TRIGGER update_users_updated_at
                BEFORE UPDATE ON users
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column()
            `);
            
            console.log('Таблица users создана успешно.');
        } else {
            console.log('Таблица users уже существует.');
        }
        
        // Проверяем, есть ли уже пользователи в таблице
        const userCount = await client.query('SELECT COUNT(*) FROM users');
        
        if (parseInt(userCount.rows[0].count) === 0) {
            console.log('Добавление тестовых пользователей...');
            await client.query(`
                INSERT INTO users (username, email, password, role) VALUES
                ('admin', 'admin@example.com', 'password123', 'admin'),
                ('manager', 'manager@example.com', 'password123', 'manager'),
                ('employee', 'employee@example.com', 'password123', 'employee'),
                ('guest', 'guest@example.com', 'password123', 'guest')
            `);
            console.log('Тестовые пользователи добавлены успешно.');
        } else {
            console.log(`В таблице users уже есть ${userCount.rows[0].count} пользователей.`);
        }
        
        // Проверяем, что пользователи действительно добавлены
        const users = await client.query('SELECT id, username, email, role FROM users');
        console.log('Список пользователей:');
        users.rows.forEach(user => {
            console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
        });
        
        console.log('Инициализация базы данных завершена успешно!');
    } catch (err) {
        console.error('Ошибка при инициализации базы данных:', err);
    } finally {
        if (client) {
            client.release();
        }
        // Завершаем работу скрипта
        process.exit(0);
    }
}

// Запускаем инициализацию
initializeDatabase(); 