const { Pool } = require('pg');
const fs = require('fs');

// Настройки подключения к БД
const pool = new Pool({
    user: 'postgres',          
    password: 'NiceDbPassword',  
    host: 'localhost',         
    port: 5432,                
    database: 'postgres',      
    ssl: false                 
});

async function createTables() {
    try {
        console.log('Подключение к базе данных...');
        
        // Читаем SQL файл
        const sqlScript = fs.readFileSync('create-all-tables.sql', 'utf8');
        
        console.log('Выполнение SQL скрипта...');
        await pool.query(sqlScript);
        
        console.log('✅ Все таблицы и данные успешно созданы!');
        
        // Проверяем количество записей в каждой таблице
        const tables = ['employee', 'facility', 'equipment', 'news', 'report', 'calculation', 'review', 'feedback', 'setting'];
        
        for (const table of tables) {
            const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
            console.log(`📊 Таблица ${table}: ${result.rows[0].count} записей`);
        }
        
    } catch (error) {
        console.error('❌ Ошибка при создании таблиц:', error);
    } finally {
        await pool.end();
    }
}

createTables(); 