const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'NiceDbPassword',
    port: 5432,
    ssl: false
});

async function initEquipmentTable() {
    try {
        console.log('Подключение к базе данных...');
        const client = await pool.connect();

        // Создаем таблицу оборудования
        console.log('Создание таблицы equipment...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS equipment (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(100) NOT NULL,
                status VARCHAR(50) NOT NULL,
                inventory_number VARCHAR(50) UNIQUE NOT NULL,
                purchase_date DATE,
                last_maintenance_date DATE,
                next_maintenance_date DATE,
                responsible_person VARCHAR(255),
                location VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Проверяем, есть ли уже данные
        const count = await client.query('SELECT COUNT(*) FROM equipment');
        
        if (parseInt(count.rows[0].count) === 0) {
            console.log('Добавление тестовых данных...');
            await client.query(`
                INSERT INTO equipment (
                    name, 
                    type, 
                    status, 
                    inventory_number, 
                    purchase_date, 
                    last_maintenance_date, 
                    next_maintenance_date, 
                    responsible_person,
                    location
                ) VALUES
                ('Сервер Dell PowerEdge R740', 'Серверное оборудование', 'В работе', 'SRV-001', '2024-01-15', '2025-04-15', '2025-07-15', 'Новиков Артем Игоревич', 'Серверная комната 101'),
                ('Коммутатор Cisco Catalyst 9300', 'Сетевое оборудование', 'В работе', 'NET-001', '2024-02-01', '2025-04-10', '2025-07-10', 'Новиков Артем Игоревич', 'Серверная комната 101'),
                ('Принтер HP LaserJet Pro M404dn', 'Периферийное оборудование', 'Требует обслуживания', 'PRN-001', '2024-01-20', '2025-03-20', '2025-06-20', 'Волков Андрей Николаевич', 'Офис 202'),
                ('ИБП APC Smart-UPS 3000VA', 'Электрооборудование', 'В работе', 'UPS-001', '2024-01-10', '2025-04-01', '2025-07-01', 'Новиков Артем Игоревич', 'Серверная комната 101'),
                ('Система видеонаблюдения Hikvision', 'Системы безопасности', 'В работе', 'SEC-001', '2024-02-15', '2025-04-15', '2025-07-15', 'Волков Андрей Николаевич', 'Пост охраны'),
                ('Кондиционер Daikin FTXS35K', 'Климатическое оборудование', 'В работе', 'AC-001', '2024-01-25', '2025-04-25', '2025-07-25', 'Волков Андрей Николаевич', 'Серверная комната 101'),
                ('МФУ Xerox WorkCentre 6515', 'Периферийное оборудование', 'В ремонте', 'PRN-002', '2024-02-10', '2025-03-10', '2025-06-10', 'Волков Андрей Николаевич', 'Офис 305'),
                ('Маршрутизатор Mikrotik CCR1036', 'Сетевое оборудование', 'В работе', 'NET-002', '2024-01-30', '2025-04-30', '2025-07-30', 'Новиков Артем Игоревич', 'Серверная комната 101'),
                ('Система контроля доступа СКУД', 'Системы безопасности', 'В работе', 'SEC-002', '2024-02-20', '2025-04-20', '2025-07-20', 'Волков Андрей Николаевич', 'Главный вход'),
                ('Сетевое хранилище Synology RS820+', 'Серверное оборудование', 'В работе', 'SRV-002', '2024-02-05', '2025-04-05', '2025-07-05', 'Новиков Артем Игоревич', 'Серверная комната 101')
            `);
            console.log('Тестовые данные успешно добавлены!');
        } else {
            console.log('В таблице уже есть данные, пропускаем добавление...');
        }

        client.release();
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при инициализации таблицы:', error);
        process.exit(1);
    }
}

initEquipmentTable(); 