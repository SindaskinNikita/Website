import { AppDataSource } from "./database"
import { Employee } from "../entities/Employee"
import { Facility } from "../entities/Facility"

async function seed() {
    try {
        await AppDataSource.initialize()
        
        const employeeRepository = AppDataSource.getRepository(Employee)
        const facilityRepository = AppDataSource.getRepository(Facility)

        // Очищаем существующие данные
        await employeeRepository.clear()
        await facilityRepository.clear()
        console.log("База данных очищена")

        // Создаем объекты
        const facilities = [
            {
                name: "ТЦ Центральный",
                address: "ул. Ленина, 45",
                type: "Торговый центр",
                status: "active"
            },
            {
                name: "БЦ Горизонт",
                address: "пр. Мира, 78",
                type: "Бизнес центр",
                status: "active"
            },
            {
                name: "ЖК Солнечный",
                address: "ул. Светлая, 12",
                type: "Жилой комплекс",
                status: "inactive"
            }
        ]

        for (const facilityData of facilities) {
            const facility = facilityRepository.create(facilityData)
            await facilityRepository.save(facility)
            console.log(`Добавлен объект: ${facility.name}`)
        }

        // Создаем сотрудников
        const employees = [
            {
                name: "Иванов Иван Иванович",
                position: "Старший менеджер",
                location: "ТЦ Центральный",
                status: "active"
            },
            {
                name: "Петрова Анна Сергеевна",
                position: "Специалист по безопасности",
                location: "БЦ Горизонт",
                status: "active"
            },
            {
                name: "Сидоров Петр Васильевич",
                position: "Менеджер",
                location: "ЖК Солнечный",
                status: "inactive"
            },
            {
                name: "Козлова Мария Александровна",
                position: "Старший специалист",
                location: "ТЦ Центральный",
                status: "active"
            },
            {
                name: "Морозов Дмитрий Павлович",
                position: "Руководитель отдела",
                location: "БЦ Горизонт",
                status: "active"
            }
        ]

        for (const employeeData of employees) {
            const employee = employeeRepository.create(employeeData)
            await employeeRepository.save(employee)
            console.log(`Добавлен сотрудник: ${employee.name}`)
        }

        const employeeCount = await employeeRepository.count()
        const facilityCount = await facilityRepository.count()
        console.log(`База данных успешно заполнена! Всего сотрудников: ${employeeCount}, объектов: ${facilityCount}`)
        
        process.exit(0)
    } catch (error) {
        console.error("Ошибка при заполнении базы данных:", error)
        process.exit(1)
    }
}

seed() 