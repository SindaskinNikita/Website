// Скрипт для тестирования API аутентификации напрямую
const fetch = require('node-fetch');

async function testAuthAPI() {
    try {
        console.log('Тестирование API аутентификации...');
        
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'password123'
            })
        });
        
        console.log('Статус ответа:', response.status);
        
        const data = await response.json();
        console.log('Ответ сервера:', JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log('✅ Аутентификация успешна!');
            console.log('Токен:', data.token);
            
            // Дополнительно проверяем API верификации токена
            if (data.token) {
                console.log('Проверка API верификации токена...');
                
                const verifyResponse = await fetch('http://localhost:3000/api/auth/verify', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${data.token}`
                    }
                });
                
                console.log('Статус ответа верификации:', verifyResponse.status);
                
                if (verifyResponse.ok) {
                    const verifyData = await verifyResponse.json();
                    console.log('Ответ верификации:', JSON.stringify(verifyData, null, 2));
                    console.log('✅ Верификация токена успешна!');
                } else {
                    console.log('❌ Ошибка верификации токена');
                }
            }
        } else {
            console.log('❌ Ошибка аутентификации');
        }
    } catch (error) {
        console.error('Ошибка при тестировании API:', error);
    }
}

// Запускаем тест
testAuthAPI(); 