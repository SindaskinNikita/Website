import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { pool } from '../config/database';

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';

export class TestAuthController {
    // Тестирование авторизации
    async testAuth(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            
            // Получаем пользователя из базы
            const result = await pool.query(
                'SELECT id, username, email, password_hash, role FROM users WHERE email = $1',
                [email]
            );

            const user = result.rows[0];
            
            if (!user) {
                return res.json({ 
                    success: false,
                    message: 'Пользователь не найден',
                    email 
                });
            }

            // Проверяем пароль с использованием bcrypt
            const isValidPassword = await bcrypt.compare(password, user.password_hash);

            // Формируем ответ
            const response = {
                success: isValidPassword,
                message: isValidPassword ? 'Авторизация успешна' : 'Неверный пароль',
                user: {
                    email: user.email,
                    username: user.username,
                    role: user.role
                },
                debug: {
                    providedPassword: password,
                    expectedHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YIpjR5qi',
                    actualHash: user.password_hash,
                    isHashMatch: user.password_hash === '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpfQN2YIpjR5qi'
                }
            };

            return res.json(response);
        } catch (error) {
            console.error('Ошибка при тестировании авторизации:', error);
            res.status(500).json({ 
                success: false,
                message: 'Внутренняя ошибка сервера',
                error: error.message
            });
        }
    }

    // Генерация нового хеша пароля
    async generateHash(req: Request, res: Response) {
        try {
            const { password } = req.body;
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(password, salt);
            
            res.json({
                originalPassword: password,
                generatedHash: hash,
                saltRounds: 12
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Ошибка при генерации хеша',
                error: error.message
            });
        }
    }
} 