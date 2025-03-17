import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-add-employee-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    providers: [EmployeeService],
    template: `
        <div class="modal-overlay" (click)="onClose()">
            <div class="modal-content" (click)="$event.stopPropagation()">
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
            padding: 20px;
            box-sizing: border-box;
        }

        .modal-content {
            background-color: #ffffff;
            border-radius: 4px;
            width: 100%;
            max-width: 500px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            box-sizing: border-box;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal-header {
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #ffffff;
            position: sticky;
            top: 0;
            z-index: 1;
        }

        .modal-header h3 {
            margin: 0;
            color: #333333;
            font-size: 18px;
            font-weight: 500;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            padding: 0;
            line-height: 1;
        }

        .close-btn:hover {
            color: #333;
        }

        .modal-body {
            padding: 20px;
            box-sizing: border-box;
        }

        .form-group {
            margin-bottom: 20px;
            width: 100%;
            box-sizing: border-box;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: normal;
            font-size: 14px;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            color: #333;
            background-color: #ffffff;
            box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #4CAF50;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        .cancel-btn,
        .submit-btn {
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        .cancel-btn {
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            color: #333;
        }

        .cancel-btn:hover {
            background-color: #e0e0e0;
        }

        .submit-btn {
            background-color: #4CAF50;
            border: none;
            color: white;
        }

        .submit-btn:hover {
            background-color: #45a049;
        }

        @media (max-width: 640px) {
            .modal-content {
                margin: 0;
                max-width: 100%;
                height: auto;
            }
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