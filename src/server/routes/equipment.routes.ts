import express, { Request, Response, Router } from 'express';
import { PostgresDataSource } from '../database/database.config';

const router: Router = express.Router();

// Получить все оборудование
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Начинаем получение списка оборудования...');
        const result = await PostgresDataSource.query(`
            SELECT 
                id,
                name,
                type,
                status,
                inventory_number,
                purchase_date,
                last_maintenance_date,
                next_maintenance_date,
                responsible_person,
                location,
                created_at
            FROM equipment 
            ORDER BY id
        `);
        
        console.log('Получены данные оборудования:', result);
        res.json(result);
    } catch (error) {
        console.error('Ошибка при получении списка оборудования:', error);
        res.status(500).json({ message: 'Ошибка при получении списка оборудования' });
    }
});

// Получить оборудование по ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = await PostgresDataSource.query(
            'SELECT * FROM equipment WHERE id = $1',
            [id]
        );

        if (result.length === 0) {
            res.status(404).json({ message: 'Оборудование не найдено' });
            return;
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Ошибка при получении оборудования:', error);
        res.status(500).json({ message: 'Ошибка при получении оборудования' });
    }
});

// Добавить новое оборудование
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            type,
            status,
            inventory_number,
            purchase_date,
            last_maintenance_date,
            next_maintenance_date,
            responsible_person,
            location
        } = req.body;

        // Проверка обязательных полей
        if (!name || !type || !status || !inventory_number) {
            res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
            return;
        }

        // Проверка уникальности инвентарного номера
        const existing = await PostgresDataSource.query(
            'SELECT id FROM equipment WHERE inventory_number = $1',
            [inventory_number]
        );

        if (existing.length > 0) {
            res.status(400).json({ message: 'Оборудование с таким инвентарным номером уже существует' });
            return;
        }

        const result = await PostgresDataSource.query(`
            INSERT INTO equipment (
                name,
                type,
                status,
                inventory_number,
                purchase_date,
                last_maintenance_date,
                next_maintenance_date,
                responsible_person,
                location
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [
            name,
            type,
            status,
            inventory_number,
            purchase_date,
            last_maintenance_date,
            next_maintenance_date,
            responsible_person,
            location
        ]);

        res.status(201).json(result[0]);
    } catch (error) {
        console.error('Ошибка при добавлении оборудования:', error);
        res.status(500).json({ message: 'Ошибка при добавлении оборудования' });
    }
});

// Обновить оборудование
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const {
            name,
            type,
            status,
            inventory_number,
            purchase_date,
            last_maintenance_date,
            next_maintenance_date,
            responsible_person,
            location
        } = req.body;

        // Проверка обязательных полей
        if (!name || !type || !status || !inventory_number) {
            res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
            return;
        }

        // Проверка существования оборудования
        const existing = await PostgresDataSource.query(
            'SELECT id FROM equipment WHERE id = $1',
            [id]
        );

        if (existing.length === 0) {
            res.status(404).json({ message: 'Оборудование не найдено' });
            return;
        }

        // Проверка уникальности инвентарного номера
        const duplicateCheck = await PostgresDataSource.query(
            'SELECT id FROM equipment WHERE inventory_number = $1 AND id != $2',
            [inventory_number, id]
        );

        if (duplicateCheck.length > 0) {
            res.status(400).json({ message: 'Оборудование с таким инвентарным номером уже существует' });
            return;
        }

        const result = await PostgresDataSource.query(`
            UPDATE equipment SET
                name = $1,
                type = $2,
                status = $3,
                inventory_number = $4,
                purchase_date = $5,
                last_maintenance_date = $6,
                next_maintenance_date = $7,
                responsible_person = $8,
                location = $9
            WHERE id = $10
            RETURNING *
        `, [
            name,
            type,
            status,
            inventory_number,
            purchase_date,
            last_maintenance_date,
            next_maintenance_date,
            responsible_person,
            location,
            id
        ]);

        res.json(result[0]);
    } catch (error) {
        console.error('Ошибка при обновлении оборудования:', error);
        res.status(500).json({ message: 'Ошибка при обновлении оборудования' });
    }
});

// Удалить оборудование
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Проверка существования оборудования
        const existing = await PostgresDataSource.query(
            'SELECT id FROM equipment WHERE id = $1',
            [id]
        );

        if (existing.length === 0) {
            res.status(404).json({ message: 'Оборудование не найдено' });
            return;
        }

        await PostgresDataSource.query(
            'DELETE FROM equipment WHERE id = $1',
            [id]
        );

        res.status(204).send();
    } catch (error) {
        console.error('Ошибка при удалении оборудования:', error);
        res.status(500).json({ message: 'Ошибка при удалении оборудования' });
    }
});

export default router; 