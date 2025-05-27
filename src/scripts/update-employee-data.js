const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'NiceDbPassword',
    port: 5432,
    ssl: false
});

async function updateEmployeeData() {
    try {
        console.log('Подключение к базе данных...');
        const client = await pool.connect();

        // Сначала удалим все существующие записи
        await client.query('TRUNCATE TABLE employee RESTART IDENTITY');

        console.log('Добавление актуальных данных сотрудников...');
        await client.query(`
            INSERT INTO employee (name, position, email, phone, created_at) VALUES
            ('Иванов Иван Иванович', 'Генеральный директор', 'ivanov@example.com', '+7 (999) 123-45-67', '2025-05-24 15:15:30.962'),
            ('Петров Петр Петрович', 'Финансовый директор', 'petrov@example.com', '+7 (999) 234-56-78', '2025-05-24 15:15:30.962'),
            ('Сидорова Анна Владимировна', 'HR-менеджер', 'sidorova@example.com', '+7 (999) 345-67-89', '2025-05-24 15:15:30.962'),
            ('Козлов Дмитрий Сергеевич', 'Технический директор', 'kozlov@example.com', '+7 (999) 456-78-90', '2025-05-24 15:15:30.962'),
            ('Морозова Елена Александровна', 'Бухгалтер', 'morozova@example.com', '+7 (999) 567-89-01', '2025-05-24 15:15:30.962'),
            ('Новиков Артем Игоревич', 'Системный администратор', 'novikov@example.com', '+7 (999) 678-90-12', '2025-05-24 15:15:30.962'),
            ('Федорова Мария Павловна', 'Менеджер по продажам', 'fedorova@example.com', '+7 (999) 789-01-23', '2025-05-24 15:15:30.962'),
            ('Волков Андрей Николаевич', 'Инженер', 'volkov@example.com', '+7 (999) 890-12-34', '2025-05-24 15:15:30.962'),
            ('Соколова Ольга Дмитриевна', 'Юрист', 'sokolova@example.com', '+7 (999) 901-23-45', '2025-05-24 15:15:30.962'),
            ('Михайлов Сергей Александрович', 'Менеджер проектов', 'mikhailov@example.com', '+7 (999) 012-34-56', '2025-05-24 15:15:30.962')
        `);

        console.log('Данные сотрудников успешно обновлены!');
        
        client.release();
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
        process.exit(1);
    }
}

updateEmployeeData(); 