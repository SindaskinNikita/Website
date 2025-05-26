import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
    getCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    getEquipment,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    getServices,
    addService,
    updateService,
    deleteService,
    getContacts,
    addContact,
    updateContact,
    deleteContact
} from '../controllers/data.controller';

const router = Router();

// Маршруты для компаний
router.get('/companies', authMiddleware, getCompanies);
router.post('/companies', authMiddleware, addCompany);
router.put('/companies/:id', authMiddleware, updateCompany);
router.delete('/companies/:id', authMiddleware, deleteCompany);

// Маршруты для оборудования
router.get('/equipment', authMiddleware, getEquipment);
router.post('/equipment', authMiddleware, addEquipment);
router.put('/equipment/:id', authMiddleware, updateEquipment);
router.delete('/equipment/:id', authMiddleware, deleteEquipment);

// Маршруты для услуг
router.get('/services', authMiddleware, getServices);
router.post('/services', authMiddleware, addService);
router.put('/services/:id', authMiddleware, updateService);
router.delete('/services/:id', authMiddleware, deleteService);

// Маршруты для контактов
router.get('/contacts', authMiddleware, getContacts);
router.post('/contacts', authMiddleware, addContact);
router.put('/contacts/:id', authMiddleware, updateContact);
router.delete('/contacts/:id', authMiddleware, deleteContact);

export default router; 