import express from 'express'
import cors from 'cors'
import employeeSimpleRoutes from './routes/employee-simple.routes'
import authSimpleRoutes from './routes/auth-simple.routes'

const app = express()
const port = process.env['PORT'] || 3000

app.use(cors())
app.use(express.json())

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body)
    next()
})

// Регистрируем маршруты
app.use('/api/auth', authSimpleRoutes)
app.use('/api/employees', employeeSimpleRoutes)

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`)
    console.log('Доступные маршруты:')
    console.log('- POST /api/auth/login - авторизация')
    console.log('- GET /api/auth/verify - проверка токена')
    console.log('- GET /api/employees - получить всех сотрудников')
    console.log('- GET /api/employees/:id - получить сотрудника по ID')
    console.log('- POST /api/employees - добавить сотрудника')
    console.log('- PUT /api/employees/:id - обновить сотрудника')
    console.log('- DELETE /api/employees/:id - удалить сотрудника')
})
