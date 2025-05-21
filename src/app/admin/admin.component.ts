import { Component, OnInit, Renderer2 } from '@angular/core';
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
export class AdminComponent implements OnInit {
    currentSection: string = 'dashboard';
    pageTitle: string = 'Панель управления';
    employees: Employee[] = [];
    facilities: Facility[] = [];
    equipments: Equipment[] = []; // Данные об оборудовании
    totalEmployees: number = 0;
    totalFacilities: number = 0;
    averageWorkload: number = 0;
    showAddEmployeeModal: boolean = false;
    showAddFacilityModal: boolean = false;
    showAddEquipmentModal: boolean = false; // Видимость модального окна для оборудования
    selectedEmployee: Employee | null = null;
    selectedFacility: Facility | null = null;
    selectedEquipment: Equipment | null = null; // Выбранное оборудование для редактирования
    isDarkTheme: boolean = false;
    newsList: News[] = [];
    showAddNewsModal: boolean = false;
    selectedNews: News | null = null;

    // Свойства для отчетов
    reports: Report[] = [];
    showAddReportModal: boolean = false;
    selectedReport: Report | null = null;

    // Свойства для расчетов
    calculations: Calculation[] = [];
    showAddCalculationModal: boolean = false;
    selectedCalculation: Calculation | null = null;

    // Свойства для настроек
    settings: Setting[] = [];
    settingCategories = [
        { id: 'system', title: 'Системные настройки' },
        { id: 'notification', title: 'Уведомления' },
        { id: 'security', title: 'Безопасность' },
        { id: 'appearance', title: 'Внешний вид' }
    ];

    // Методы для работы с отзывами
    reviews: Review[] = [];

    feedbacks: Feedback[] = [];
    selectedFeedback: Feedback | null = null;
    newResponse: string = '';

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
        private feedbackService: FeedbackService
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                const url = event.urlAfterRedirects;
                const section = url.split('/').pop() || 'dashboard';
                this.switchToSection(section);
            }
        });

        // Загрузка темы из localStorage
        const savedTheme = localStorage.getItem('adminTheme');
        if (savedTheme) {
            this.isDarkTheme = savedTheme === 'dark';
        }
    }

    ngOnInit(): void {
        this.loadEmployees();
        this.loadFacilities();
        this.calculateStatistics();
        this.loadTestEquipment(); // Загрузка тестовых данных
        this.loadNews();
        this.loadEquipment();
        this.loadReports();
        this.loadCalculations();
        this.loadSettings();
        this.loadReviews();
        this.loadFeedbacks();
    }

    toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
        localStorage.setItem('adminTheme', this.isDarkTheme ? 'dark' : 'light');
    }

    switchToSection(section: string) {
        this.currentSection = section;
        this.pageTitle = this.getPageTitle(section);
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
        this.employeeService.getEmployees().subscribe(
            (employees: Employee[]) => {
                this.employees = employees;
                this.totalEmployees = employees.length;
                this.calculateStatistics();
            },
            (error: Error) => {
                console.error('Ошибка при загрузке сотрудников:', error);
            }
        );
    }

    private loadFacilities(): void {
        this.facilityService.getFacilities().subscribe(facilities => {
            this.facilities = facilities;
            this.totalFacilities = facilities.length;
            this.calculateStatistics();
        });
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

    onEmployeeAdded(newEmployee: Employee): void {
        this.employees.push(newEmployee);
        this.totalEmployees = this.employees.length;
        this.calculateStatistics();
    }

    onEmployeeUpdated(updatedEmployee: Employee): void {
        const index = this.employees.findIndex(e => e.id === updatedEmployee.id);
        if (index !== -1) {
            this.employees[index] = updatedEmployee;
        }
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
                    this.totalFacilities = this.facilities.length;
                    this.calculateStatistics();
                },
                (error: Error) => {
                    console.error('Ошибка при удалении объекта:', error);
                }
            );
        }
    }

    onLogout(): void {
        // Логика выхода из системы
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
