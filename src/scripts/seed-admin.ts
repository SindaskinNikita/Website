import { PostgresDataSource } from '../server/database/database.config';
import { User } from '../server/entities/User';
import * as bcrypt from 'bcrypt';

async function seedAdmin() {
    try {
        await PostgresDataSource.initialize();
        console.log('База данных подключена');

        const userRepository = PostgresDataSource.getRepository(User);
        
        // Проверяем, существует ли уже админ
        const existingAdmin = await userRepository.findOne({ 
            where: { username: 'admin' } 
        });

        if (existingAdmin) {
            console.log('Администратор уже существует');
            process.exit(0);
        }

        // Создаем хеш пароля
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash('password123', saltRounds);

        // Создаем администратора
        const admin = userRepository.create({
            username: 'admin',
            email: 'admin@example.com',
            password_hash: passwordHash,
            role: 'admin'
        });

        await userRepository.save(admin);
        console.log('Администратор успешно создан');
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при создании администратора:', error);
        process.exit(1);
    }
}

seedAdmin(); 