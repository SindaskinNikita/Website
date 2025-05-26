const http = require('http');

function testAPI() {
    console.log('🌐 Тестирование API /api/employees...');
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/employees',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log(`📊 Статус ответа: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                if (res.statusCode === 200) {
                    const employees = JSON.parse(data);
                    console.log(`✅ API работает! Получено ${employees.length} сотрудников`);
                    console.log('👥 Первые 3 сотрудника:');
                    employees.slice(0, 3).forEach((emp, index) => {
                        console.log(`${index + 1}. ${emp.name} - ${emp.position}`);
                    });
                } else {
                    console.log(`❌ Ошибка API. Статус: ${res.statusCode}`);
                    console.log('Ответ:', data);
                }
            } catch (error) {
                console.log('❌ Ошибка парсинга ответа:', error.message);
                console.log('Сырой ответ:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.log('❌ Ошибка подключения к API:', error.message);
        console.log('💡 Убедитесь, что сервер запущен: cd src/server && npm start');
    });

    req.setTimeout(5000, () => {
        console.log('❌ Таймаут запроса к API');
        req.destroy();
    });

    req.end();
}

// Ждем немного, чтобы сервер успел запуститься
setTimeout(testAPI, 2000); 