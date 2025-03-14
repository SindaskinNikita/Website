import express from 'express';
import { Employee } from '../models/employee.model';

const router = express.Router();

// Получить всех сотрудников
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Добавить сотрудника
router.post('/', async (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        position: req.body.position,
        location: req.body.location,
        status: req.body.status
    });

    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router; 