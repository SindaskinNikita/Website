const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'postgres',
    password: 'NiceDbPassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false
});

async function createAdminUser() {
    const client = await pool.connect();
    try {
        // Данные администратора
        const adminData = {
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        };

        // Хешируем пароль
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(adminData.password, salt);

        // Проверяем, существует ли уже пользователь с таким username
        const existingUser = await client.query(
            'SELECT id FROM users WHERE username = $1',
            [adminData.username]
        );

        if (existingUser.rows.length > 0) {
            // Обновляем существующего пользователя
            await client.query(
                `UPDATE users 
                 SET email = $1, 
                     password_hash = $2, 
                     role = $3
                 WHERE username = $4`,
                [adminData.email, passwordHash, adminData.role, adminData.username]
            );
            console.log('Администратор успешно обновлен!');
        } else {
            // Создаем нового пользователя
            await client.query(
                `INSERT INTO users (username, email, password_hash, role)
                 VALUES ($1, $2, $3, $4)`,
                [adminData.username, adminData.email, passwordHash, adminData.role]
            );
            console.log('Администратор успешно создан!');
        }

    } catch (error) {
        console.error('Ошибка при создании администратора:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Запускаем создание администратора
createAdminUser()
    .then(() => {
        console.log('Скрипт успешно завершен');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Ошибка при выполнении скрипта:', error);
        process.exit(1);
    }); 