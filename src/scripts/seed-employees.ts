import { PostgresDataSource } from '../server/database/database.config';
import { Employee } from '../server/entities/Employee';

async function seedEmployees() {
    try {
        await PostgresDataSource.initialize();
        console.log('База данных подключена');

        const employeeRepository = PostgresDataSource.getRepository(Employee);
        
        // Тестовые данные
        const employees = [
            {
                name: 'Иванов Иван Иванович',
                position: 'Старший менеджер',
                email: 'ivanov@example.com',
                phone: '+7 (999) 123-45-67'
            },
            {
                name: 'Петрова Анна Сергеевна',
                position: 'Специалист по безопасности',
                email: 'petrova@example.com',
                phone: '+7 (999) 234-56-78'
            },
            {
                name: 'Сидоров Петр Михайлович',
                position: 'Системный администратор',
                email: 'sidorov@example.com',
                phone: '+7 (999) 345-67-89'
            },
            {
                name: 'Козлова Мария Александровна',
                position: 'Бухгалтер',
                email: 'kozlova@example.com',
                phone: '+7 (999) 456-78-90'
            },
            {
                name: 'Новиков Дмитрий Владимирович',
                position: 'Технический директор',
                email: 'novikov@example.com',
                phone: '+7 (999) 567-89-01'
            }
        ];

        // Добавляем сотрудников в базу данных
        for (const employeeData of employees) {
            const employee = employeeRepository.create(employeeData);
            await employeeRepository.save(employee);
            console.log(`Добавлен сотрудник: ${employee.name}`);
        }

        console.log('Все тестовые данные успешно добавлены');
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при добавлении тестовых данных:', error);
        process.exit(1);
    }
}

seedEmployees(); 