import express, { Request, Response, Router } from 'express';
import * as jwt from 'jsonwebtoken';

const router: Router = express.Router();
const JWT_SECRET = 'test-secret-key';

// Тестовые пользователи
const testUsers = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        email: 'admin@company.ru',
        role: 'admin'
    },
    {
        id: 2,
        username: 'manager',
        password: 'manager123',
        email: 'manager@company.ru',
        role: 'manager'
    }
];

// Авторизация
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        console.log('Попытка входа:', { username, password });

        if (!username || !password) {
            res.status(400).json({ message: 'Необходимо указать имя пользователя и пароль' });
            return;
        }

        // Ищем пользователя
        const user = testUsers.find(u => u.username === username && u.password === password);
        
        if (!user) {
            res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
            return;
        }

        // Создаем токен
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Возвращаем данные пользователя
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token
        });
    } catch (error: any) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Проверка токена
router.get('/verify', async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Отсутствует токен' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const user = testUsers.find(u => u.id === decoded.userId);

        if (!user) {
            res.status(401).json({ message: 'Пользователь не найден' });
            return;
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error: any) {
        console.error('Ошибка при проверке токена:', error);
        res.status(401).json({ message: 'Недействительный токен' });
    }
});

export default router; 