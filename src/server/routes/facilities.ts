import { Router } from 'express'
import { Facility } from '../entities/Facility'
import { AppDataSource } from '../database/database'

const router = Router()

// Получить все объекты
router.get('/', async (req, res) => {
    try {
        const facilities = await AppDataSource.getRepository(Facility).find()
        res.json(facilities)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
})

// Добавить объект
router.post('/', async (req, res) => {
    try {
        const facility = AppDataSource.getRepository(Facility).create(req.body)
        const results = await AppDataSource.getRepository(Facility).save(facility)
        res.json(results)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
})

export default router 