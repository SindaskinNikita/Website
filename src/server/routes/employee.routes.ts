import express, { Request, Response, Router } from 'express';
import { PostgresDataSource } from '../database/database.config';
import { Employee } from '../entities/Employee';

const router: Router = express.Router();

interface ParamsWithId {
    id: string;
}

// Получить всех сотрудников
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Начинаем получение сотрудников...');
        const employeeRepository = PostgresDataSource.getRepository(Employee);
        const employees = await employeeRepository.find({
            order: {
                id: 'ASC'
            }
        });
        
        console.log('Получены сотрудники:', employees);
        res.json(employees);
    } catch (error: any) {
        console.error('Ошибка при получении сотрудников:', error);
        res.status(500).json({ message: 'Ошибка при получении списка сотрудников' });
    }
});

// Получить сотрудника по ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const employeeRepository = PostgresDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({
            where: { id: parseInt(req.params['id']) }
        });
        
        if (!employee) {
            res.status(404).json({ message: 'Сотрудник не найден' });
            return;
        }
        
        res.json(employee);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Проверка существования email
const checkEmailExists = async (email: string, excludeId?: number): Promise<boolean> => {
    const employeeRepository = PostgresDataSource.getRepository(Employee);
    const query = employeeRepository.createQueryBuilder('employee')
        .where('employee.email = :email', { email });
    
    if (excludeId) {
        query.andWhere('employee.id != :id', { id: excludeId });
    }
    
    const count = await query.getCount();
    return count > 0;
};

// Добавить сотрудника
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, position, email, phone } = req.body;

        if (!name || !position || !email) {
            res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
            return;
        }

        const employeeRepository = PostgresDataSource.getRepository(Employee);
        
        // Проверяем, существует ли email
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
            res.status(400).json({ message: 'Сотрудник с таким email уже существует' });
            return;
        }
        
        const employee = employeeRepository.create({ name, position, email, phone });
        const result = await employeeRepository.save(employee);
        res.status(201).json(result);
    } catch (error: any) {
        console.error('Ошибка при добавлении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка при добавлении сотрудника' });
    }
});

// Обновить сотрудника
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, position, email, phone } = req.body;

        if (!name || !position || !email) {
            res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
            return;
        }

        const employeeRepository = PostgresDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({
            where: { id: parseInt(id) }
        });
        
        if (!employee) {
            res.status(404).json({ message: 'Сотрудник не найден' });
            return;
        }
        
        // Проверяем, существует ли email (исключая текущего сотрудника)
        if (email && email !== employee.email) {
            const emailExists = await checkEmailExists(email, employee.id);
            if (emailExists) {
                res.status(400).json({ message: 'Сотрудник с таким email уже существует' });
                return;
            }
        }
        
        employeeRepository.merge(employee, { name, position, email, phone });
        const result = await employeeRepository.save(employee);
        res.json(result);
    } catch (error: any) {
        console.error('Ошибка при обновлении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка при обновлении сотрудника' });
    }
});

// Удалить сотрудника
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const employeeRepository = PostgresDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({
            where: { id: parseInt(id) }
        });
        
        if (!employee) {
            res.status(404).json({ message: 'Сотрудник не найден' });
            return;
        }
        
        await employeeRepository.remove(employee);
        res.status(204).send();
    } catch (error: any) {
        console.error('Ошибка при удалении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка при удалении сотрудника' });
    }
});

export default router; 