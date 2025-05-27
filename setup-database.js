const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Настройки подключения к базе данных
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'equipment_management',
    password: 'admin',
    port: 5432,
});

async function setupDatabase() {
    try {
        console.log('Настройка базы данных...');

        // Создаем таблицу пользователей
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'user',
                token TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Создаем таблицу сотрудников
        await pool.query(`
            CREATE TABLE IF NOT EXISTS employees (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                position VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Создаем таблицу объектов
        await pool.query(`
            CREATE TABLE IF NOT EXISTS facilities (
                id SERIAL PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                address TEXT NOT NULL,
                type VARCHAR(50) NOT NULL,
                status VARCHAR(20) DEFAULT 'active',
                cost DECIMAL(15,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Таблицы созданы успешно');

        // Хешируем пароли
        const adminPasswordHash = await bcrypt.hash('admin123', 10);
        const managerPasswordHash = await bcrypt.hash('manager123', 10);

        console.log('Хеши паролей созданы:');
        console.log('admin123 ->', adminPasswordHash);
        console.log('manager123 ->', managerPasswordHash);

        // Удаляем существующих пользователей
        await pool.query('DELETE FROM users');

        // Добавляем пользователей с хешированными паролями
        await pool.query(`
            INSERT INTO users (username, email, password_hash, role) VALUES
            ('admin', 'admin@company.ru', $1, 'admin'),
            ('manager', 'manager@company.ru', $2, 'manager')
        `, [adminPasswordHash, managerPasswordHash]);

        console.log('Пользователи добавлены успешно');

        // Добавляем тестовых сотрудников
        await pool.query(`
            INSERT INTO employees (name, position, email, phone) VALUES
            ('Иван Иванов', 'Инженер', 'ivanov@company.ru', '+7-900-123-45-67'),
            ('Петр Петров', 'Техник', 'petrov@company.ru', '+7-900-234-56-78'),
            ('Мария Сидорова', 'Менеджер', 'sidorova@company.ru', '+7-900-345-67-89')
            ON CONFLICT (email) DO NOTHING
        `);

        // Добавляем тестовые объекты
        await pool.query(`
            INSERT INTO facilities (name, address, type, status, cost) VALUES
            ('Завод №1', 'г. Москва, ул. Промышленная, 1', 'Производство', 'active', 5000000.00),
            ('Склад №2', 'г. Санкт-Петербург, ул. Складская, 15', 'Склад', 'active', 2000000.00),
            ('Офис №3', 'г. Екатеринбург, ул. Офисная, 25', 'Офис', 'maintenance', 1500000.00)
            ON CONFLICT DO NOTHING
        `);

        console.log('Тестовые данные добавлены');

        // Проверяем созданных пользователей
        const users = await pool.query('SELECT id, username, email, role FROM users');
        console.log('Созданные пользователи:', users.rows);

        console.log('База данных настроена успешно!');
        console.log('Учетные данные для входа:');
        console.log('- admin / admin123');
        console.log('- manager / manager123');

    } catch (error) {
        console.error('Ошибка при настройке базы данных:', error);
    } finally {
        await pool.end();
    }
}

setupDatabase(); 