import express, { Request, Response, Router, RequestHandler } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface DecodedToken extends jwt.JwtPayload {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface LoginRequest extends Request {
    body: {
        username: string;
        password: string;
    };
}

const router: Router = express.Router();

// Настройки подключения к БД с правильными параметрами
const pool = new Pool({
    user: 'postgres',          
    password: 'NiceDbPassword',  
    host: 'localhost',         
    port: 5432,                
    database: 'postgres',      
    ssl: false                 
});

// Проверка подключения при старте
pool.connect()
    .then(client => {
        console.log('Успешное подключение к БД');
        client.query('SELECT version()')
            .then(res => {
                console.log('Версия PostgreSQL:', res.rows[0].version);
                client.release();
            })
            .catch(err => {
                console.error('Ошибка при получении версии:', err);
                client.release();
            });
    })
    .catch(err => {
        console.error('Ошибка подключения к БД:', err);
    });

// Секретный ключ для подписи JWT
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key-should-be-long-and-secure';

// Константа для количества раундов bcrypt
const BCRYPT_ROUNDS = 10;

// Функция для создания нового хеша пароля
async function createPasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    return bcrypt.hash(password, salt);
}

// Функция для проверки существующего хеша
async function verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Ошибка при проверке пароля:', error);
        return false;
    }
}

// Маршрут для аутентификации пользователя
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        console.log('Попытка входа:', { username });

        // Проверка наличия username и password
        if (!username || !password) {
            console.log('Отсутствуют имя пользователя или пароль');
            return res.status(400).json({ message: 'Требуются имя пользователя и пароль' });
        }

        // Поиск пользователя в базе данных
        console.log('Выполняем запрос для поиска пользователя:', username);
        const result = await pool.query(
            'SELECT id, username, email, password_hash, role FROM users WHERE username = $1',
            [username]
        );

        if (!result.rowCount || result.rowCount === 0) {
            console.log('Пользователь не найден в БД');
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }

        const user = result.rows[0];
        console.log('Найден пользователь:', {
            id: user.id,
            username: user.username,
            role: user.role,
            password_hash_exists: !!user.password_hash
        });

        // Создаем новый хеш для сравнения
        const salt = await bcrypt.genSalt(10);
        const testHash = await bcrypt.hash(password, salt);
        
        console.log('Отладка хеширования:', {
            введенный_пароль: password,
            соль: salt,
            тестовый_хеш: testHash,
            хеш_в_бд: user.password_hash
        });

        // Проверяем пароль
        const isValid = await bcrypt.compare(password, user.password_hash);
        console.log('Результат проверки:', { isValid });

        if (!isValid) {
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }

        // Если все хорошо, создаем новый токен
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            id: user.id,
            username: user.username,
            role: user.role,
            token
        });

    } catch (error) {
        console.error('Ошибка при аутентификации:', error);
        res.status(500).json({ message: 'Ошибка сервера при аутентификации' });
    }
});

// Маршрут для проверки токена
const verifyHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        // Получение токена из заголовка Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Не авторизован' });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Проверка токена
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        
        // Проверка, существует ли пользователь с таким токеном
        const result = await pool.query(
            'SELECT id, username, email, role FROM users WHERE id = $1 AND token = $2',
            [decoded.id, token]
        );

        const user = result.rows[0];
        if (!user) {
            res.status(401).json({ message: 'Токен недействителен' });
            return;
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
};

router.get('/verify', verifyHandler);

// Маршрут для выхода пользователя
const logoutHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        // Получение токена из заголовка Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Не авторизован' });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Проверка токена
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        
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
};

router.post('/logout', logoutHandler);

export default router; 