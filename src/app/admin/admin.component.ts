import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { FacilityService } from '../services/facility.service';
import { Employee } from '../services/employee.service';
import { Facility } from '../services/facility.service';
import { AddEmployeeModalComponent } from './add-employee-modal/add-employee-modal.component';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: true,
    imports: [CommonModule, AddEmployeeModalComponent]
})
export class AdminComponent implements OnInit {
    currentSection: string = 'dashboard';
    pageTitle: string = 'Панель управления';
    employees: Employee[] = [];
    facilities: Facility[] = [];
    totalEmployees: number = 0;
    totalFacilities: number = 0;
    averageWorkload: number = 0;
    showAddEmployeeModal: boolean = false;
    selectedEmployee: Employee | null = null;

    constructor(
        private router: Router,
        private employeeService: EmployeeService,
        private facilityService: FacilityService
    ) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.updateCurrentSection(event.url);
            }
        });
    }

    ngOnInit(): void {
        this.loadEmployees();
        this.loadFacilities();
        this.calculateStatistics();
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
        // Логика добавления объекта
    }

    onEditFacility(facility: Facility): void {
        // Логика редактирования объекта
    }

    onDeleteFacility(facility: Facility): void {
        // Логика удаления объекта
    }

    onLogout(): void {
        // Логика выхода из системы
    }
}
