import { Router, Request, Response, RequestHandler } from 'express';
import { PostgresDataSource } from '../database/database.config';
import { Employee } from '../entities/Employee';

const router = Router();

interface ParamsWithId {
    id: string;
}

// Получить всех сотрудников
const getAllEmployees: RequestHandler = async (_req, res) => {
    try {
        console.log('Начинаем получение сотрудников...');
        const employeeRepository = PostgresDataSource.getRepository(Employee);

        // Получаем данные прямым SQL-запросом
        const employees = await employeeRepository.query(`
            SELECT 
                id,
                name,
                position,
                email,
                phone,
                created_at
            FROM employee 
            ORDER BY id;
        `);
        console.log('Данные из таблицы:', employees);
        
        res.json(employees);
    } catch (error: any) {
        console.error('Ошибка при получении сотрудников:', error);
        res.status(500).json({ message: error.message });
    }
};

// Получить сотрудника по ID
const getEmployeeById: RequestHandler<ParamsWithId> = async (req, res) => {
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
};

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
const createEmployee: RequestHandler = async (req, res) => {
    try {
        const employeeRepository = PostgresDataSource.getRepository(Employee);
        
        // Проверяем, существует ли email
        const emailExists = await checkEmailExists(req.body.email);
        if (emailExists) {
            res.status(400).json({ message: 'Сотрудник с таким email уже существует' });
            return;
        }
        
        const employee = employeeRepository.create(req.body);
        const result = await employeeRepository.save(employee);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Обновить сотрудника
const updateEmployee: RequestHandler<ParamsWithId> = async (req, res) => {
    try {
        const employeeRepository = PostgresDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({
            where: { id: parseInt(req.params['id']) }
        });
        
        if (!employee) {
            res.status(404).json({ message: 'Сотрудник не найден' });
            return;
        }
        
        // Проверяем, существует ли email (исключая текущего сотрудника)
        if (req.body.email && req.body.email !== employee.email) {
            const emailExists = await checkEmailExists(req.body.email, employee.id);
            if (emailExists) {
                res.status(400).json({ message: 'Сотрудник с таким email уже существует' });
                return;
            }
        }
        
        employeeRepository.merge(employee, req.body);
        const result = await employeeRepository.save(employee);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Удалить сотрудника
const deleteEmployee: RequestHandler<ParamsWithId> = async (req, res) => {
    try {
        const employeeRepository = PostgresDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({
            where: { id: parseInt(req.params['id']) }
        });
        
        if (!employee) {
            res.status(404).json({ message: 'Сотрудник не найден' });
            return;
        }
        
        await employeeRepository.remove(employee);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router; 