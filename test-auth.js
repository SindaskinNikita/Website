const axios = require('axios');

async function testAuth() {
    try {
        console.log('🔐 Тестирование авторизации...');
        
        // Тест с правильными данными
        console.log('1. Тест с admin/admin123...');
        const response = await axios.post('http://localhost:3000/api/auth/login', {
            username: 'admin',
            password: 'admin123'
        });
        
        console.log('✅ Авторизация успешна!');
        console.log('Данные пользователя:', response.data);
        
        // Тест проверки токена
        console.log('\n2. Тест проверки токена...');
        const verifyResponse = await axios.get('http://localhost:3000/api/auth/verify', {
            headers: {
                Authorization: `Bearer ${response.data.token}`
            }
        });
        
        console.log('✅ Токен действителен!');
        console.log('Данные из токена:', verifyResponse.data);
        
        // Тест с неправильными данными
        console.log('\n3. Тест с неправильными данными...');
        try {
            await axios.post('http://localhost:3000/api/auth/login', {
                username: 'admin',
                password: 'wrongpassword'
            });
        } catch (error) {
            console.log('✅ Правильно отклонен неверный пароль:', error.response.data.message);
        }
        
    } catch (error) {
        console.error('❌ Ошибка:', error.response?.data || error.message);
    }
}

testAuth(); 