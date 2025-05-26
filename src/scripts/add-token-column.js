const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'NiceDbPassword',
    port: 5432,
    ssl: false
});

async function addTokenColumn() {
    try {
        console.log('Подключение к базе данных...');
        const client = await pool.connect();

        console.log('Добавление столбца token...');
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS token TEXT DEFAULT NULL
        `);

        console.log('Столбец token успешно добавлен!');
        
        client.release();
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при добавлении столбца:', error);
        process.exit(1);
    }
}

addTokenColumn(); 