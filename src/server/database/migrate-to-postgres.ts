import { AppDataSource } from './database'
import { PostgresDataSource } from './database.config'
import { Employee } from '../entities/Employee'
import { Facility } from '../entities/Facility'
import { News } from '../entities/News'
import { Equipment } from '../entities/Equipment'

async function migrateData() {
    try {
        // Инициализация обоих источников данных
        await AppDataSource.initialize()
        await PostgresDataSource.initialize()

        // Миграция сотрудников
        const employees = await AppDataSource.getRepository(Employee).find()
        await PostgresDataSource.getRepository(Employee).save(employees)

        // Миграция объектов
        const facilities = await AppDataSource.getRepository(Facility).find()
        await PostgresDataSource.getRepository(Facility).save(facilities)

        // Миграция новостей
        const news = await AppDataSource.getRepository(News).find()
        await PostgresDataSource.getRepository(News).save(news)

        // Миграция оборудования (если есть)
        const equipment = await AppDataSource.getRepository(Equipment).find()
        await PostgresDataSource.getRepository(Equipment).save(equipment)

        console.log('Миграция данных успешно завершена')

        // Закрытие соединений
        await AppDataSource.destroy()
        await PostgresDataSource.destroy()

    } catch (error) {
        console.error('Ошибка при миграции данных:', error)
        // Закрытие соединений в случае ошибки
        if (AppDataSource.isInitialized) await AppDataSource.destroy()
        if (PostgresDataSource.isInitialized) await PostgresDataSource.destroy()
    }
}

migrateData() 