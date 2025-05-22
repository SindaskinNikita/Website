const { Pool } = require('pg');

// Настройки подключения к БД с правильными параметрами
const pool = new Pool({
    user: 'postgres',          // Имя пользователя PostgreSQL
    password: 'NiceDbPassword', // Правильный пароль для PostgreSQL
    host: 'localhost',         // Хост базы данных
    port: 5432,                // Порт PostgreSQL
    database: 'postgres',      // Имя базы данных
    ssl: false                 // Отключаем SSL для локальной разработки
});

// Тестовые учетные данные
const testUsername = 'admin';
const testPassword = 'password123';

async function debugAuth() {
    try {
        console.log('Тестирование подключения к базе данных...');
        const connection = await pool.query('SELECT NOW()');
        console.log('Подключение успешно:', connection.rows[0]);

        console.log('Проверка существования таблицы users...');
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            )
        `);
        console.log('Таблица users существует:', tableCheck.rows[0].exists);

        console.log('Получение количества пользователей...');
        const countResult = await pool.query('SELECT COUNT(*) FROM users');
        console.log('Количество пользователей в таблице:', countResult.rows[0].count);

        console.log('Проверка учетных данных пользователя admin...');
        const userResult = await pool.query(
            'SELECT id, username, email, password, role FROM users WHERE username = $1',
            [testUsername]
        );

        if (!userResult.rowCount || userResult.rowCount === 0) {
            console.log('Пользователь не найден в БД');
            return;
        }

        const user = userResult.rows[0];
        console.log('Данные пользователя:');
        console.log('ID:', user.id);
        console.log('Username:', user.username);
        console.log('Email:', user.email);
        console.log('Password:', user.password);
        console.log('Role:', user.role);

        // Проверка пароля
        const isValidPassword = testPassword === user.password;
        console.log('Проверка пароля:');
        console.log('Введенный пароль:', testPassword);
        console.log('Пароль в БД:', user.password);
        console.log('Результат сравнения:', isValidPassword);
        
        // Проверка типов данных
        console.log('Типы данных:');
        console.log('Тип введенного пароля:', typeof testPassword);
        console.log('Тип пароля в БД:', typeof user.password);
        console.log('Длина введенного пароля:', testPassword.length);
        console.log('Длина пароля в БД:', user.password.length);
        
        // Проверка на скрытые символы
        console.log('Код каждого символа введенного пароля:');
        for (let i = 0; i < testPassword.length; i++) {
            console.log(`Символ '${testPassword[i]}' (индекс ${i}): ${testPassword.charCodeAt(i)}`);
        }
        
        console.log('Код каждого символа пароля в БД:');
        for (let i = 0; i < user.password.length; i++) {
            console.log(`Символ '${user.password[i]}' (индекс ${i}): ${user.password.charCodeAt(i)}`);
        }
    } catch (error) {
        console.error('Ошибка при отладке:', error);
    } finally {
        // Закрываем пул соединений
        await pool.end();
    }
}

// Запускаем отладку
debugAuth(); 