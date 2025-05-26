import express, { Request, Response, Router } from 'express';
import { Pool } from 'pg';

const router: Router = express.Router();

// Настройки подключения к БД
const pool = new Pool({
    user: 'postgres',
    password: 'NiceDbPassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false
});

// Получить всех сотрудников
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Получение списка сотрудников...');
        const result = await pool.query('SELECT * FROM employee ORDER BY id ASC');
        console.log(`Найдено ${result.rows.length} сотрудников`);
        res.json(result.rows);
    } catch (error: any) {
        console.error('Ошибка при получении сотрудников:', error);
        res.status(500).json({ message: 'Ошибка при получении списка сотрудников' });
    }
});

// Получить сотрудника по ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params['id']);
        const result = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Сотрудник не найден' });
            return;
        }
        
        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('Ошибка при получении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка при получении сотрудника' });
    }
});

// Добавить сотрудника
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, position, email, phone } = req.body;

        if (!name || !position || !email) {
            res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
            return;
        }

        // Проверяем, существует ли email
        const emailCheck = await pool.query('SELECT id FROM employee WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            res.status(400).json({ message: 'Сотрудник с таким email уже существует' });
            return;
        }
        
        const result = await pool.query(
            'INSERT INTO employee (name, position, email, phone, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [name, position, email, phone]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error: any) {
        console.error('Ошибка при добавлении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка при добавлении сотрудника' });
    }
});

// Обновить сотрудника
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params['id']);
        const { name, position, email, phone } = req.body;

        if (!name || !position || !email) {
            res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
            return;
        }

        // Проверяем, существует ли сотрудник
        const employeeCheck = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
        if (employeeCheck.rows.length === 0) {
            res.status(404).json({ message: 'Сотрудник не найден' });
            return;
        }

        // Проверяем, существует ли email (исключая текущего сотрудника)
        const emailCheck = await pool.query('SELECT id FROM employee WHERE email = $1 AND id != $2', [email, id]);
        if (emailCheck.rows.length > 0) {
            res.status(400).json({ message: 'Сотрудник с таким email уже существует' });
            return;
        }
        
        const result = await pool.query(
            'UPDATE employee SET name = $1, position = $2, email = $3, phone = $4 WHERE id = $5 RETURNING *',
            [name, position, email, phone, id]
        );
        
        res.json(result.rows[0]);
    } catch (error: any) {
        console.error('Ошибка при обновлении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка при обновлении сотрудника' });
    }
});

// Удалить сотрудника
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params['id']);

        // Проверяем, существует ли сотрудник
        const employeeCheck = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
        if (employeeCheck.rows.length === 0) {
            res.status(404).json({ message: 'Сотрудник не найден' });
            return;
        }
        
        await pool.query('DELETE FROM employee WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error: any) {
        console.error('Ошибка при удалении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка при удалении сотрудника' });
    }
});

export default router; 