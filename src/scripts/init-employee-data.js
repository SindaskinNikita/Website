const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'NiceDbPassword',
    port: 5432,
    ssl: false
});

async function initEmployeeData() {
    try {
        console.log('Подключение к базе данных...');
        const client = await pool.connect();

        // Проверяем, есть ли уже данные
        const count = await client.query('SELECT COUNT(*) FROM employee');
        
        if (parseInt(count.rows[0].count) === 0) {
            console.log('Добавление тестовых сотрудников...');
            await client.query(`
                INSERT INTO employee (name, position, email, phone) VALUES
                ('Иванов Иван Иванович', 'Генеральный директор', 'ivanov@example.com', '+7 (999) 123-45-67'),
                ('Петрова Анна Сергеевна', 'Главный бухгалтер', 'petrova@example.com', '+7 (999) 234-56-78'),
                ('Сидоров Петр Николаевич', 'Менеджер по продажам', 'sidorov@example.com', '+7 (999) 345-67-89'),
                ('Козлова Мария Александровна', 'HR-менеджер', 'kozlova@example.com', '+7 (999) 456-78-90'),
                ('Морозов Дмитрий Павлович', 'Технический директор', 'morozov@example.com', '+7 (999) 567-89-01')
            `);
            console.log('Тестовые данные успешно добавлены!');
        } else {
            console.log('В таблице уже есть данные, пропускаем добавление...');
        }

        client.release();
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при добавлении данных:', error);
        process.exit(1);
    }
}

initEmployeeData(); 