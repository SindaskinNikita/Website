import express from 'express'
import cors from 'cors'
import { AppDataSource } from './database/database'
import employeeRoutes from './routes/employees'
import facilityRoutes from './routes/facilities'

const app = express()

app.use(cors())
app.use(express.json())

// Инициализация базы данных
AppDataSource.initialize()
    .then(() => {
        console.log("База данных успешно инициализирована")
    })
    .catch((error) => {
        console.error("Ошибка при инициализации базы данных:", error)
    })

// Роуты
app.use('/api/employees', employeeRoutes)
app.use('/api/facilities', facilityRoutes)

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
})
