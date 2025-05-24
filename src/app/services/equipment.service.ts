import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Equipment } from '../models/equipment.interface';

@Injectable({
    providedIn: 'root'
})
export class EquipmentService {
    private equipment: Equipment[] = [
        {
            id: 1,
            name: 'IP камера 2NN',
            category: 'Видеонаблюдение',
            image: 'assets/images/camera.jpg',
            features: [
                'Пластиковый корпус',
                'Угол обзора: 92° × 54°',
                'ИК-подсветка до 30м'
            ],
            price: 2300,
            description: 'Компактная IP-камера для внутреннего видеонаблюдения'
        },
        {
            id: 2,
            name: 'IP камера 2NN с микрофоном',
            category: 'Видеонаблюдение',
            image: 'assets/images/camera.jpg',
            features: [
                'Встроенный микрофон',
                'Угол обзора: 108° × 58°',
                'Запись на microSD'
            ],
            price: 7400,
            description: 'IP-камера со встроенным микрофоном для аудио-видео наблюдения'
        },
        {
            id: 3,
            name: 'IP камера 5NN',
            category: 'Видеонаблюдение',
            image: 'assets/images/camera.jpg',
            features: [
                'Разрешение 2592×1944',
                'Угол обзора: 100° × 76°',
                'Запись до 16 суток'
            ],
            price: 10600,
            description: 'Высококачественная IP-камера с расширенными возможностями'
        },
        {
            id: 4,
            name: 'IP камера 5NN с объективом',
            category: 'Видеонаблюдение',
            image: 'assets/images/camera.jpg',
            features: [
                'Нейросетевая аналитика',
                'Разрешение 1920×1080',
                'ИК-подсветка до 80м'
            ],
            price: 14200,
            description: 'Профессиональная IP-камера с вариофокальным объективом'
        }
    ];

    private equipmentSubject = new BehaviorSubject<Equipment[]>(this.equipment);
    private selectedCategorySubject = new BehaviorSubject<string>('Все');
    private searchQuerySubject = new BehaviorSubject<string>('');

    constructor() { }

    getEquipment(): Observable<Equipment[]> {
        return this.equipmentSubject.asObservable();
    }

    getSelectedCategory(): Observable<string> {
        return this.selectedCategorySubject.asObservable();
    }

    getSearchQuery(): Observable<string> {
        return this.searchQuerySubject.asObservable();
    }

    setSelectedCategory(category: string): void {
        this.selectedCategorySubject.next(category);
        this.filterEquipment();
    }

    setSearchQuery(query: string): void {
        this.searchQuerySubject.next(query);
        this.filterEquipment();
    }

    private filterEquipment(): void {
        const category = this.selectedCategorySubject.value;
        const query = this.searchQuerySubject.value.toLowerCase();

        let filteredEquipment = [...this.equipment];

        if (category !== 'Все') {
            filteredEquipment = filteredEquipment.filter(item => item.category === category);
        }

        if (query) {
            filteredEquipment = filteredEquipment.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.features.some(feature => feature.toLowerCase().includes(query)) ||
                item.description?.toLowerCase().includes(query)
            );
        }

        this.equipmentSubject.next(filteredEquipment);
    }

    getCategories(): string[] {
        return ['Все', ...new Set(this.equipment.map(item => item.category))];
    }
} 