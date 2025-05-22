import { PostgresDataSource } from "./database.config"
import { Employee } from "../entities/Employee"
import { Facility } from "../entities/Facility"

async function seed() {
    try {
        await PostgresDataSource.initialize()
        
        // Очищаем и заполняем таблицу сотрудников
        const employeeRepository = PostgresDataSource.getRepository(Employee)
        await employeeRepository.clear()
        console.log("Таблица сотрудников очищена")

        const employees = [
            {
                name: "Иванов Иван Иванович",
                position: "Старший менеджер",
                email: "ivanov@example.com",
                phone: "+7 (999) 123-45-67"
            },
            {
                name: "Петрова Анна Сергеевна",
                position: "Специалист по безопасности",
                email: "petrova@example.com",
                phone: "+7 (999) 234-56-78"
            },
            {
                name: "Сидоров Петр Васильевич",
                position: "Менеджер",
                email: "sidorov@example.com",
                phone: "+7 (999) 345-67-89"
            },
            {
                name: "Козлова Мария Александровна",
                position: "Старший специалист",
                email: "kozlova@example.com",
                phone: "+7 (999) 456-78-90"
            },
            {
                name: "Морозов Дмитрий Павлович",
                position: "Руководитель отдела",
                email: "morozov@example.com",
                phone: "+7 (999) 567-89-01"
            }
        ]

        for (const employeeData of employees) {
            const employee = employeeRepository.create(employeeData)
            await employeeRepository.save(employee)
            console.log(`Добавлен сотрудник: ${employee.name}`)
        }

        // Очищаем и заполняем таблицу объектов
        const facilityRepository = PostgresDataSource.getRepository(Facility)
        await facilityRepository.clear()
        console.log("Таблица объектов очищена")

        const facilities = [
            {
                name: "Офис на Ленина",
                address: "ул. Ленина, 45",
                type: "Офис",
                status: "active",
                cost: 2500000
            },
            {
                name: "Складское помещение",
                address: "ул. Промышленная, 12",
                type: "Склад",
                status: "inactive",
                cost: 1800000
            },
            {
                name: "Производственный цех",
                address: "ул. Заводская, 8",
                type: "Производство",
                status: "ready",
                cost: 5600000
            },
            {
                name: "Главный офис",
                address: "ул. Центральная, 1",
                type: "Офис",
                status: "active",
                cost: 7200000
            },
            {
                name: "Торговая точка",
                address: "ул. Магазинная, 76",
                type: "Торговля",
                status: "inactive",
                cost: 1200000
            }
        ]

        for (const facilityData of facilities) {
            const facility = facilityRepository.create(facilityData)
            await facilityRepository.save(facility)
            console.log(`Добавлен объект: ${facility.name}`)
        }

        const employeeCount = await employeeRepository.count()
        const facilityCount = await facilityRepository.count()
        console.log(`База данных успешно заполнена! Всего сотрудников: ${employeeCount}, объектов: ${facilityCount}`)

    } catch (error) {
        console.error("Ошибка при заполнении базы данных:", error)
    } finally {
        await PostgresDataSource.destroy()
    }
}

seed() 