import express, { Request, Response } from 'express'
import { PostgresDataSource } from '../database/database.config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = express.Router()
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key-should-be-long-and-secure'

// Маршрут для аутентификации пользователя
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body
    console.log('Попытка входа:', { username })

    if (!username || !password) {
        console.log('Отсутствуют имя пользователя или пароль')
        res.status(400).json({ message: 'Требуются имя пользователя и пароль' })
        return
    }

    try {
        // Получаем пользователя из базы данных
        const result = await PostgresDataSource.query(
            'SELECT id, username, email, password_hash, role FROM users WHERE username = $1',
            [username]
        )

        if (!result || result.length === 0) {
            console.log('Пользователь не найден в БД')
            res.status(401).json({ message: 'Неверное имя пользователя или пароль' })
            return
        }

        const user = result[0]
        console.log('Пользователь найден:', {
            id: user.id,
            username: user.username,
            role: user.role
        })

        // Сравниваем пароли с помощью bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password_hash)
        if (!isValidPassword) {
            console.log('Неверный пароль')
            res.status(401).json({ message: 'Неверное имя пользователя или пароль' })
            return
        }

        // Создаем JWT токен
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        )

        // Обновляем токен в базе данных
        await PostgresDataSource.query(
            'UPDATE users SET token = $1 WHERE id = $2',
            [token, user.id]
        )

        console.log('Успешный вход:', user.username)
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        })
    } catch (error) {
        console.error('Ошибка при аутентификации:', error)
        res.status(500).json({ message: 'Ошибка сервера при аутентификации' })
    }
})

// Маршрут для проверки токена
router.get('/verify', async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Не авторизован' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        // Проверяем токен
        const decoded = jwt.verify(token, JWT_SECRET) as any

        // Проверяем, существует ли пользователь с таким токеном
        const result = await PostgresDataSource.query(
            'SELECT id, username, email, role FROM users WHERE id = $1 AND token = $2',
            [decoded.id, token]
        )

        if (!result || result.length === 0) {
            res.status(401).json({ message: 'Токен недействителен' })
            return
        }

        const user = result[0]
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        })
    } catch (error) {
        console.error('Ошибка при проверке токена:', error)
        res.status(401).json({ message: 'Недействительный токен' })
    }
})

// Маршрут для выхода
router.post('/logout', async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Не авторизован' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any

        // Очищаем токен пользователя в БД
        await PostgresDataSource.query(
            'UPDATE users SET token = NULL WHERE id = $1',
            [decoded.id]
        )
        res.json({ message: 'Выход успешен' })
    } catch (error) {
        console.error('Ошибка при выходе:', error)
        res.status(500).json({ message: 'Ошибка сервера при выходе' })
    }
})

export default router 