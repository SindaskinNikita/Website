import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'password123';

const pool = new Pool({
    user: 'postgres',
    password: 'NiceDbPassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false
});

async function updatePasswords() {
    try {
        // Создаем новый хеш
        const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
        const newHash = await bcrypt.hash(DEFAULT_PASSWORD, salt);
        
        console.log('Новый хеш:', {
            хеш: newHash,
            формат: newHash.substring(0, 7),
            количество_раундов: BCRYPT_ROUNDS
        });

        // Обновляем хеши для всех пользователей
        await pool.query('UPDATE users SET password_hash = $1', [newHash]);
        
        // Проверяем обновленные данные
        const users = await pool.query('SELECT username, password_hash FROM users');
        console.log('Обновленные пользователи:', users.rows.map(u => ({
            username: u.username,
            password_hash_prefix: u.password_hash.substring(0, 7)
        })));

        // Проверяем работу хеша
        const testUser = users.rows[0];
        const isValid = await bcrypt.compare(DEFAULT_PASSWORD, testUser.password_hash);
        console.log('Проверка нового хеша:', {
            пароль: DEFAULT_PASSWORD,
            результат: isValid
        });

    } catch (err) {
        console.error('Ошибка:', err);
    } finally {
        await pool.end();
    }
}

updatePasswords(); 