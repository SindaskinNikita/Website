import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
    selector: 'app-add-employee-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="modal-overlay" (click)="onClose()">
            <div class="modal-content" (click)="$event.stopPropagation()">
                <div class="modal-header">
                    <h3>{{isEditing ? 'Редактировать сотрудника' : 'Добавить сотрудника'}}</h3>
                    <button class="close-btn" (click)="onClose()">
                        <i class="fas fa-times"></i>
                    </button>
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
                            <label for="location">Объект</label>
                            <input type="text" id="location" [(ngModel)]="employee.location" name="location" required>
                        </div>
                        <div class="form-group">
                            <label for="status">Статус</label>
                            <select id="status" [(ngModel)]="employee.status" name="status" required>
                                <option value="active">Активен</option>
                                <option value="inactive">Неактивен</option>
                            </select>
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
            background-color: white;
            border-radius: 8px;
            width: 100%;
            max-width: 500px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
            padding: 1rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h3 {
            margin: 0;
            color: #2c3e50;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 1.25rem;
            cursor: pointer;
            color: #7f8c8d;
            padding: 0.5rem;
        }

        .modal-body {
            padding: 1rem;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #2c3e50;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .cancel-btn,
        .submit-btn {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
        }

        .cancel-btn {
            background-color: #ecf0f1;
            border: 1px solid #bdc3c7;
            color: #2c3e50;
        }

        .submit-btn {
            background-color: #2ecc71;
            border: none;
            color: white;
        }

        .submit-btn:hover {
            background-color: #27ae60;
        }
    `]
})
export class AddEmployeeModalComponent implements OnInit {
    @Input() employeeToEdit: Employee | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() employeeAdded = new EventEmitter<Employee>();
    @Output() employeeUpdated = new EventEmitter<Employee>();

    employee: Omit<Employee, 'id'> = {
        name: '',
        position: '',
        location: '',
        status: 'active'
    };

    isEditing: boolean = false;

    constructor(private employeeService: EmployeeService) {}

    ngOnInit(): void {
        if (this.employeeToEdit) {
            this.isEditing = true;
            this.employee = {
                name: this.employeeToEdit.name,
                position: this.employeeToEdit.position,
                location: this.employeeToEdit.location,
                status: this.employeeToEdit.status
            };
        }
    }

    onClose(): void {
        this.close.emit();
    }

    onSubmit(): void {
        if (this.isEditing && this.employeeToEdit) {
            this.employeeService.updateEmployee(this.employeeToEdit.id, this.employee).subscribe(
                (updatedEmployee: Employee) => {
                    this.employeeUpdated.emit(updatedEmployee);
                    this.onClose();
                },
                (error: Error) => {
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
                    console.error('Ошибка при добавлении сотрудника:', error);
                }
            );
        }
    }
} 