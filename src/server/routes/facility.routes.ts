import { Router, Request, Response, RequestHandler } from 'express';
import { PostgresDataSource } from '../database/database.config';
import { Facility, FacilityType, FacilityStatus } from '../entities/Facility';

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
        const count = await facilityRepository.count();
        console.log('Количество записей:', count);

        // Если данных нет, заполняем тестовыми
        if (count === 0) {
            console.log('Таблица пустая, заполняем тестовыми данными...');
            const testFacilities = [
                {
                    name: 'Офис на Ленина',
                    address: 'ул. Ленина, 45',
                    type: 'Офис' as FacilityType,
                    status: 'active' as FacilityStatus,
                    cost: 2500000
                },
                {
                    name: 'Складское помещение',
                    address: 'ул. Промышленная, 12',
                    type: 'Склад' as FacilityType,
                    status: 'ready_to_rent' as FacilityStatus,
                    cost: 1800000
                },
                {
                    name: 'Производственный цех',
                    address: 'ул. Заводская, 8',
                    type: 'Производство' as FacilityType,
                    status: 'ready' as FacilityStatus,
                    cost: 5600000
                },
                {
                    name: 'Главный офис',
                    address: 'ул. Центральная, 1',
                    type: 'Офис' as FacilityType,
                    status: 'rented' as FacilityStatus,
                    cost: 7200000
                },
                {
                    name: 'Торговая точка',
                    address: 'ул. Магазинная, 76',
                    type: 'Торговля' as FacilityType,
                    status: 'inactive' as FacilityStatus,
                    cost: 1200000
                }
            ];
            
            await facilityRepository.save(testFacilities);
            console.log('Тестовые данные добавлены');
        }

        // Получаем все объекты
        const facilities = await facilityRepository.find();
        console.log('Получены объекты:', facilities);
        
        res.json(facilities);
    } catch (error: any) {
        console.error('Ошибка при получении объектов:', error);
        res.status(500).json({ message: error.message });
    }
};

// Получить объект по ID
const getFacilityById: RequestHandler<ParamsWithId> = async (req, res) => {
    try {
        const facilityRepository = PostgresDataSource.getRepository(Facility);
        const facility = await facilityRepository.findOne({
            where: { id: parseInt(req.params.id) }
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
            where: { id: parseInt(req.params.id) }
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
            where: { id: parseInt(req.params.id) }
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