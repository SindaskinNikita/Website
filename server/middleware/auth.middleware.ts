import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key-should-be-long-and-secure';
const pool = new Pool({
    user: 'postgres',          // Имя пользователя PostgreSQL
    password: 'NiceDbPassword', // Правильный пароль для PostgreSQL
    host: 'localhost',         // Хост базы данных
    port: 5432,                // Порт PostgreSQL
    database: 'postgres',      // Имя базы данных
    ssl: false                 // Отключаем SSL для локальной разработки
});

// Расширяем интерфейс Request, чтобы включить поле user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// Middleware для проверки JWT-токена
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Получение токена из заголовка Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        const token = authHeader.split(' ')[1];

        // Проверка токена
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        
        // Проверка, существует ли пользователь с таким токеном
        const result = await pool.query(
            'SELECT id, username, email, role FROM users WHERE id = $1 AND token = $2',
            [decoded.id, token]
        );

        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Токен недействителен' });
        }

        // Добавляем пользователя в объект запроса
        req.user = user;
        
        next();
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        res.status(401).json({ message: 'Недействительный токен' });
    }
};

// Middleware для проверки ролей пользователя
export const roleMiddleware = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        if (roles.includes(req.user.role)) {
            next();
        } else {
            return res.status(403).json({ message: 'Нет доступа' });
        }
    };
}; 