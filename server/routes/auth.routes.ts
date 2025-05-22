import express from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Настройки подключения к БД с правильными параметрами
const pool = new Pool({
    user: 'postgres',          // Имя пользователя PostgreSQL
    password: 'NiceDbPassword',  // Правильный пароль для PostgreSQL
    host: 'localhost',         // Хост базы данных
    port: 5432,                // Порт PostgreSQL
    database: 'postgres',      // Имя базы данных
    ssl: false                 // Отключаем SSL для локальной разработки
});

// Секретный ключ для подписи JWT
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key-should-be-long-and-secure';

// Маршрут для аутентификации пользователя
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Попытка входа:', { username });

        // Проверка наличия username и password
        if (!username || !password) {
            console.log('Отсутствуют имя пользователя или пароль');
            return res.status(400).json({ message: 'Требуются имя пользователя и пароль' });
        }

        // Проверка подключения к БД
        try {
            const testConnection = await pool.query('SELECT NOW()');
            console.log('Подключение к БД успешно:', testConnection.rows[0]);
        } catch (dbError) {
            console.error('Ошибка подключения к БД:', dbError);
            return res.status(500).json({ message: 'Ошибка подключения к базе данных' });
        }

        // Проверка наличия таблицы users
        try {
            const checkTable = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'users'
                )
            `);
            console.log('Таблица users существует:', checkTable.rows[0].exists);
            
            if (!checkTable.rows[0].exists) {
                return res.status(500).json({ message: 'Таблица пользователей не существует' });
            }
        } catch (tableError) {
            console.error('Ошибка проверки таблицы:', tableError);
            return res.status(500).json({ message: 'Ошибка проверки таблицы пользователей' });
        }

        // Проверка наличия данных пользователей
        try {
            const countUsers = await pool.query('SELECT COUNT(*) FROM users');
            console.log('Количество пользователей в таблице:', countUsers.rows[0].count);
            
            if (parseInt(countUsers.rows[0].count) === 0) {
                // Если пользователей нет, создаем тестовых пользователей
                console.log('Добавляем тестовых пользователей');
                await pool.query(`
                    INSERT INTO users (username, email, password, role) VALUES
                    ('admin', 'admin@example.com', 'password123', 'admin'),
                    ('manager', 'manager@example.com', 'password123', 'manager'),
                    ('employee', 'employee@example.com', 'password123', 'employee'),
                    ('guest', 'guest@example.com', 'password123', 'guest')
                `);
                console.log('Тестовые пользователи добавлены');
            }
        } catch (countError) {
            console.error('Ошибка проверки количества пользователей:', countError);
        }

        // Поиск пользователя в базе данных
        console.log('Выполняем запрос для поиска пользователя:', username);
        const result = await pool.query(
            'SELECT id, username, email, password, role FROM users WHERE username = $1',
            [username]
        );
        
        if (!result.rowCount || result.rowCount === 0) {
            console.log('Пользователь не найден в БД');
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }
        
        console.log('Результат запроса: Пользователь найден');
        const user = result.rows[0];

        console.log('Данные пользователя:', {
            id: user.id,
            username: user.username,
            password: user.password,
            passwordLength: user.password ? user.password.length : 0,
            passwordType: typeof user.password,
            role: user.role
        });

        // В реальном приложении здесь должна быть проверка хеша пароля
        // const isValidPassword = await bcrypt.compare(password, user.password);
        
        // Дополнительная отладка для проверки значений паролей
        console.log('Тип введенного пароля:', typeof password);
        console.log('Значение введенного пароля:', password);
        console.log('Тип пароля из БД:', typeof user.password);
        console.log('Значение пароля из БД:', user.password);
        
        // Принудительно приводим значения к строкам и обрезаем пробелы
        const passwordStr = String(password).trim();
        const dbPasswordStr = String(user.password).trim();
        
        // Для демонстрации: сравниваем пароли разными способами и выводим результаты
        const isEqualOperator = passwordStr === dbPasswordStr;
        const isEqualStrict = passwordStr.localeCompare(dbPasswordStr) === 0;
        
        console.log('Проверка пароля:');
        console.log('Введенный пароль после обработки:', passwordStr);
        console.log('Пароль из БД после обработки:', dbPasswordStr);
        console.log('Результат сравнения (===):', isEqualOperator);
        console.log('Результат сравнения (localeCompare):', isEqualStrict);
        
        // Принимаем оба метода сравнения для аутентификации
        const isValidPassword = isEqualOperator || isEqualStrict;
        
        if (!isValidPassword) {
            console.log('Неверный пароль');
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }

        // Создание токена JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username,
                email: user.email,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Обновление токена пользователя в базе данных
        await pool.query(
            'UPDATE users SET token = $1 WHERE id = $2',
            [token, user.id]
        );

        console.log('Успешный вход пользователя:', user.username);
        
        // Отправка данных пользователя
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        console.error('Ошибка при аутентификации:', error);
        res.status(500).json({ message: 'Ошибка сервера при аутентификации' });
    }
});

// Маршрут для проверки токена
router.get('/verify', async (req, res) => {
    try {
        // Получение токена из заголовка Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        const token = authHeader.split(' ')[1];

        // Проверка токена
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Проверка, существует ли пользователь с таким токеном
        const result = await pool.query(
            'SELECT id, username, email, role FROM users WHERE id = $1 AND token = $2',
            [decoded.id, token]
        );

        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Токен недействителен' });
        }

        // Возвращаем данные пользователя
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        res.status(401).json({ message: 'Недействительный токен' });
    }
});

// Маршрут для выхода пользователя
router.post('/logout', async (req, res) => {
    try {
        // Получение токена из заголовка Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        const token = authHeader.split(' ')[1];

        // Проверка токена
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Удаляем токен пользователя из базы данных
        await pool.query(
            'UPDATE users SET token = NULL WHERE id = $1',
            [decoded.id]
        );

        res.json({ message: 'Выход успешен' });
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        res.status(500).json({ message: 'Ошибка сервера при выходе' });
    }
});

export default router; 