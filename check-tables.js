const { Pool } = require('pg');

// Настройки подключения к БД
const pool = new Pool({
    user: 'postgres',          
    password: 'NiceDbPassword',  
    host: 'localhost',         
    port: 5432,                
    database: 'postgres',      
    ssl: false                 
});

async function checkTables() {
    try {
        console.log('Подключение к базе данных...');
        
        // Проверяем какие таблицы существуют
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        console.log('Существующие таблицы:');
        tablesResult.rows.forEach(row => {
            console.log(`- ${row.table_name}`);
        });
        
        // Проверяем структуру таблицы equipment если она существует
        const equipmentExists = tablesResult.rows.some(row => row.table_name === 'equipment');
        if (equipmentExists) {
            console.log('\nСтруктура таблицы equipment:');
            const columnsResult = await pool.query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'equipment' AND table_schema = 'public'
                ORDER BY ordinal_position;
            `);
            
            columnsResult.rows.forEach(row => {
                console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
            });
        }
        
        // Проверяем структуру таблицы employee если она существует
        const employeeExists = tablesResult.rows.some(row => row.table_name === 'employee');
        if (employeeExists) {
            console.log('\nСтруктура таблицы employee:');
            const columnsResult = await pool.query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'employee' AND table_schema = 'public'
                ORDER BY ordinal_position;
            `);
            
            columnsResult.rows.forEach(row => {
                console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
            });
        }
        
    } catch (error) {
        console.error('❌ Ошибка при проверке таблиц:', error);
    } finally {
        await pool.end();
    }
}

checkTables(); 