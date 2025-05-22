import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../../../shared/models/employee.model';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
    selector: 'app-add-employee-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="modal-overlay" (click)="onClose()">
            <div class="modal-content" [class.dark-theme]="isDarkTheme" (click)="$event.stopPropagation()">
                <div class="modal-header">
                    <h3>{{isEditing ? 'Редактировать сотрудника' : 'Добавить сотрудника'}}</h3>
                    <button class="close-btn" (click)="onClose()">×</button>
                </div>
                <div class="modal-body">
                    <form (ngSubmit)="onSubmit()">
                        <div class="form-group">
                            <label for="name">ФИО</label>
                            <input type="text" id="name" [(ngModel)]="employee.name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="position">Должность</label>
                            <input type="text" id="position" [(ngModel)]="employee.position" name="position" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" [(ngModel)]="employee.email" name="email" required>
                            <div class="error-message" *ngIf="errorMessage">{{errorMessage}}</div>
                        </div>
                        <div class="form-group">
                            <label for="phone">Телефон</label>
                            <input type="tel" id="phone" [(ngModel)]="employee.phone" name="phone" required>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="cancel-btn" (click)="onClose()">Отмена</button>
                            <button type="submit" class="submit-btn">{{isEditing ? 'Сохранить' : 'Добавить'}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .modal-content.dark-theme {
            background: #2d2d2d;
            color: #fff;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
        }

        .form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        .error-message {
            color: #dc3545;
            font-size: 14px;
            margin-top: 5px;
        }

        .cancel-btn,
        .submit-btn {
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }

        .cancel-btn {
            background: #f5f5f5;
            border: 1px solid #ddd;
        }

        .submit-btn {
            background: #4CAF50;
            color: white;
            border: none;
        }
    `]
})
export class AddEmployeeModalComponent implements OnInit {
    @Input() employeeToEdit: Employee | null = null;
    @Input() isDarkTheme: boolean = false;
    @Output() close = new EventEmitter<void>();
    @Output() employeeAdded = new EventEmitter<Employee>();
    @Output() employeeUpdated = new EventEmitter<Employee>();

    employee: Omit<Employee, 'id' | 'created_at'> = {
        name: '',
        position: '',
        email: '',
        phone: ''
    };

    isEditing: boolean = false;
    errorMessage: string = '';

    constructor(private employeeService: EmployeeService) {}

    ngOnInit(): void {
        if (this.employeeToEdit) {
            this.isEditing = true;
            this.employee = {
                name: this.employeeToEdit.name,
                position: this.employeeToEdit.position,
                email: this.employeeToEdit.email,
                phone: this.employeeToEdit.phone
            };
        }
    }

    onSubmit(): void {
        this.errorMessage = '';
        
        if (this.isEditing && this.employeeToEdit) {
            this.employeeService.updateEmployee(this.employeeToEdit.id, this.employee).subscribe(
                (updatedEmployee: Employee) => {
                    this.employeeUpdated.emit(updatedEmployee);
                    this.onClose();
                },
                (error: Error) => {
                    this.errorMessage = error.message;
                    console.error('Ошибка при обновлении сотрудника:', error);
                }
            );
        } else {
            this.employeeService.addEmployee(this.employee).subscribe(
                (newEmployee: Employee) => {
                    this.employeeAdded.emit(newEmployee);
                    this.onClose();
                },
                (error: Error) => {
                    this.errorMessage = error.message;
                    console.error('Ошибка при добавлении сотрудника:', error);
                }
            );
        }
    }

    onClose(): void {
        this.close.emit();
    }
} 