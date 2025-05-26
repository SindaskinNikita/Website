import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    password: 'NiceDbPassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false
});

async function checkDatabase() {
    try {
        // Проверяем структуру таблицы
        const tableInfo = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `);
        console.log('Структура таблицы users:', tableInfo.rows);

        // Проверяем данные пользователей
        const users = await pool.query('SELECT id, username, role, password_hash FROM users');
        console.log('Пользователи:', users.rows.map(u => ({
            id: u.id,
            username: u.username,
            role: u.role,
            password_hash_prefix: u.password_hash?.substring(0, 7)
        })));
    } catch (err) {
        console.error('Ошибка:', err);
    } finally {
        await pool.end();
    }
}

checkDatabase(); 