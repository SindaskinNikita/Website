import { Request, Response } from 'express';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    password: 'NiceDbPassword',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    ssl: false
});

// Компании
export const getCompanies = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM companies ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении списка компаний:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const addCompany = async (req: Request, res: Response) => {
    const { name, description, founded_year, website } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO companies (name, description, founded_year, website) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, founded_year, website]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при добавлении компании:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const updateCompany = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, founded_year, website } = req.body;
    try {
        const result = await pool.query(
            'UPDATE companies SET name = $1, description = $2, founded_year = $3, website = $4 WHERE id = $5 RETURNING *',
            [name, description, founded_year, website, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Компания не найдена' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при обновлении компании:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const deleteCompany = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM companies WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Компания не найдена' });
        }
        res.json({ message: 'Компания успешно удалена' });
    } catch (error) {
        console.error('Ошибка при удалении компании:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Оборудование
export const getEquipment = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM equipment ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении списка оборудования:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const addEquipment = async (req: Request, res: Response) => {
    const { name, type, description, purchase_date, status, company_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO equipment (name, type, description, purchase_date, status, company_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, type, description, purchase_date, status, company_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при добавлении оборудования:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const updateEquipment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, type, description, purchase_date, status, company_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE equipment SET name = $1, type = $2, description = $3, purchase_date = $4, status = $5, company_id = $6 WHERE id = $7 RETURNING *',
            [name, type, description, purchase_date, status, company_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Оборудование не найдено' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при обновлении оборудования:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const deleteEquipment = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM equipment WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Оборудование не найдено' });
        }
        res.json({ message: 'Оборудование успешно удалено' });
    } catch (error) {
        console.error('Ошибка при удалении оборудования:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Услуги
export const getServices = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM services ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении списка услуг:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const addService = async (req: Request, res: Response) => {
    const { name, description, price, duration } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, duration]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при добавлении услуги:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const updateService = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, duration } = req.body;
    try {
        const result = await pool.query(
            'UPDATE services SET name = $1, description = $2, price = $3, duration = $4 WHERE id = $5 RETURNING *',
            [name, description, price, duration, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Услуга не найдена' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при обновлении услуги:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const deleteService = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Услуга не найдена' });
        }
        res.json({ message: 'Услуга успешно удалена' });
    } catch (error) {
        console.error('Ошибка при удалении услуги:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Контакты
export const getContacts = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM contacts ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении списка контактов:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const addContact = async (req: Request, res: Response) => {
    const { name, email, phone, position, company_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO contacts (name, email, phone, position, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, phone, position, company_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при добавлении контакта:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const updateContact = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phone, position, company_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE contacts SET name = $1, email = $2, phone = $3, position = $4, company_id = $5 WHERE id = $6 RETURNING *',
            [name, email, phone, position, company_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Контакт не найден' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при обновлении контакта:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const deleteContact = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Контакт не найден' });
        }
        res.json({ message: 'Контакт успешно удален' });
    } catch (error) {
        console.error('Ошибка при удалении контакта:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
}; 