import express, { Request, Response, Router } from 'express';
import { PostgresDataSource } from '../database/database.config';

const router: Router = express.Router();

// Получение всех сообщений обратной связи
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await PostgresDataSource.query(`
            SELECT * FROM feedback 
            ORDER BY created_at DESC
        `);
        res.json(result);
    } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении сообщений' });
    }
});

// Создание нового сообщения
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            res.status(400).json({ 
                message: 'Необходимо заполнить все обязательные поля' 
            });
            return;
        }

        const result = await PostgresDataSource.query(
            `INSERT INTO feedback (name, email, subject, message) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [name, email, subject, message]
        );

        res.status(201).json(result[0]);
    } catch (error) {
        console.error('Ошибка при создании сообщения:', error);
        res.status(500).json({ message: 'Ошибка сервера при создании сообщения' });
    }
});

// Обновление статуса сообщения
router.patch('/:id/status', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            res.status(400).json({ message: 'Статус обязателен' });
            return;
        }

        const result = await PostgresDataSource.query(
            `UPDATE feedback 
             SET status = $1 
             WHERE id = $2 
             RETURNING *`,
            [status, id]
        );

        if (result.length === 0) {
            res.status(404).json({ message: 'Сообщение не найдено' });
            return;
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Ошибка при обновлении статуса:', error);
        res.status(500).json({ message: 'Ошибка сервера при обновлении статуса' });
    }
});

// Удаление сообщения
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const result = await PostgresDataSource.query(
            'DELETE FROM feedback WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.length === 0) {
            res.status(404).json({ message: 'Сообщение не найдено' });
            return;
        }

        res.json({ message: 'Сообщение успешно удалено' });
    } catch (error) {
        console.error('Ошибка при удалении сообщения:', error);
        res.status(500).json({ message: 'Ошибка сервера при удалении сообщения' });
    }
});

export default router; 