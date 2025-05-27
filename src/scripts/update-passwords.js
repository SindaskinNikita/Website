const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'NiceDbPassword',
    port: 5432,
    ssl: false
});

async function updatePasswords() {
    try {
        console.log('Подключение к базе данных...');
        const client = await pool.connect();

        // Получаем всех пользователей
        const users = await client.query('SELECT id, username FROM users');
        
        // Хешируем пароль для каждого пользователя
        const password = 'password123';
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        console.log('Обновляем пароли пользователей...');
        for (const user of users.rows) {
            await client.query(
                'UPDATE users SET password_hash = $1 WHERE id = $2',
                [passwordHash, user.id]
            );
            console.log(`Пароль обновлен для пользователя ${user.username}`);
        }

        console.log('Проверяем обновленные пароли...');
        const updatedUsers = await client.query(
            'SELECT username, password_hash FROM users'
        );
        updatedUsers.rows.forEach(user => {
            console.log(`${user.username}: ${user.password_hash.substring(0, 30)}...`);
        });

        client.release();
        console.log('Все пароли успешно обновлены!');
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при обновлении паролей:', error);
        process.exit(1);
    }
}

updatePasswords(); 