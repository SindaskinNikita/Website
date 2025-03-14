import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { dbConfig } from './config/db.config';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к БД
mongoose.connect(dbConfig.url)
    .then(() => {
        console.log("Connected to database!");
    })
    .catch((error) => {
        console.log("Connection failed!", error);
    });

// Роуты
app.use('/api/employees', require('./routes/employee.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 