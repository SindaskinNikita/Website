const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'NiceDbPassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false
});

async function addTokenColumn() {
    const client = await pool.connect();
    try {
        // Начинаем транзакцию
        await client.query('BEGIN');

        console.log('Добавление столбца token...');
        // Добавляем столбец token
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS token TEXT
        `);

        // Создаем индекс для столбца token
        console.log('Создание индекса для столбца token...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_token ON users(token)
            WHERE token IS NOT NULL
        `);

        // Фиксируем транзакцию
        await client.query('COMMIT');
        console.log('Столбец token успешно добавлен!');
    } catch (error) {
        // В случае ошибки откатываем транзакцию
        await client.query('ROLLBACK');
        console.error('Ошибка при добавлении столбца token:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Запускаем обновление
addTokenColumn()
    .then(() => {
        console.log('Скрипт успешно завершен');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Ошибка при выполнении скрипта:', error);
        process.exit(1);
    }); 