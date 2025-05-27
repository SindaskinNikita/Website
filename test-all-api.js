const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAllAPI() {
    console.log('🧪 Тестирование всех API маршрутов...\n');

    try {
        // Тест авторизации
        console.log('1. Тестирование авторизации...');
        const authResponse = await axios.post(`${BASE_URL}/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        console.log('✅ Авторизация успешна, токен получен');
        
        const token = authResponse.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        // Тест сотрудников
        console.log('\n2. Тестирование API сотрудников...');
        const employeesResponse = await axios.get(`${BASE_URL}/employees`, { headers });
        console.log(`✅ Сотрудники: ${employeesResponse.data.length} записей`);

        // Тест объектов
        console.log('\n3. Тестирование API объектов...');
        const facilitiesResponse = await axios.get(`${BASE_URL}/facilities`, { headers });
        console.log(`✅ Объекты: ${facilitiesResponse.data.length} записей`);

        // Тест оборудования
        console.log('\n4. Тестирование API оборудования...');
        const equipmentResponse = await axios.get(`${BASE_URL}/equipment`, { headers });
        console.log(`✅ Оборудование: ${equipmentResponse.data.length} записей`);

        // Тест новостей
        console.log('\n5. Тестирование API новостей...');
        const newsResponse = await axios.get(`${BASE_URL}/news`, { headers });
        console.log(`✅ Новости: ${newsResponse.data.length} записей`);

        // Тест отчетов
        console.log('\n6. Тестирование API отчетов...');
        const reportsResponse = await axios.get(`${BASE_URL}/reports`, { headers });
        console.log(`✅ Отчеты: ${reportsResponse.data.length} записей`);

        // Тест расчетов
        console.log('\n7. Тестирование API расчетов...');
        const calculationsResponse = await axios.get(`${BASE_URL}/calculations`, { headers });
        console.log(`✅ Расчеты: ${calculationsResponse.data.length} записей`);

        // Тест отзывов
        console.log('\n8. Тестирование API отзывов...');
        const reviewsResponse = await axios.get(`${BASE_URL}/reviews`, { headers });
        console.log(`✅ Отзывы: ${reviewsResponse.data.length} записей`);

        // Тест обратной связи
        console.log('\n9. Тестирование API обратной связи...');
        const feedbackResponse = await axios.get(`${BASE_URL}/feedback`, { headers });
        console.log(`✅ Обратная связь: ${feedbackResponse.data.length} записей`);

        // Тест настроек
        console.log('\n10. Тестирование API настроек...');
        const settingsResponse = await axios.get(`${BASE_URL}/settings`, { headers });
        console.log(`✅ Настройки: ${settingsResponse.data.length} записей`);

        console.log('\n🎉 Все API работают корректно!');
        console.log('\n📋 Сводка данных:');
        console.log(`- Сотрудники: ${employeesResponse.data.length}`);
        console.log(`- Объекты: ${facilitiesResponse.data.length}`);
        console.log(`- Оборудование: ${equipmentResponse.data.length}`);
        console.log(`- Новости: ${newsResponse.data.length}`);
        console.log(`- Отчеты: ${reportsResponse.data.length}`);
        console.log(`- Расчеты: ${calculationsResponse.data.length}`);
        console.log(`- Отзывы: ${reviewsResponse.data.length}`);
        console.log(`- Обратная связь: ${feedbackResponse.data.length}`);
        console.log(`- Настройки: ${settingsResponse.data.length}`);

    } catch (error) {
        console.error('❌ Ошибка при тестировании API:', error.response?.data || error.message);
    }
}

testAllAPI(); 