import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { pool } from '../config/database';

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';

export class AuthController {
  // Авторизация пользователя
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      console.log('Попытка входа:', { username });

      // Поиск пользователя по username
      const result = await pool.query(
        'SELECT id, username, email, password_hash, role FROM users WHERE username = $1',
        [username]
      );

      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      }

      // Проверка пароля
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      }

      // Создание JWT токена
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Отправка ответа без пароля
      const { password_hash, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error: any) {
      console.error('Ошибка при аутентификации:', error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }

  // Регистрация нового пользователя
  async register(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;

      // Проверка существования пользователя
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Пользователь с таким email или именем уже существует' });
      }

      // Хеширование пароля
      const salt = await bcrypt.genSalt(12);
      const password_hash = await bcrypt.hash(password, salt);

      // Создание нового пользователя
      const result = await pool.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
        [username, email, password_hash, role]
      );

      const newUser = result.rows[0];
      res.status(201).json(newUser);
    } catch (error: any) {
      console.error('Ошибка при регистрации:', error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }

  // Изменение пароля
  async changePassword(req: Request, res: Response) {
    try {
      const { userId, oldPassword, newPassword } = req.body;

      // Получение текущего пароля пользователя
      const result = await pool.query(
        'SELECT password_hash FROM users WHERE id = $1',
        [userId]
      );

      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      // Проверка старого пароля
      const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Неверный текущий пароль' });
      }

      // Хеширование нового пароля
      const salt = await bcrypt.genSalt(12);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      // Обновление пароля
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [newPasswordHash, userId]
      );

      res.json({ message: 'Пароль успешно изменен' });
    } catch (error: any) {
      console.error('Ошибка при изменении пароля:', error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }
} 