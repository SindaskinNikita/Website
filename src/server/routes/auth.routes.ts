import express, { Request, Response } from 'express'
import { PostgresDataSource } from '../database/database.config'
import jwt from 'jsonwebtoken'

const router = express.Router()
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key-should-be-long-and-secure'

// Маршрут для аутентификации пользователя
router.post('/login', async function(req: Request, res: Response) {
    try {
        const { username, password } = req.body
        console.log('Попытка входа:', { username })

        if (!username || !password) {
            console.log('Отсутствуют имя пользователя или пароль')
            return res.status(400).json({ message: 'Требуются имя пользователя и пароль' })
        }

        // Получаем репозиторий для работы с пользователями из TypeORM
        // В нашем случае используем прямой запрос к БД, т.к. нет сущности User
        const result = await PostgresDataSource.query(
            'SELECT id, username, email, password, role FROM users WHERE username = $1',
            [username]
        )

        if (!result || result.length === 0) {
            console.log('Пользователь не найден в БД')
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' })
        }

        const user = result[0]
        console.log('Пользователь найден:', {
            id: user.id,
            username: user.username,
            role: user.role
        })

        // Сравниваем пароли
        const passwordStr = String(password).trim()
        const dbPasswordStr = String(user.password).trim()
        const isValidPassword = passwordStr === dbPasswordStr

        console.log('Проверка пароля:', {
            введенныйПароль: passwordStr,
            парольВБД: dbPasswordStr,
            результат: isValidPassword
        })

        if (!isValidPassword) {
            console.log('Неверный пароль')
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' })
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

        // Отправляем данные пользователя
        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        })
    } catch (error) {
        console.error('Ошибка при аутентификации:', error)
        return res.status(500).json({ message: 'Ошибка сервера при аутентификации' })
    }
})

// Маршрут для проверки токена
router.get('/verify', async function(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Не авторизован' })
        }

        const token = authHeader.split(' ')[1]

        // Проверяем токен
        const decoded = jwt.verify(token, JWT_SECRET) as any

        // Проверяем, существует ли пользователь с таким токеном
        const result = await PostgresDataSource.query(
            'SELECT id, username, email, role FROM users WHERE id = $1 AND token = $2',
            [decoded.id, token]
        )

        if (!result || result.length === 0) {
            return res.status(401).json({ message: 'Токен недействителен' })
        }

        const user = result[0]

        // Отправляем данные пользователя
        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        })
    } catch (error) {
        console.error('Ошибка при проверке токена:', error)
        return res.status(401).json({ message: 'Недействительный токен' })
    }
})

// Маршрут для выхода
router.post('/logout', async function(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Не авторизован' })
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, JWT_SECRET) as any

        // Очищаем токен пользователя в БД
        await PostgresDataSource.query(
            'UPDATE users SET token = NULL WHERE id = $1',
            [decoded.id]
        )

        return res.json({ message: 'Выход успешен' })
    } catch (error) {
        console.error('Ошибка при выходе:', error)
        return res.status(500).json({ message: 'Ошибка сервера при выходе' })
    }
})

export default router 