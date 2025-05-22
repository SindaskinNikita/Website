const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

// Настройки подключения к БД
const pool = new Pool({
    user: 'postgres',          
    password: 'NiceDbPassword',  
    host: 'localhost',         
    port: 5432,                
    database: 'postgres',      
    ssl: false                 
});

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-should-be-long-and-secure';

// Middleware
app.use(cors());
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// Маршрут для аутентификации
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Попытка входа:', { username });

        if (!username || !password) {
            console.log('Отсутствуют имя пользователя или пароль');
            return res.status(400).json({ message: 'Требуются имя пользователя и пароль' });
        }

        // Поиск пользователя
        const result = await pool.query(
            'SELECT id, username, email, password, role FROM users WHERE username = $1',
            [username]
        );

        if (result.rowCount === 0) {
            console.log('Пользователь не найден в БД');
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }

        const user = result.rows[0];
        console.log('Пользователь найден:', {
            id: user.id,
            username: user.username,
            role: user.role
        });

        // Сравниваем пароли
        const passwordStr = String(password).trim();
        const dbPasswordStr = String(user.password).trim();
        const isValidPassword = passwordStr === dbPasswordStr;

        console.log('Проверка пароля:', {
            введенныйПароль: passwordStr,
            парольВБД: dbPasswordStr,
            результат: isValidPassword
        });

        if (!isValidPassword) {
            console.log('Неверный пароль');
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }

        // Создаем JWT токен
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Обновляем токен в базе данных
        await pool.query(
            'UPDATE users SET token = $1 WHERE id = $2',
            [token, user.id]
        );

        console.log('Успешный вход:', user.username);

        // Отправляем данные пользователя
        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        console.error('Ошибка при аутентификации:', error);
        return res.status(500).json({ message: 'Ошибка сервера при аутентификации' });
    }
});

// Маршрут для проверки токена
app.get('/api/auth/verify', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        const token = authHeader.split(' ')[1];

        // Проверяем токен
        const decoded = jwt.verify(token, JWT_SECRET);

        // Проверяем, существует ли пользователь с таким токеном
        const result = await pool.query(
            'SELECT id, username, email, role FROM users WHERE id = $1 AND token = $2',
            [decoded.id, token]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ message: 'Токен недействителен' });
        }

        const user = result.rows[0];

        // Отправляем данные пользователя
        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        return res.status(401).json({ message: 'Недействительный токен' });
    }
});

// Маршрут для выхода
app.post('/api/auth/logout', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        // Очищаем токен пользователя в БД
        await pool.query(
            'UPDATE users SET token = NULL WHERE id = $1',
            [decoded.id]
        );

        return res.json({ message: 'Выход успешен' });
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        return res.status(500).json({ message: 'Ошибка сервера при выходе' });
    }
});

// Маршруты для сотрудников
app.get('/api/employees', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, position, email, phone, created_at FROM employees'
        );

        console.log('Получены данные о сотрудниках:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении данных о сотрудниках:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении данных о сотрудниках' });
    }
});

app.get('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT id, name, position, email, phone, created_at FROM employees WHERE id = $1',
            [id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при получении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении сотрудника' });
    }
});

app.post('/api/employees', async (req, res) => {
    try {
        const { name, position, email, phone } = req.body;
        
        if (!name || !position || !email || !phone) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }
        
        const result = await pool.query(
            'INSERT INTO employees (name, position, email, phone, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, position, email, phone, created_at',
            [name, position, email, phone]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при создании сотрудника:', error);
        res.status(500).json({ message: 'Ошибка сервера при создании сотрудника' });
    }
});

app.put('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, position, email, phone } = req.body;
        
        const result = await pool.query(
            'UPDATE employees SET name = $1, position = $2, email = $3, phone = $4 WHERE id = $5 RETURNING id, name, position, email, phone, created_at',
            [name, position, email, phone, id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при обновлении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка сервера при обновлении сотрудника' });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error('Ошибка при удалении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка сервера при удалении сотрудника' });
    }
});

// Маршруты для объектов
app.get('/api/facilities', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, address, type, status, cost FROM facilities'
        );

        console.log('Получены данные об объектах:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении данных об объектах:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении данных об объектах' });
    }
});

app.get('/api/facilities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT id, name, address, type, status, cost FROM facilities WHERE id = $1',
            [id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Объект не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при получении объекта:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении объекта' });
    }
});

app.post('/api/facilities', async (req, res) => {
    try {
        const { name, address, type, status, cost } = req.body;
        
        if (!name || !address || !type) {
            return res.status(400).json({ message: 'Основные поля обязательны' });
        }
        
        const result = await pool.query(
            'INSERT INTO facilities (name, address, type, status, cost) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, address, type, status, cost',
            [name, address, type, status || 'active', cost || 0]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при создании объекта:', error);
        res.status(500).json({ message: 'Ошибка сервера при создании объекта' });
    }
});

app.put('/api/facilities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, type, status, cost } = req.body;
        
        const result = await pool.query(
            'UPDATE facilities SET name = $1, address = $2, type = $3, status = $4, cost = $5 WHERE id = $6 RETURNING id, name, address, type, status, cost',
            [name, address, type, status, cost, id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Объект не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при обновлении объекта:', error);
        res.status(500).json({ message: 'Ошибка сервера при обновлении объекта' });
    }
});

app.delete('/api/facilities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM facilities WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Объект не найден' });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error('Ошибка при удалении объекта:', error);
        res.status(500).json({ message: 'Ошибка сервера при удалении объекта' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
    
    // Проверяем подключение к БД
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Ошибка подключения к базе данных:', err);
        } else {
            console.log('Подключение к базе данных установлено:', res.rows[0]);
        }
    });
}); 