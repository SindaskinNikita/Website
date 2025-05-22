import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { FacilityService } from '../services/facility.service';
import { Employee } from '../services/employee.service';
import { Facility } from '../services/facility.service';
import { AddEmployeeModalComponent } from './add-employee-modal/add-employee-modal.component';
import { AddFacilityModalComponent } from './add-facility-modal/add-facility-modal.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { NewsService } from '../services/news.service';
import { News } from '../models/news.model';
import { AddNewsModalComponent } from './add-news-modal.component';
import { EquipmentService } from '../services/equipment.service';
import { Equipment } from '../models/equipment.model';
import { AddEquipmentModalComponent } from './add-equipment-modal.component';
import { ReportService } from '../services/report.service';
import { Report } from '../models/report.model';
import { CalculationService } from '../services/calculation.service';
import { Calculation } from '../models/calculation.model';
import { SettingService } from '../services/setting.service';
import { Setting } from '../models/setting.model';
import { ReviewService } from '../services/review.service';
import { Review } from '../models/review.model';
import { FeedbackService } from '../services/feedback.service';
import { Feedback, FeedbackResponse } from '../models/feedback.model';
import { DatePipe } from '@angular/common';
import { AuthService, UserRole } from '../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule, 
        HttpClientModule, 
        FormsModule,
        DatePipe,
        AddEmployeeModalComponent, 
        AddFacilityModalComponent, 
        AddNewsModalComponent,
        AddEquipmentModalComponent
    ],
    providers: [
        EmployeeService, 
        FacilityService, 
        NewsService, 
        EquipmentService,
        ReportService,
        CalculationService,
        SettingService,
        ReviewService,
        FeedbackService
    ]
})
export class AdminComponent implements OnInit, OnDestroy {
    currentSection: string = 'dashboard';
    pageTitle: string = 'Панель управления';
    employees: Employee[] = [];
    facilities: Facility[] = [];
    filteredFacilities: Facility[] = [];
    facilitySearchQuery: string = '';
    equipments: Equipment[] = [];
    totalEmployees: number = 0;
    totalFacilities: number = 0;
    averageWorkload: number = 0;
    showAddEmployeeModal: boolean = false;
    showAddFacilityModal: boolean = false;
    showAddEquipmentModal: boolean = false;
    selectedEmployee: Employee | null = null;
    selectedFacility: Facility | null = null;
    selectedEquipment: Equipment | null = null;
    isDarkTheme: boolean = false;
    newsList: News[] = [];
    showAddNewsModal: boolean = false;
    selectedNews: News | null = null;

    reports: Report[] = [];
    showAddReportModal: boolean = false;
    selectedReport: Report | null = null;

    calculations: Calculation[] = [];
    showAddCalculationModal: boolean = false;
    selectedCalculation: Calculation | null = null;

    settings: Setting[] = [];
    settingCategories = [
        { id: 'system', title: 'Системные настройки' },
        { id: 'notification', title: 'Уведомления' },
        { id: 'security', title: 'Безопасность' },
        { id: 'appearance', title: 'Внешний вид' }
    ];

    reviews: Review[] = [];

    feedbacks: Feedback[] = [];
    selectedFeedback: Feedback | null = null;
    newResponse: string = '';

    // Добавляем свойства для управления ролями
    userRole: UserRole | null = null;
    userName: string = '';

    // Для отображения роли на русском языке
    getRoleInRussian(): string {
        if (!this.userRole) return 'Гость';
        
        switch (this.userRole) {
            case UserRole.ADMIN:
                return 'Администратор';
            case UserRole.MANAGER:
                return 'Менеджер';
            case UserRole.EMPLOYEE:
                return 'Сотрудник';
            case UserRole.GUEST:
                return 'Гость';
            default:
                return String(this.userRole);
        }
    }

    // Определяем доступ к функциям на основе ролей
    roleAccess = {
        [UserRole.ADMIN]: ['dashboard', 'employees', 'facilities', 'equipment', 'news', 'reports', 'calculations', 'reviews', 'settings', 'feedback'],
        [UserRole.MANAGER]: ['dashboard', 'employees', 'facilities', 'equipment', 'news', 'reports', 'calculations', 'reviews', 'feedback'],
        [UserRole.EMPLOYEE]: ['dashboard', 'equipment', 'news', 'calculations', 'reviews'],
        [UserRole.GUEST]: ['dashboard', 'news']
    };

    // Добавляем Subject для отмены подписок при уничтожении компонента
    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private renderer: Renderer2,
        private employeeService: EmployeeService,
        private facilityService: FacilityService,
        private newsService: NewsService,
        private equipmentService: EquipmentService,
        private reportService: ReportService,
        private calculationService: CalculationService,
        private settingService: SettingService,
        private reviewService: ReviewService,
        private feedbackService: FeedbackService,
        private authService: AuthService
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                const url = event.urlAfterRedirects;
                const section = url.split('/').pop() || 'dashboard';
                this.switchToSection(section);
            }
        });

        const savedTheme = localStorage.getItem('adminTheme');
        if (savedTheme) {
            this.isDarkTheme = savedTheme === 'dark';
        }
    }

    ngOnInit(): void {
        console.log('AdminComponent.ngOnInit()');
        
        // Подписываемся на изменения пользователя
        this.authService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                console.log('Получены данные пользователя из AuthService:', user);
                
                if (user) {
                    // Определяем роль пользователя через строковое представление
                    const roleStr = String(user.role).toLowerCase();
                    console.log('Строковое представление роли:', roleStr);
                    
                    // Устанавливаем роль по строковому представлению
                    if (roleStr === 'admin') {
                        console.log('Установка роли администратора');
                        this.userRole = UserRole.ADMIN;
                    } else if (roleStr === 'manager') {
                        console.log('Установка роли менеджера');
                        this.userRole = UserRole.MANAGER;
                    } else if (roleStr === 'employee') {
                        console.log('Установка роли сотрудника');
                        this.userRole = UserRole.EMPLOYEE;
                    } else if (roleStr === 'guest') {
                        console.log('Установка роли гостя');
                        this.userRole = UserRole.GUEST;
                    } else {
                        console.warn('Неизвестная роль пользователя:', user.role);
                        // По умолчанию устанавливаем гостевую роль
                        this.userRole = UserRole.GUEST;
                    }
                    
                    this.userName = user.username;
                    console.log('Роль пользователя установлена:', this.userRole);
                    
                    // Проверяем доступ к текущей секции после установки роли
                    if (!this.hasAccessToSection(this.currentSection)) {
                        console.log(`Нет доступа к текущей секции ${this.currentSection}, перенаправление на дашборд`);
                        this.router.navigate(['/admin/dashboard']);
                    }
                } else {
                    console.error('Пользователь не авторизован!');
                    // Перенаправляем на страницу входа
                    this.router.navigate(['/login']);
                }
            });
        
        // Явно вызываем обновление данных пользователя
        this.authService.refreshCurrentUser();

        this.loadEmployees();
        this.loadFacilities();
        this.calculateStatistics();
        this.loadTestEquipment();
        this.loadNews();
        this.loadEquipment();
        this.loadReports();
        this.loadCalculations();
        this.loadSettings();
        this.loadReviews();
        this.loadFeedbacks();
    }

    // Добавляем метод для очистки подписок при уничтожении компонента
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Проверяем, имеет ли пользователь доступ к определенной секции
    hasAccessToSection(section: string): boolean {
        console.log(`Проверка доступа к секции ${section}`);
        
        // Получаем текущего пользователя напрямую из сервиса
        const currentUser = this.authService.currentUserValue;
        console.log('Текущий пользователь при проверке доступа:', currentUser);
        
        if (!currentUser) {
            console.log('Пользователь не авторизован, доступ запрещен');
            return false;
        }
        
        // Приводим роль к строковому представлению в нижнем регистре для стабильного сравнения
        const roleStr = String(currentUser.role).toLowerCase();
        console.log('Роль пользователя (строка):', roleStr);
        
        // Если пользователь админ, всегда разрешаем доступ
        if (roleStr === 'admin') {
            console.log('Пользователь - администратор, доступ разрешен');
            return true;
        }
        
        // Для остальных ролей определяем доступные секции
        let allowedSections: string[] = [];
        
        if (roleStr === 'manager') {
            allowedSections = this.roleAccess[UserRole.MANAGER];
        } else if (roleStr === 'employee') {
            allowedSections = this.roleAccess[UserRole.EMPLOYEE];
        } else if (roleStr === 'guest') {
            allowedSections = this.roleAccess[UserRole.GUEST];
        } else {
            allowedSections = this.roleAccess[UserRole.GUEST]; // По умолчанию
        }
        
        // Проверяем наличие доступа к секции
        const hasAccess = allowedSections.includes(section);
        console.log(`Доступ ${hasAccess ? 'разрешен' : 'запрещен'} для роли ${roleStr} к секции ${section}`);
        return hasAccess;
    }

    // Проверяем, имеет ли пользователь указанную роль
    hasRole(role: UserRole): boolean {
        return this.authService.hasRole(role);
    }

    // Проверяем, имеет ли пользователь любую из указанных ролей
    hasAnyRole(roles: UserRole[]): boolean {
        return this.authService.hasAnyRole(roles);
    }

    // Метод выхода из системы
    logout(): void {
        console.log('Вызван метод logout в AdminComponent');
        // Очищаем localStorage напрямую
        localStorage.removeItem('currentUser');
        // Вызываем logout в AuthService
        this.authService.logout();
        // Перенаправляем на страницу входа
        this.router.navigate(['/login']);
    }

    toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
        localStorage.setItem('adminTheme', this.isDarkTheme ? 'dark' : 'light');
    }

    switchToSection(section: string): void {
        console.log(`Переключение на раздел: ${section}`);
        
        // Получаем текущего пользователя напрямую из сервиса
        const currentUser = this.authService.currentUserValue;
        console.log('Текущий пользователь при переключении раздела:', currentUser);
        
        if (!currentUser) {
            console.log('Пользователь не авторизован, перенаправление на страницу входа');
            this.router.navigate(['/login']);
            return;
        }
        
        // Приводим роль к строковому представлению в нижнем регистре для стабильного сравнения
        const roleStr = String(currentUser.role).toLowerCase();
        console.log('Роль пользователя (строка):', roleStr);
        
        // Если пользователь админ, всегда разрешаем доступ
        if (roleStr === 'admin') {
            console.log('Пользователь - администратор, доступ разрешен');
            this.currentSection = section;
            this.pageTitle = this.getPageTitle(section);
            
            if (section === 'employees') {
                console.log('Загружаем данные сотрудников...');
                this.loadEmployees();
            } else if (section === 'facilities') {
                console.log('Загружаем данные объектов...');
                this.loadFacilities();
            }
            return;
        }
        
        // Проверяем доступ к секции для всех остальных ролей
        if (!this.hasAccessToSection(section)) {
            console.log(`Доступ к разделу ${section} запрещен для роли ${roleStr}`);
            this.router.navigate(['/forbidden']);
            return;
        }

        this.currentSection = section;
        this.pageTitle = this.getPageTitle(section);
        
        if (section === 'employees') {
            console.log('Загружаем данные сотрудников...');
            this.loadEmployees();
        } else if (section === 'facilities') {
            console.log('Загружаем данные объектов...');
            this.loadFacilities();
        }
    }

    private getPageTitle(section: string): string {
        const titles: { [key: string]: string } = {
            'dashboard': 'Дашборд',
            'employees': 'Сотрудники',
            'facilities': 'Объекты',
            'equipment': 'Оборудование',
            'news': 'Новости',
            'reports': 'Отчеты',
            'calculations': 'Расчеты',
            'reviews': 'Отзывы',
            'settings': 'Настройки'
        };
        return titles[section] || 'Админ-панель';
    }

    private loadEmployees(): void {
        console.log('Начинаем загрузку сотрудников...');
        this.employeeService.getEmployees().subscribe(
            (employees: Employee[]) => {
                console.log('Получены сырые данные о сотрудниках:', employees);
                
                // Проверяем каждую запись
                employees.forEach((emp, index) => {
                    console.log(`Сотрудник ${index + 1}:`, {
                        id: emp.id,
                        name: emp.name,
                        position: emp.position,
                        email: emp.email,
                        phone: emp.phone,
                        created_at: emp.created_at,
                        hasData: emp.name && emp.position && emp.email && emp.phone
                    });
                });

                // Фильтруем пустые записи
                this.employees = employees.filter(emp => 
                    emp && emp.id && emp.name && emp.position && emp.email && emp.phone
                );
                
                console.log('Отфильтрованные данные:', this.employees);
                this.totalEmployees = this.employees.length;
                console.log('Общее количество сотрудников:', this.totalEmployees);
                this.calculateStatistics();
            },
            (error: Error) => {
                console.error('Ошибка при загрузке сотрудников:', error);
            }
        );
    }

    private loadFacilities(): void {
        console.log('Начинаем загрузку объектов...');
        this.facilityService.getFacilities().subscribe(
            (facilities) => {
                console.log('Получены данные об объектах:', facilities);
                this.facilities = facilities;
                this.filteredFacilities = facilities;
                this.totalFacilities = facilities.length;
                this.calculateStatistics();
            },
            (error: Error) => {
                console.error('Ошибка при загрузке объектов:', error);
            }
        );
    }

    private calculateStatistics(): void {
        // Если нет объектов, устанавливаем загрузку в 0%
        if (this.totalFacilities === 0) {
            this.averageWorkload = 0;
            return;
        }
        
        // Среднее количество сотрудников на объект
        const avgEmployeesPerFacility = this.totalEmployees / this.totalFacilities;
        
        // Оптимальное соотношение: 3 сотрудника на объект = 100% загрузки
        const optimalEmployeesPerFacility = 3;
        
        // Расчет процента загрузки (максимум 100%)
        this.averageWorkload = Math.min(
            Math.round((avgEmployeesPerFacility / optimalEmployeesPerFacility) * 100),
            100
        );
    }

    onAddEmployee(): void {
        this.selectedEmployee = null;
        this.showAddEmployeeModal = true;
    }

    onCloseAddEmployeeModal(): void {
        this.showAddEmployeeModal = false;
        this.selectedEmployee = null;
    }

    onEmployeeAdded(employee: Employee): void {
        this.employeeService.addEmployee(employee).subscribe(() => {
            this.loadEmployees();
            this.onCloseAddEmployeeModal();
        });
    }

    onEmployeeUpdated(employee: Employee): void {
        this.employeeService.updateEmployee(employee.id, employee).subscribe(() => {
            this.loadEmployees();
            this.onCloseAddEmployeeModal();
        });
    }

    onEditEmployee(employee: Employee): void {
        this.selectedEmployee = employee;
        this.showAddEmployeeModal = true;
    }

    onDeleteEmployee(employee: Employee): void {
        if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
            this.employeeService.deleteEmployee(employee.id).subscribe(
                () => {
                    this.employees = this.employees.filter(e => e.id !== employee.id);
                    this.totalEmployees = this.employees.length;
                    this.calculateStatistics();
                },
                (error: Error) => {
                    console.error('Ошибка при удалении сотрудника:', error);
                }
            );
        }
    }

    onAddFacility(): void {
        this.selectedFacility = null;
        this.showAddFacilityModal = true;
    }

    onCloseAddFacilityModal(): void {
        this.showAddFacilityModal = false;
        this.selectedFacility = null;
    }

    onFacilityAdded(newFacility: Facility): void {
        this.facilities.push(newFacility);
        this.totalFacilities = this.facilities.length;
        this.calculateStatistics();
    }

    onFacilityUpdated(updatedFacility: Facility): void {
        const index = this.facilities.findIndex(f => f.id === updatedFacility.id);
        if (index !== -1) {
            this.facilities[index] = updatedFacility;
        }
    }

    onEditFacility(facility: Facility): void {
        this.selectedFacility = facility;
        this.showAddFacilityModal = true;
    }

    onDeleteFacility(facility: Facility): void {
        if (confirm('Вы уверены, что хотите удалить этот объект?')) {
            this.facilityService.deleteFacility(facility.id).subscribe(
                () => {
                    this.facilities = this.facilities.filter(f => f.id !== facility.id);
                    this.filteredFacilities = this.filteredFacilities.filter(f => f.id !== facility.id);
                    this.totalFacilities = this.facilities.length;
                    this.calculateStatistics();
                },
                (error: Error) => {
                    console.error('Ошибка при удалении объекта:', error);
                }
            );
        }
    }

    onViewFacility(facility: Facility): void {
        // В будущем здесь будет открываться модальное окно с детальной информацией
        console.log('Просмотр объекта:', facility);
    }

    onFacilitySearch(query: string): void {
        this.facilitySearchQuery = query;
        if (!query) {
            this.filteredFacilities = this.facilities;
            return;
        }
        
        const searchQuery = query.toLowerCase();
        this.filteredFacilities = this.facilities.filter(facility => 
            facility.name.toLowerCase().includes(searchQuery) ||
            facility.address.toLowerCase().includes(searchQuery) ||
            facility.type.toLowerCase().includes(searchQuery)
        );
    }

    // Методы для работы с оборудованием
    onAddEquipment(): void {
        this.selectedEquipment = null;
        this.showAddEquipmentModal = true;
    }

    onCloseAddEquipmentModal(): void {
        this.showAddEquipmentModal = false;
        this.selectedEquipment = null;
    }

    onEquipmentAdded(equipment: Equipment): void {
        this.equipmentService.addEquipment(equipment).subscribe(() => {
            this.loadEquipment();
            this.onCloseAddEquipmentModal();
        });
    }

    onEquipmentUpdated(equipment: Equipment): void {
        this.equipmentService.updateEquipment(equipment).subscribe(() => {
            this.loadEquipment();
            this.onCloseAddEquipmentModal();
        });
    }

    onEditEquipment(equipment: Equipment): void {
        this.selectedEquipment = equipment;
        this.showAddEquipmentModal = true;
    }

    onDeleteEquipment(equipment: Equipment): void {
        if (confirm('Вы уверены, что хотите удалить это оборудование?')) {
            this.equipmentService.deleteEquipment(equipment.id).subscribe(() => {
                this.loadEquipment();
            });
        }
    }

    // Временный метод для загрузки тестовых данных оборудования
    private loadTestEquipment(): void {
        this.equipments = [
            { 
                id: 1, 
                name: 'Кондиционер FS-2500', 
                type: 'Климатическое оборудование', 
                facility: 'Офис на Ленина', 
                status: 'active',
                lastMaintenance: new Date('2023-06-15'),
                nextMaintenance: new Date('2023-09-15')
            },
            { 
                id: 2, 
                name: 'Котел Viessmann', 
                type: 'Отопительное оборудование', 
                facility: 'Складское помещение', 
                status: 'active',
                lastMaintenance: new Date('2023-04-22'),
                nextMaintenance: new Date('2023-07-22')
            },
            { 
                id: 3, 
                name: 'Компрессор AirFlow XL', 
                type: 'Промышленное оборудование', 
                facility: 'Производственный цех', 
                status: 'inactive',
                lastMaintenance: new Date('2023-01-05'),
                nextMaintenance: new Date('2023-04-05')
            },
            { 
                id: 4, 
                name: 'Система видеонаблюдения SecureView', 
                type: 'Охранное оборудование', 
                facility: 'Главный офис', 
                status: 'active',
                lastMaintenance: new Date('2023-05-30'),
                nextMaintenance: new Date('2023-08-30')
            }
        ];
    }

    loadNews() {
        this.newsService.getNews().subscribe(news => {
            this.newsList = news;
        });
    }

    onAddNews() {
        this.selectedNews = null;
        this.showAddNewsModal = true;
    }

    onEditNews(news: News) {
        this.selectedNews = news;
        this.showAddNewsModal = true;
    }

    onDeleteNews(news: News) {
        if (confirm('Вы уверены, что хотите удалить эту новость?')) {
            this.newsService.deleteNews(news.id).subscribe(() => {
                this.loadNews();
            });
        }
    }

    onCloseAddNewsModal() {
        this.showAddNewsModal = false;
        this.selectedNews = null;
    }

    onNewsAdded(news: News) {
        this.newsService.addNews(news).subscribe(() => {
            this.loadNews();
            this.onCloseAddNewsModal();
        });
    }

    onNewsUpdated(news: News) {
        this.newsService.updateNews(news).subscribe(() => {
            this.loadNews();
            this.onCloseAddNewsModal();
        });
    }

    loadEquipment() {
        this.equipmentService.getEquipment().subscribe(equipment => {
            this.equipments = equipment;
        });
    }

    // Методы для работы с отчетами
    loadReports() {
        this.reportService.getReports().subscribe((reports: Report[]) => {
            this.reports = reports;
        });
    }

    onAddReport() {
        this.selectedReport = null;
        this.showAddReportModal = true;
    }

    onEditReport(report: Report) {
        this.selectedReport = report;
        this.showAddReportModal = true;
    }

    onViewReport(report: Report) {
        // Реализация просмотра отчета
        console.log('View report:', report);
    }

    onDeleteReport(report: Report) {
        if (confirm('Вы уверены, что хотите удалить этот отчет?')) {
            this.reportService.deleteReport(report.id).subscribe(() => {
                this.loadReports();
            });
        }
    }

    // Методы для работы с расчетами
    loadCalculations() {
        this.calculationService.getCalculations().subscribe((calculations: Calculation[]) => {
            this.calculations = calculations;
        });
    }

    onAddCalculation() {
        this.selectedCalculation = null;
        this.showAddCalculationModal = true;
    }

    onEditCalculation(calculation: Calculation) {
        this.selectedCalculation = calculation;
        this.showAddCalculationModal = true;
    }

    onViewCalculation(calculation: Calculation) {
        // Реализация просмотра расчета
        console.log('View calculation:', calculation);
    }

    onDeleteCalculation(calculation: Calculation) {
        if (confirm('Вы уверены, что хотите удалить этот расчет?')) {
            this.calculationService.deleteCalculation(calculation.id).subscribe(() => {
                this.loadCalculations();
            });
        }
    }

    // Методы для работы с настройками
    loadSettings() {
        this.settingService.getSettings().subscribe(settings => {
            this.settings = settings;
        });
    }

    getSettingsByCategory(categoryId: string): Setting[] {
        return this.settings.filter(setting => setting.category === categoryId);
    }

    onSettingChange(setting: Setting) {
        this.settingService.updateSetting(setting).subscribe(updatedSetting => {
            const index = this.settings.findIndex(s => s.id === updatedSetting.id);
            if (index !== -1) {
                this.settings[index] = updatedSetting;
            }
        });
    }

    // Методы для работы с отзывами
    loadReviews() {
        this.reviewService.getReviews().subscribe(reviews => {
            this.reviews = reviews;
        });
    }

    onApproveReview(review: Review) {
        review.status = 'approved';
        this.reviewService.updateReviewStatus(review).subscribe(() => {
            this.loadReviews();
        });
    }

    onRejectReview(review: Review) {
        review.status = 'rejected';
        this.reviewService.updateReviewStatus(review).subscribe(() => {
            this.loadReviews();
        });
    }

    onAddResponse(review: Review) {
        const response = prompt('Введите ответ на отзыв:');
        if (response) {
            review.response = response;
            this.reviewService.addResponse(review).subscribe(() => {
                this.loadReviews();
            });
        }
    }

    onDeleteReview(review: Review) {
        if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
            this.reviewService.deleteReview(review.id).subscribe(() => {
                this.loadReviews();
            });
        }
    }

    loadFeedbacks() {
        this.feedbackService.getFeedback().subscribe(
            feedbacks => {
                this.feedbacks = feedbacks;
            },
            error => {
                console.error('Ошибка при загрузке обращений:', error);
            }
        );
    }

    onSelectFeedback(feedback: Feedback) {
        this.selectedFeedback = feedback;
    }

    onUpdateStatus(feedback: Feedback) {
        let newStatus: 'new' | 'in_progress' | 'resolved' | 'closed';
        
        switch (feedback.status) {
            case 'new':
                newStatus = 'in_progress';
                break;
            case 'in_progress':
                newStatus = 'resolved';
                break;
            case 'resolved':
                newStatus = 'closed';
                break;
            default:
                newStatus = 'new';
        }

        const updatedFeedback = { ...feedback, status: newStatus };
        this.feedbackService.updateFeedbackStatus(updatedFeedback).subscribe(
            updated => {
                const index = this.feedbacks.findIndex(f => f.id === updated.id);
                if (index !== -1) {
                    this.feedbacks[index] = updated;
                    if (this.selectedFeedback?.id === updated.id) {
                        this.selectedFeedback = updated;
                    }
                }
            },
            error => {
                console.error('Ошибка при обновлении статуса:', error);
            }
        );
    }

    onSendResponse() {
        if (!this.selectedFeedback || !this.newResponse.trim()) return;

        const response: FeedbackResponse = {
            id: Date.now(),
            feedbackId: this.selectedFeedback.id,
            author: 'Администратор',
            message: this.newResponse.trim(),
            date: new Date(),
            isAdmin: true
        };

        this.feedbackService.addResponse(this.selectedFeedback.id, response).subscribe(
            updatedFeedback => {
                const index = this.feedbacks.findIndex(f => f.id === updatedFeedback.id);
                if (index !== -1) {
                    this.feedbacks[index] = updatedFeedback;
                    if (this.selectedFeedback?.id === updatedFeedback.id) {
                        this.selectedFeedback = updatedFeedback;
                    }
                }
                this.newResponse = '';
            },
            error => {
                console.error('Ошибка при отправке ответа:', error);
            }
        );
    }

    onDeleteFeedback(feedback: Feedback) {
        if (confirm('Вы уверены, что хотите удалить это обращение?')) {
            this.feedbackService.deleteFeedback(feedback.id).subscribe(
                () => {
                    this.feedbacks = this.feedbacks.filter(f => f.id !== feedback.id);
                    if (this.selectedFeedback?.id === feedback.id) {
                        this.selectedFeedback = null;
                    }
                },
                error => {
                    console.error('Ошибка при удалении обращения:', error);
                }
            );
        }
    }
}
