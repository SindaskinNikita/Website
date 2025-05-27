import express from 'express';
import cors from 'cors';
import { PostgresDataSource } from './database/database.config';
import employeeRoutes from './routes/employee.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к БД
PostgresDataSource.initialize()
    .then(() => {
        console.log("Connected to PostgreSQL database!");
    })
    .catch((error) => {
        console.log("PostgreSQL connection failed!", error);
    });

// Роуты
app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 