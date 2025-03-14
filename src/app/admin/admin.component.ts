import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { FacilityService } from '../services/facility.service';
import { Employee } from '../services/employee.service';
import { Facility } from '../services/facility.service';
import { AddEmployeeModalComponent } from './add-employee-modal/add-employee-modal.component';
import { AddFacilityModalComponent } from './add-facility-modal/add-facility-modal.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';

// Интерфейс для оборудования
export interface Equipment {
    id: number;
    name: string;
    type: string;
    facility: string;
    status: 'active' | 'inactive';
    lastMaintenance?: string;
}

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, HttpClientModule, AddEmployeeModalComponent, AddFacilityModalComponent],
    providers: [EmployeeService, FacilityService]
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

    constructor(
        private router: Router,
        private employeeService: EmployeeService,
        private facilityService: FacilityService,
        private renderer: Renderer2
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.updateCurrentSection(event.url);
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
    }

    toggleTheme(): void {
        this.isDarkTheme = !this.isDarkTheme;
        localStorage.setItem('adminTheme', this.isDarkTheme ? 'dark' : 'light');
    }

    private updateCurrentSection(url: string): void {
        const path = url.split('/');
        if (path.length > 2) {
            this.currentSection = path[2];
            this.updatePageTitle();
        }
    }

    private updatePageTitle(): void {
        const titles: { [key: string]: string } = {
            'dashboard': 'Панель управления',
            'employees': 'Управление сотрудниками',
            'facilities': 'Управление объектами',
            'equipment': 'Управление оборудованием',
            'reports': 'Отчеты',
            'settings': 'Настройки'
        };
        this.pageTitle = titles[this.currentSection] || 'Панель управления';
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
        this.facilityService.getFacilities().subscribe(
            (facilities: Facility[]) => {
                this.facilities = facilities;
                this.totalFacilities = facilities.length;
                this.calculateStatistics();
            },
            (error: Error) => {
                console.error('Ошибка при загрузке объектов:', error);
            }
        );
    }

    private calculateStatistics(): void {
        this.averageWorkload = Math.round((this.totalEmployees / (this.totalFacilities * 2)) * 100);
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

    onEquipmentAdded(newEquipment: Equipment): void {
        this.equipments.push(newEquipment);
    }

    onEquipmentUpdated(updatedEquipment: Equipment): void {
        const index = this.equipments.findIndex(e => e.id === updatedEquipment.id);
        if (index !== -1) {
            this.equipments[index] = updatedEquipment;
        }
    }

    onEditEquipment(equipment: Equipment): void {
        this.selectedEquipment = equipment;
        this.showAddEquipmentModal = true;
    }

    onDeleteEquipment(equipment: Equipment): void {
        if (confirm('Вы уверены, что хотите удалить это оборудование?')) {
            // В реальном приложении здесь был бы вызов сервиса
            this.equipments = this.equipments.filter(e => e.id !== equipment.id);
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
                lastMaintenance: '2023-06-15'
            },
            { 
                id: 2, 
                name: 'Котел Viessmann', 
                type: 'Отопительное оборудование', 
                facility: 'Складское помещение', 
                status: 'active',
                lastMaintenance: '2023-04-22'
            },
            { 
                id: 3, 
                name: 'Компрессор AirFlow XL', 
                type: 'Промышленное оборудование', 
                facility: 'Производственный цех', 
                status: 'inactive',
                lastMaintenance: '2023-01-05'
            },
            { 
                id: 4, 
                name: 'Система видеонаблюдения SecureView', 
                type: 'Охранное оборудование', 
                facility: 'Главный офис', 
                status: 'active',
                lastMaintenance: '2023-05-30'
            }
        ];
    }
}
