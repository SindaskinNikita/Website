import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Equipment } from '../models/equipment.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EquipmentService {
    private apiUrl = `${environment.apiUrl}/equipment`;
    private equipmentList: Equipment[] = [
        {
            id: 1,
            name: 'IP камера Hikvision DS-2CD2143G0-I',
            type: 'Купольная IP камера',
            category: 'Видеонаблюдение',
            facility: 'Офисное здание',
            location: 'Вход в здание',
            status: 'active',
            lastMaintenance: new Date('2024-01-15'),
            nextMaintenance: new Date('2024-07-15'),
            description: 'Купольная IP камера с разрешением 4 Мп и ИК подсветкой до 30м',
            features: [
                'Разрешение 4 Мп (2688×1520)',
                'ИК подсветка до 30 м',
                'Защита от вандализма IK08',
                'Степень защиты IP67',
                'Поддержка H.265+',
                'Детектор движения'
            ],
            image: 'assets/images/ip-camera.jpg',
            price: 8500
        },
        {
            id: 2,
            name: 'DVR регистратор Dahua DHI-XVR5108HS-4KL-I2',
            type: 'Цифровой видеорегистратор',
            category: 'Видеонаблюдение',
            facility: 'Торговый центр',
            location: 'Серверная комната',
            status: 'active',
            lastMaintenance: new Date('2024-02-10'),
            nextMaintenance: new Date('2024-08-10'),
            description: '8-канальный видеорегистратор с поддержкой 4K',
            features: [
                '8 каналов видеозаписи',
                'Поддержка 4K записи',
                'Детектор движения',
                'Удаленный доступ',
                'HDD до 10 ТБ',
                'Поддержка мобильного приложения'
            ],
            image: 'assets/images/dvr-recorder.jpg',
            price: 15000
        },
        {
            id: 3,
            name: 'Охранная сигнализация Ajax StarterKit',
            type: 'Беспроводная сигнализация',
            category: 'Охранная сигнализация',
            facility: 'Частный дом',
            location: 'Прихожая',
            status: 'active',
            lastMaintenance: new Date('2024-03-01'),
            nextMaintenance: new Date('2024-09-01'),
            description: 'Стартовый комплект беспроводной охранной сигнализации',
            features: [
                'Центральная панель Hub 2',
                'Датчик движения MotionProtect',
                'Датчик открытия DoorProtect',
                'Брелок SpaceControl',
                'Дальность связи до 2000 м',
                'Мобильное приложение'
            ],
            image: 'assets/images/security-alarm.jpg',
            price: 25000
        },
        {
            id: 4,
            name: 'Считыватель карт СКУД Hikvision DS-K1108E',
            type: 'Считыватель proximity карт',
            category: 'Контроль доступа',
            facility: 'Офисное здание',
            location: 'Входная дверь',
            status: 'active',
            lastMaintenance: new Date('2024-02-20'),
            nextMaintenance: new Date('2024-08-20'),
            description: 'Считыватель карт доступа с LED индикацией',
            features: [
                'Считывание EM-Marine карт',
                'Дальность считывания 2-8 см',
                'LED индикация',
                'Звуковая сигнализация',
                'Защита от вандализма',
                'Рабочая температура -40°C до +60°C'
            ],
            image: 'assets/images/card-reader.jpg',
            price: 3500
        },
        {
            id: 5,
            name: 'Контроллер СКУД Hikvision DS-K2801',
            type: 'Сетевой контроллер доступа',
            category: 'Контроль доступа',
            facility: 'Офисное здание',
            location: 'Серверная комната',
            status: 'active',
            lastMaintenance: new Date('2024-01-25'),
            nextMaintenance: new Date('2024-07-25'),
            description: 'Одно-дверный сетевой контроллер доступа',
            features: [
                'Управление 1 дверью',
                'До 50,000 карт',
                'До 150,000 событий',
                'TCP/IP интерфейс',
                'Web-интерфейс управления',
                'Поддержка различных карт'
            ],
            image: 'assets/images/access-controller.jpg',
            price: 12000
        },
        {
            id: 6,
            name: 'Извещатель пожарный дымовой ИП 212-141',
            type: 'Дымовой извещатель',
            category: 'Пожарная сигнализация',
            facility: 'Офисное здание',
            location: 'Коридор 2 этаж',
            status: 'active',
            lastMaintenance: new Date('2024-03-10'),
            nextMaintenance: new Date('2024-09-10'),
            description: 'Автономный дымовой пожарный извещатель',
            features: [
                'Оптический принцип обнаружения',
                'Светодиодная индикация',
                'Звуковая сигнализация 85 дБ',
                'Батарея на 5 лет',
                'Самодиагностика',
                'Простота установки'
            ],
            image: 'assets/images/smoke-detector.jpg',
            price: 1200
        },
        {
            id: 7,
            name: 'Камера видеонаблюдения уличная Hikvision DS-2CE16D0T-IRF',
            type: 'Уличная TVI камера',
            category: 'Видеонаблюдение',
            facility: 'Парковка',
            location: 'Въезд на территорию',
            status: 'maintenance',
            lastMaintenance: new Date('2024-03-15'),
            nextMaintenance: new Date('2024-05-15'),
            description: 'Уличная камера видеонаблюдения с ИК подсветкой',
            features: [
                'Разрешение 2 Мп (1920×1080)',
                'ИК подсветка до 20 м',
                'Защита IP66',
                'Рабочая температура -40°C до +60°C',
                'Технология TVI',
                'Объектив 3.6 мм'
            ],
            image: 'assets/images/outdoor-camera.jpg',
            price: 4500
        },
        {
            id: 8,
            name: 'Домофон Commax DPV-4HP2',
            type: 'Видеодомофон',
            category: 'Контроль доступа',
            facility: 'Жилой комплекс',
            location: 'Подъезд 1',
            status: 'active',
            lastMaintenance: new Date('2024-01-30'),
            nextMaintenance: new Date('2024-07-30'),
            description: 'Цветной видеодомофон с TFT дисплеем',
            features: [
                'TFT дисплей 4.3"',
                'Цветное изображение',
                'Двухпроводная линия связи',
                'Запись фото при вызове',
                'Память на 300 фото',
                'Регулировка громкости'
            ],
            image: 'assets/images/video-intercom.jpg',
            price: 7800
        }
    ];

    private equipmentSubject = new BehaviorSubject<Equipment[]>(this.equipmentList);
    private selectedCategorySubject = new BehaviorSubject<string>('Все');
    private searchQuerySubject = new BehaviorSubject<string>('');

    constructor(private http: HttpClient) {
        // Временно используем локальные данные
        // this.loadEquipment();
    }

    // Закомментировано до настройки сервера
    /*
    private loadEquipment(): void {
        this.http.get<Equipment[]>(this.apiUrl).subscribe(
            equipment => {
                this.equipmentList = equipment;
                this.equipmentSubject.next(equipment);
            },
            error => console.error('Ошибка при загрузке оборудования:', error)
        );
    }
    */

    getEquipment(): Observable<Equipment[]> {
        return this.equipmentSubject.asObservable();
    }

    getCategories(): string[] {
        return [
            'Все',
            'Видеонаблюдение',
            'Охранная сигнализация',
            'Контроль доступа',
            'Пожарная сигнализация'
        ];
    }

    getSelectedCategory(): Observable<string> {
        return this.selectedCategorySubject.asObservable();
    }

    setSelectedCategory(category: string): void {
        this.selectedCategorySubject.next(category);
    }

    getSearchQuery(): Observable<string> {
        return this.searchQuerySubject.asObservable();
    }

    setSearchQuery(query: string): void {
        this.searchQuerySubject.next(query);
    }

    addEquipment(equipment: Equipment): Observable<Equipment> {
        this.equipmentList.push(equipment);
        this.equipmentSubject.next(this.equipmentList);
        return of(equipment);
    }

    updateEquipment(equipment: Equipment): Observable<Equipment> {
        const index = this.equipmentList.findIndex(e => e.id === equipment.id);
        if (index !== -1) {
            this.equipmentList[index] = equipment;
            this.equipmentSubject.next(this.equipmentList);
        }
        return of(equipment);
    }

    deleteEquipment(id: number): Observable<void> {
        this.equipmentList = this.equipmentList.filter(e => e.id !== id);
        this.equipmentSubject.next(this.equipmentList);
        return of(undefined);
    }

    getEquipmentById(id: number): Equipment | undefined {
        return this.equipmentList.find(e => e.id === id);
    }
} 