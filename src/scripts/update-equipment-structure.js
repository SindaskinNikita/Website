const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'NiceDbPassword',
    port: 5432,
    ssl: false
});

async function updateEquipmentStructure() {
    try {
        console.log('Подключение к базе данных...');
        const client = await pool.connect();

        // Удаляем старую таблицу
        await client.query('DROP TABLE IF EXISTS equipment');

        // Создаем таблицу с новой структурой
        console.log('Создание таблицы equipment с новой структурой...');
        await client.query(`
            CREATE TABLE equipment (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(100) NOT NULL,
                location VARCHAR(255) NOT NULL,
                status VARCHAR(50) NOT NULL,
                last_maintenance_date DATE NOT NULL,
                next_maintenance_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Добавляем новые данные
        console.log('Добавление актуальных данных...');
        await client.query(`
            INSERT INTO equipment (
                name,
                type,
                location,
                status,
                last_maintenance_date,
                next_maintenance_date
            ) VALUES
            ('Кондиционер', 'Климатическое оборудование', 'Главный офис', 'Исправно', '2024-02-15', '2024-05-15'),
            ('Сервер', 'IT оборудование', 'Дата-центр', 'Исправно', '2024-01-20', '2024-04-20'),
            ('Система видеонаблюдения', 'Охранное оборудование', 'Главный офис', 'Исправно', '2024-02-01', '2024-05-01'),
            ('Система контроля доступа', 'Охранное оборудование', 'Главный вход', 'Исправно', '2024-02-10', '2024-05-10'),
            ('ИБП', 'IT оборудование', 'Дата-центр', 'Требует обслуживания', '2023-12-15', '2024-03-15'),
            ('Принтер', 'Офисное оборудование', 'Офис 101', 'Исправно', '2024-02-05', '2024-05-05'),
            ('Маршрутизатор', 'Сетевое оборудование', 'Серверная', 'Исправно', '2024-01-25', '2024-04-25'),
            ('Система пожаротушения', 'Противопожарное оборудование', 'Дата-центр', 'Исправно', '2024-02-20', '2024-05-20')
        `);

        console.log('Структура и данные успешно обновлены!');
        
        client.release();
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при обновлении структуры:', error);
        process.exit(1);
    }
}

updateEquipmentStructure(); 