import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CameraType = 'HD (720p)' | 'Full HD (1080p)' | '4K';
type StorageType = 'Локальное' | 'Облачное';
type SystemType = 'Базовая' | 'Расширенная' | 'Премиум';
type AccessType = 'Карты доступа' | 'Биометрия' | 'Комбинированная';

interface Service {
  id: number;
  category: string;
  title: string;
  description: string;
  features: string[];
  basePrice?: number;
  calculator?: {
    inputs: {
      type: 'number' | 'select';
      label: string;
      options?: string[];
      min?: number;
      max?: number;
    }[];
    calculate: (values: { [key: string]: string | number }) => number;
  };
}

@Component({
  selector: 'app-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ServicesPageComponent implements OnInit {
  selectedCategory: string = 'video-surveillance';
  isRequestModalOpen: boolean = false;
  selectedService: Service | null = null;
  calculatorValues: { [key: string]: string | number } = {};
  totalPrice: number = 0;
  showScrollButton: boolean = false;

  services: Service[] = [
    {
      id: 1,
      category: 'video-surveillance',
      title: 'Видеонаблюдение для дома',
      description: 'Комплексное решение для защиты вашего дома с использованием современных IP-камер и систем записи.',
      features: [
        'HD и 4K камеры с ночным видением',
        'Запись на облачное хранилище',
        'Удаленный доступ через мобильное приложение',
        'Обнаружение движения и оповещения',
        'Защита от несанкционированного доступа'
      ],
      basePrice: 15000,
      calculator: {
        inputs: [
          {
            type: 'number',
            label: 'Количество камер',
            min: 1,
            max: 16
          },
          {
            type: 'select',
            label: 'Тип камер',
            options: ['HD (720p)', 'Full HD (1080p)', '4K']
          },
          {
            type: 'select',
            label: 'Тип хранения',
            options: ['Локальное', 'Облачное']
          }
        ],
        calculate: (values) => {
          const cameraPrice: Record<CameraType, number> = {
            'HD (720p)': 3000,
            'Full HD (1080p)': 5000,
            '4K': 8000
          };
          const storagePrice: Record<StorageType, number> = {
            'Локальное': 5000,
            'Облачное': 8000
          };
          const cameras = Number(values['Количество камер']);
          const cameraType = values['Тип камер'] as CameraType;
          const storageType = values['Тип хранения'] as StorageType;
          return cameras * cameraPrice[cameraType] + storagePrice[storageType];
        }
      }
    },
    {
      id: 2,
      category: 'fire-safety',
      title: 'Пожарная сигнализация',
      description: 'Профессиональная установка и обслуживание систем пожарной безопасности для вашего объекта.',
      features: [
        'Дымовые и тепловые датчики',
        'Автоматическая система оповещения',
        'Интеграция с системой пожаротушения',
        'Круглосуточный мониторинг',
        'Регулярное обслуживание'
      ],
      basePrice: 25000,
      calculator: {
        inputs: [
          {
            type: 'number',
            label: 'Площадь помещения (м²)',
            min: 20,
            max: 1000
          },
          {
            type: 'select',
            label: 'Тип системы',
            options: ['Базовая', 'Расширенная', 'Премиум']
          }
        ],
        calculate: (values) => {
          const area = Number(values['Площадь помещения (м²)']);
          const systemMultiplier: Record<SystemType, number> = {
            'Базовая': 1,
            'Расширенная': 1.5,
            'Премиум': 2
          };
          const systemType = values['Тип системы'] as SystemType;
          return area * 50 * systemMultiplier[systemType];
        }
      }
    },
    {
      id: 3,
      category: 'access-control',
      title: 'Контроль доступа',
      description: 'Современные системы контроля и управления доступом для обеспечения безопасности вашего объекта.',
      features: [
        'Электронные замки и домофоны',
        'Биометрическая идентификация',
        'Карты доступа и брелоки',
        'Удаленное управление доступом',
        'Журнал событий и отчеты'
      ],
      basePrice: 20000,
      calculator: {
        inputs: [
          {
            type: 'number',
            label: 'Количество точек доступа',
            min: 1,
            max: 20
          },
          {
            type: 'select',
            label: 'Тип идентификации',
            options: ['Карты доступа', 'Биометрия', 'Комбинированная']
          }
        ],
        calculate: (values) => {
          const points = Number(values['Количество точек доступа']);
          const identificationMultiplier: Record<AccessType, number> = {
            'Карты доступа': 1,
            'Биометрия': 1.8,
            'Комбинированная': 2.2
          };
          const accessType = values['Тип идентификации'] as AccessType;
          return points * 5000 * identificationMultiplier[accessType];
        }
      }
    }
  ];

  requestForm = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };

  constructor() {}

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.showScrollButton = window.scrollY > 300;
  }

  ngOnInit(): void {
    this.onScroll(); // Проверяем начальное состояние прокрутки
    this.updateTotalPrice();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  getServicesByCategory(): Service[] {
    return this.services.filter(service => service.category === this.selectedCategory);
  }

  updateTotalPrice(): void {
    if (this.selectedService?.calculator) {
      try {
        // Преобразуем все числовые значения
        const processedValues = Object.entries(this.calculatorValues)
          .reduce((acc, [key, value]) => {
            if (value === '') {
              return acc; // Пропускаем пустые значения
            }
            if (typeof value === 'string' && !isNaN(Number(value))) {
              acc[key] = Number(value);
            } else {
              acc[key] = value;
            }
            return acc;
          }, {} as { [key: string]: string | number });

        this.totalPrice = this.selectedService.calculator.calculate(processedValues);
      } catch (error) {
        console.error('Ошибка при расчете стоимости:', error);
        this.totalPrice = 0;
      }
    } else if (this.selectedService?.basePrice) {
      this.totalPrice = this.selectedService.basePrice;
    } else {
      this.totalPrice = 0;
    }
  }

  openRequestModal(service: Service): void {
    this.selectedService = service;
    this.calculatorValues = {};
    this.updateTotalPrice();
    this.isRequestModalOpen = true;
  }

  closeRequestModal(): void {
    this.isRequestModalOpen = false;
    this.selectedService = null;
    this.calculatorValues = {};
    this.totalPrice = 0;
  }

  resetForm(): void {
    this.requestForm = {
      name: '',
      phone: '',
      email: '',
      message: ''
    };
  }

  submitRequest(): void {
    // Здесь будет логика отправки заявки
    console.log('Отправка заявки:', {
      service: this.selectedService,
      form: this.requestForm,
      calculatedPrice: this.totalPrice
    });
    
    this.closeRequestModal();
    this.resetForm();
    // TODO: Добавить уведомление об успешной отправке
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
