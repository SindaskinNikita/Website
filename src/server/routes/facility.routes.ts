import { Router, Request, Response, RequestHandler } from 'express';
import { PostgresDataSource } from '../database/database.config';
import { Facility } from '../entities/Facility';

const router = Router();

interface ParamsWithId {
    id: string;
}

// Получить все объекты
const getAllFacilities: RequestHandler = async (_req, res) => {
    try {
        console.log('Начинаем получение объектов');
        const facilityRepository = PostgresDataSource.getRepository(Facility);
        
        // Проверяем наличие данных
        const count = await facilityRepository.query('SELECT COUNT(*) FROM facility');
        console.log('Количество записей:', count);

        // Если данных нет, заполняем тестовыми
        if (parseInt(count[0].count) === 0) {
            console.log('Таблица пустая, заполняем тестовыми данными...');
            await facilityRepository.query(`
                INSERT INTO facility (name, address, type, status, cost) VALUES
                ('Офис на Ленина', 'ул. Ленина, 45', 'Офис', 'active', 2500000),
                ('Складское помещение', 'ул. Промышленная, 12', 'Склад', 'ready_to_rent', 1800000),
                ('Производственный цех', 'ул. Заводская, 8', 'Производство', 'ready', 5600000),
                ('Главный офис', 'ул. Центральная, 1', 'Офис', 'rented', 7200000),
                ('Торговая точка', 'ул. Магазинная, 76', 'Торговля', 'inactive', 1200000)
            `);
            console.log('Тестовые данные добавлены');
        }

        // Получаем все объекты
        const facilities = await facilityRepository.query('SELECT * FROM facility');
        console.log('Получены объекты:', facilities);
        
        res.json(facilities);
    } catch (error: any) {
        console.error('Ошибка при получении объектов:', error);
        console.error('Стек ошибки:', error.stack);
        res.status(500).json({ 
            message: error.message,
            stack: error.stack,
            query: error.query
        });
    }
};

// Получить объект по ID
const getFacilityById: RequestHandler<ParamsWithId> = async (req, res) => {
    try {
        const facilityRepository = PostgresDataSource.getRepository(Facility);
        const facility = await facilityRepository.findOne({
            where: { id: parseInt(req.params['id']) }
        });
        
        if (!facility) {
            res.status(404).json({ message: 'Объект не найден' });
            return;
        }
        
        res.json(facility);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Добавить объект
const createFacility: RequestHandler = async (req, res) => {
    try {
        const facilityRepository = PostgresDataSource.getRepository(Facility);
        const facility = facilityRepository.create(req.body);
        const result = await facilityRepository.save(facility);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Обновить объект
const updateFacility: RequestHandler<ParamsWithId> = async (req, res) => {
    try {
        const facilityRepository = PostgresDataSource.getRepository(Facility);
        const facility = await facilityRepository.findOne({
            where: { id: parseInt(req.params['id']) }
        });
        
        if (!facility) {
            res.status(404).json({ message: 'Объект не найден' });
            return;
        }
        
        facilityRepository.merge(facility, req.body);
        const result = await facilityRepository.save(facility);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Удалить объект
const deleteFacility: RequestHandler<ParamsWithId> = async (req, res) => {
    try {
        const facilityRepository = PostgresDataSource.getRepository(Facility);
        const facility = await facilityRepository.findOne({
            where: { id: parseInt(req.params['id']) }
        });
        
        if (!facility) {
            res.status(404).json({ message: 'Объект не найден' });
            return;
        }
        
        await facilityRepository.remove(facility);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

router.get('/', getAllFacilities);
router.get('/:id', getFacilityById);
router.post('/', createFacility);
router.put('/:id', updateFacility);
router.delete('/:id', deleteFacility);

export default router; 