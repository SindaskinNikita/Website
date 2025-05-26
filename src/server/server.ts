import express from 'express'
import cors from 'cors'
import { PostgresDataSource } from './database/database.config'
import employeeRoutes from './routes/employee.routes'
import facilityRoutes from './routes/facility.routes'
import authRoutes from './routes/auth.routes'
import feedbackRoutes from './routes/feedback.routes'
import equipmentRoutes from './routes/equipment.routes'

const app = express()
const port = process.env['PORT'] || 3000

app.use(cors())
app.use(express.json())

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body)
    next()
})

// Инициализация подключения к базе данных
PostgresDataSource.initialize()
    .then(() => {
        console.log('Подключение к базе данных установлено')
        
        // Регистрируем маршруты только после успешного подключения к БД
        app.use('/api/employees', employeeRoutes)
        app.use('/api/facilities', facilityRoutes)
        app.use('/api/auth', authRoutes)
        app.use('/api/feedback', feedbackRoutes)
        app.use('/api/equipment', equipmentRoutes)
        
        app.listen(port, () => {
            console.log(`Сервер запущен на порту ${port}`)
        })
    })
    .catch((error) => {
        console.error('Ошибка при подключении к базе данных:', error)
    })
