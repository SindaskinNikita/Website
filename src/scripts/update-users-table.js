const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'NiceDbPassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false
});

async function updateUsersTable() {
    const client = await pool.connect();
    try {
        // Начинаем транзакцию
        await client.query('BEGIN');

        console.log('Добавление столбца role...');
        // Добавляем столбец role
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'
        `);

        // Обновляем существующие записи на основе is_admin
        console.log('Обновление существующих пользователей...');
        await client.query(`
            UPDATE users 
            SET role = CASE 
                WHEN is_admin = true THEN 'admin'
                ELSE 'user'
            END
        `);

        // Удаляем старый столбец is_admin
        console.log('Удаление столбца is_admin...');
        await client.query(`
            ALTER TABLE users 
            DROP COLUMN IF EXISTS is_admin
        `);

        // Создаем индекс для столбца role
        console.log('Создание индекса для столбца role...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)
        `);

        // Фиксируем транзакцию
        await client.query('COMMIT');
        console.log('Структура таблицы users успешно обновлена!');
    } catch (error) {
        // В случае ошибки откатываем транзакцию
        await client.query('ROLLBACK');
        console.error('Ошибка при обновлении таблицы:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Запускаем обновление
updateUsersTable()
    .then(() => {
        console.log('Скрипт успешно завершен');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Ошибка при выполнении скрипта:', error);
        process.exit(1);
    }); 