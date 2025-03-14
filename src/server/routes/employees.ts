import { Router } from 'express'
import { Employee } from '../entities/Employee'
import { AppDataSource } from '../database/database'

const router = Router()

// Получить всех сотрудников
router.get('/', async (req, res) => {
    try {
        const employees = await AppDataSource.getRepository(Employee).find()
        res.json(employees)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

// Добавить сотрудника
router.post('/', async (req, res) => {
    try {
        const employee = AppDataSource.getRepository(Employee).create(req.body)
        const results = await AppDataSource.getRepository(Employee).save(employee)
        res.json(results)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
})

export default router