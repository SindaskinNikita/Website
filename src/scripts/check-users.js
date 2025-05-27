const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'NiceDbPassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false
});

async function checkUsers() {
    try {
        console.log('Проверка подключения к базе данных...');
        const client = await pool.connect();

        console.log('\nПроверка структуры таблицы users:');
        const tableStructure = await client.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position;
        `);
        console.log(tableStructure.rows);

        console.log('\nПроверка пользователей в базе данных:');
        const users = await client.query(`
            SELECT username, email, substring(password_hash from 1 for 30) as password_hash_preview, role
            FROM users;
        `);
        console.log(users.rows);

        client.release();
        process.exit(0);
    } catch (error) {
        console.error('Ошибка:', error);
        process.exit(1);
    }
}

checkUsers(); 