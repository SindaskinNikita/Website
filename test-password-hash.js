const bcrypt = require('bcrypt');

// Хеш из вашей базы данных
const hashFromDB = '$2b$10$/edUPENoHSfuJrVuKiMscOY7JbpPu.DQPgPkibt/.qrS1u6mE1l8y';

// Тестируем разные пароли
const passwords = ['admin123', 'manager123', 'password123', 'admin', 'manager'];

async function testPasswords() {
    console.log('Тестирование паролей с хешем из БД:');
    console.log('Хеш:', hashFromDB);
    console.log('');

    for (const password of passwords) {
        try {
            const isValid = await bcrypt.compare(password, hashFromDB);
            console.log(`Пароль "${password}": ${isValid ? '✅ ВЕРНЫЙ' : '❌ неверный'}`);
        } catch (error) {
            console.log(`Пароль "${password}": ❌ ошибка -`, error.message);
        }
    }

    // Создаем новые хеши для сравнения
    console.log('\n--- Создание новых хешей ---');
    for (const password of ['admin123', 'manager123']) {
        const newHash = await bcrypt.hash(password, 10);
        console.log(`${password} -> ${newHash}`);
        
        // Проверяем новый хеш
        const isValid = await bcrypt.compare(password, newHash);
        console.log(`Проверка нового хеша: ${isValid ? '✅' : '❌'}`);
        console.log('');
    }
}

testPasswords().catch(console.error); 