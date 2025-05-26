const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
app.use(cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// ==================== МАРШРУТЫ АВТОРИЗАЦИИ ====================

// Авторизация
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Попытка входа:', { username });

        if (!username || !password) {
            return res.status(400).json({ message: 'Необходимо указать имя пользователя и пароль' });
        }

        // Ищем пользователя в базе данных
        const result = await pool.query(
            'SELECT id, username, email, password_hash, role FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            console.log('Пользователь не найден:', username);
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }

        const user = result.rows[0];
        console.log('Пользователь найден:', {
            id: user.id,
            username: user.username,
            role: user.role,
            hasPasswordHash: !!user.password_hash
        });

        // Проверяем хеш пароля
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        console.log('Проверка пароля:', isValidPassword);

        if (!isValidPassword) {
            console.log('Неверный пароль для пользователя:', username);
            return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
        }

        // Создаем токен
        const token = jwt.sign(
            { 
                id: user.id,
                userId: user.id, // для совместимости
                username: user.username,
                email: user.email,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Сохраняем токен в базе данных
        await pool.query(
            'UPDATE users SET token = $1 WHERE id = $2',
            [token, user.id]
        );

        console.log('Успешная авторизация:', username);

        // Возвращаем данные пользователя
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token
        });
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Проверка токена
app.get('/api/auth/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Отсутствует токен' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Декодированный токен:', decoded);

        // Проверяем пользователя в базе данных
        const result = await pool.query(
            'SELECT id, username, email, role FROM users WHERE id = $1 AND token = $2',
            [decoded.id || decoded.userId, token]
        );

        if (result.rows.length === 0) {
            console.log('Пользователь не найден или токен недействителен');
            return res.status(401).json({ message: 'Недействительный токен' });
        }

        const user = result.rows[0];
        console.log('Токен проверен для пользователя:', user.username);

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        res.status(401).json({ message: 'Недействительный токен' });
    }
});

// ==================== МАРШРУТЫ СОТРУДНИКОВ ====================

// Получить всех сотрудников
app.get('/api/employees', async (req, res) => {
    try {
        console.log('Получение списка сотрудников...');
        const result = await pool.query('SELECT * FROM employee ORDER BY id ASC');
        console.log(`Найдено ${result.rows.length} сотрудников`);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении сотрудников:', error);
        res.status(500).json({ message: 'Ошибка при получении списка сотрудников' });
    }
});

// Получить сотрудника по ID
app.get('/api/employees/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при получении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка при получении сотрудника' });
    }
});

// Добавить сотрудника
app.post('/api/employees', async (req, res) => {
    try {
        const { name, position, email, phone } = req.body;

        if (!name || !position || !email) {
            return res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
        }

        // Проверяем, существует ли email
        const emailCheck = await pool.query('SELECT id FROM employee WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Сотрудник с таким email уже существует' });
        }
        
        const result = await pool.query(
            'INSERT INTO employee (name, position, email, phone, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [name, position, email, phone]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при добавлении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка при добавлении сотрудника' });
    }
});

// Обновить сотрудника
app.put('/api/employees/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, position, email, phone } = req.body;

        if (!name || !position || !email) {
            return res.status(400).json({ message: 'Необходимо заполнить все обязательные поля' });
        }

        // Проверяем, существует ли сотрудник
        const employeeCheck = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
        if (employeeCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }

        // Проверяем, существует ли email (исключая текущего сотрудника)
        const emailCheck = await pool.query('SELECT id FROM employee WHERE email = $1 AND id != $2', [email, id]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Сотрудник с таким email уже существует' });
        }
        
        const result = await pool.query(
            'UPDATE employee SET name = $1, position = $2, email = $3, phone = $4 WHERE id = $5 RETURNING *',
            [name, position, email, phone, id]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при обновлении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка при обновлении сотрудника' });
    }
});

// Удалить сотрудника
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Проверяем, существует ли сотрудник
        const employeeCheck = await pool.query('SELECT * FROM employee WHERE id = $1', [id]);
        if (employeeCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }
        
        await pool.query('DELETE FROM employee WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Ошибка при удалении сотрудника:', error);
        res.status(500).json({ message: 'Ошибка при удалении сотрудника' });
    }
});

// ==================== МАРШРУТЫ ОБЪЕКТОВ ====================

// Получить все объекты
app.get('/api/facilities', async (req, res) => {
    try {
        console.log('Получение списка объектов...');
        const result = await pool.query('SELECT * FROM facility ORDER BY id ASC');
        console.log(`Найдено ${result.rows.length} объектов`);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении объектов:', error);
        res.status(500).json({ message: 'Ошибка при получении списка объектов' });
    }
});

// Получить объект по ID
app.get('/api/facilities/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM facility WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Объект не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при получении объекта:', error);
        res.status(500).json({ message: 'Ошибка при получении объекта' });
    }
});

// ==================== МАРШРУТЫ ОБОРУДОВАНИЯ ====================

// Получить все оборудование
app.get('/api/equipment', async (req, res) => {
    try {
        console.log('Получение списка оборудования...');
        const result = await pool.query('SELECT * FROM equipment ORDER BY id ASC');
        console.log(`Найдено ${result.rows.length} единиц оборудования`);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении оборудования:', error);
        res.status(500).json({ message: 'Ошибка при получении списка оборудования' });
    }
});

// Получить оборудование по ID
app.get('/api/equipment/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM equipment WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Оборудование не найдено' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при получении оборудования:', error);
        res.status(500).json({ message: 'Ошибка при получении оборудования' });
    }
});

// ==================== МАРШРУТЫ НОВОСТЕЙ ====================

// Получить все новости
app.get('/api/news', async (req, res) => {
    try {
        console.log('Получение списка новостей...');
        const result = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
        console.log(`Найдено ${result.rows.length} новостей`);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении новостей:', error);
        res.status(500).json({ message: 'Ошибка при получении списка новостей' });
    }
});

// ==================== МАРШРУТЫ ОТЧЕТОВ ====================

// Получить все отчеты
app.get('/api/reports', async (req, res) => {
    try {
        console.log('Получение списка отчетов...');
        const result = await pool.query('SELECT * FROM report ORDER BY created_at DESC');
        console.log(`Найдено ${result.rows.length} отчетов`);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении отчетов:', error);
        res.status(500).json({ message: 'Ошибка при получении списка отчетов' });
    }
});

// ==================== МАРШРУТЫ РАСЧЕТОВ ====================

// Получить все расчеты
app.get('/api/calculations', async (req, res) => {
    try {
        console.log('Получение списка расчетов...');
        const result = await pool.query('SELECT * FROM calculation ORDER BY created_at DESC');
        console.log(`Найдено ${result.rows.length} расчетов`);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении расчетов:', error);
        res.status(500).json({ message: 'Ошибка при получении списка расчетов' });
    }
});

// ==================== МАРШРУТЫ ОТЗЫВОВ ====================

// Получить все отзывы
app.get('/api/reviews', async (req, res) => {
    try {
        console.log('Получение списка отзывов...');
        const result = await pool.query('SELECT * FROM review ORDER BY created_at DESC');
        console.log(`Найдено ${result.rows.length} отзывов`);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
        res.status(500).json({ message: 'Ошибка при получении списка отзывов' });
    }
});

// ==================== МАРШРУТЫ ОБРАТНОЙ СВЯЗИ ====================

// Получить всю обратную связь
app.get('/api/feedback', async (req, res) => {
    try {
        console.log('Получение списка обратной связи...');
        const result = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
        console.log(`Найдено ${result.rows.length} сообщений обратной связи`);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении обратной связи:', error);
        res.status(500).json({ message: 'Ошибка при получении списка обратной связи' });
    }
});

// ==================== МАРШРУТЫ НАСТРОЕК ====================

// Получить все настройки
app.get('/api/settings', async (req, res) => {
    try {
        console.log('Получение списка настроек...');
        const result = await pool.query('SELECT * FROM setting ORDER BY category, key');
        console.log(`Найдено ${result.rows.length} настроек`);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении настроек:', error);
        res.status(500).json({ message: 'Ошибка при получении списка настроек' });
    }
});

// ==================== ЗАПУСК СЕРВЕРА ====================

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
    console.log('Доступные маршруты:');
    console.log('- POST /api/auth/login - авторизация');
    console.log('- GET /api/auth/verify - проверка токена');
    console.log('- GET /api/employees - получить всех сотрудников');
    console.log('- GET /api/employees/:id - получить сотрудника по ID');
    console.log('- POST /api/employees - добавить сотрудника');
    console.log('- PUT /api/employees/:id - обновить сотрудника');
    console.log('- DELETE /api/employees/:id - удалить сотрудника');
    console.log('- GET /api/facilities - получить все объекты');
    console.log('- GET /api/facilities/:id - получить объект по ID');
    console.log('- GET /api/equipment - получить все оборудование');
    console.log('- GET /api/equipment/:id - получить оборудование по ID');
    console.log('- GET /api/news - получить все новости');
    console.log('- GET /api/reports - получить все отчеты');
    console.log('- GET /api/calculations - получить все расчеты');
    console.log('- GET /api/reviews - получить все отзывы');
    console.log('- GET /api/feedback - получить всю обратную связь');
    console.log('- GET /api/settings - получить все настройки');
}); 