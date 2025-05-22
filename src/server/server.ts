import express from 'express'
import cors from 'cors'
import { PostgresDataSource } from './database/database.config'
import employeeRoutes from './routes/employee.routes'
import facilityRoutes from './routes/facility.routes'
import authRoutes from './routes/auth.routes'

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
    })
    .catch((error) => {
        console.error('Ошибка при подключении к базе данных:', error)
    })

// Маршруты
app.use('/api/employees', employeeRoutes)
app.use('/api/facilities', facilityRoutes)
app.use('/api/auth', authRoutes)

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`)
})
