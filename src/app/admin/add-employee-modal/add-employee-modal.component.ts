import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-add-employee-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
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
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            margin: 20px;
        }

        .modal-content.dark-theme {
            background: #2d2d2d;
            color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .modal-content.dark-theme input,
        .modal-content.dark-theme select {
            background: #3d3d3d;
            border-color: #4d4d4d;
            color: #fff;
        }

        .modal-content.dark-theme input:focus,
        .modal-content.dark-theme select:focus {
            border-color: #6d6d6d;
            box-shadow: 0 0 0 2px rgba(109, 109, 109, 0.25);
        }

        .modal-content.dark-theme .cancel-btn {
            background: #4d4d4d;
            color: #fff;
            border-color: #5d5d5d;
        }

        .modal-content.dark-theme .cancel-btn:hover {
            background: #5d5d5d;
        }

        .modal-content.dark-theme .submit-btn {
            background: #2e7d32;
        }

        .modal-content.dark-theme .submit-btn:hover {
            background: #1b5e20;
        }

        .modal-content.dark-theme .close-btn {
            color: #fff;
        }

        .modal-content.dark-theme .close-btn:hover {
            color: #ddd;
        }

        .modal-content.dark-theme label {
            color: #ddd;
        }

        .modal-content.dark-theme .error-message {
            color: #ff6b6b;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }

        .modal-content.dark-theme .modal-header {
            border-bottom-color: #4d4d4d;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: inherit;
            transition: color 0.3s ease;
        }

        .close-btn:hover {
            color: #666;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .error-message {
            color: #dc3545;
            font-size: 14px;
            margin-top: 5px;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }

        .modal-content.dark-theme .modal-footer {
            border-top-color: #4d4d4d;
        }

        .cancel-btn,
        .submit-btn {
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .cancel-btn {
            background: #f5f5f5;
            border: 1px solid #ddd;
            color: #333;
        }

        .cancel-btn:hover {
            background: #e5e5e5;
        }

        .submit-btn {
            background: #4CAF50;
            color: white;
            border: none;
        }

        .submit-btn:hover {
            background: #45a049;
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