import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Facility, FacilityStatus, FacilityType } from '../../services/facility.service';

@Component({
    selector: 'app-add-facility-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="modal-overlay" (click)="onClose()">
            <div class="modal-content" [class.dark-theme]="isDarkTheme" (click)="$event.stopPropagation()">
                <div class="modal-header">
                    <h3>{{facilityToEdit ? 'Редактировать объект' : 'Добавить объект'}}</h3>
                    <button class="close-btn" (click)="onClose()">×</button>
                </div>
                <div class="modal-body">
                    <form (ngSubmit)="onSubmit()">
                        <div class="form-group">
                            <label for="name">Название</label>
                            <input type="text" id="name" [(ngModel)]="facility.name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="address">Адрес</label>
                            <input type="text" id="address" [(ngModel)]="facility.address" name="address" required>
                        </div>
                        <div class="form-group">
                            <label for="type">Тип</label>
                            <select id="type" [(ngModel)]="facility.type" name="type" required>
                                <option value="Офис">Офис</option>
                                <option value="Склад">Склад</option>
                                <option value="Производство">Производство</option>
                                <option value="Торговля">Торговля</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="status">Статус</label>
                            <select id="status" [(ngModel)]="facility.status" name="status" required>
                                <option value="active">Активен</option>
                                <option value="inactive">Неактивен</option>
                                <option value="ready">Готов</option>
                                <option value="ready_to_rent">Готов к сдаче</option>
                                <option value="rented">Сдан</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="cost">Стоимость</label>
                            <input type="number" id="cost" [(ngModel)]="facility.cost" name="cost" required min="0">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" (click)="onClose()">Отмена</button>
                            <button type="submit" class="btn btn-primary">
                                {{facilityToEdit ? 'Сохранить' : 'Добавить'}}
                            </button>
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
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            transition: all 0.3s ease;
            margin: 20px;
        }

        .modal-content.dark-theme {
            background: #2d2d2d;
            color: #fff;
        }

        .modal-content.dark-theme input,
        .modal-content.dark-theme select {
            background: #3d3d3d;
            border-color: #4d4d4d;
            color: #fff;
            width: 100%;
            box-sizing: border-box;
        }

        .modal-content.dark-theme .btn-secondary {
            background: #4d4d4d;
            color: #fff;
            border-color: #5d5d5d;
        }

        .modal-content.dark-theme .btn-primary {
            background: #2e7d32;
        }

        .modal-content.dark-theme label {
            color: #ddd;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
            margin: 0;
            color: inherit;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: inherit;
            padding: 0;
            margin-left: 10px;
        }

        .form-group {
            margin-bottom: 15px;
            width: 100%;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
            transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .modal-body {
            width: 100%;
            box-sizing: border-box;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            width: 100%;
            box-sizing: border-box;
        }

        .btn {
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .btn-primary {
            background-color: #007bff;
            color: white;
            border: none;
        }

        .btn-primary:hover {
            background-color: #0056b3;
        }

        .btn-secondary {
            background-color: #6c757d;
            color: white;
            border: none;
        }

        .btn-secondary:hover {
            background-color: #5a6268;
        }

        @media (max-width: 576px) {
            .modal-content {
                margin: 10px;
                padding: 15px;
            }

            .form-group input,
            .form-group select {
                padding: 6px 10px;
            }

            .btn {
                padding: 6px 12px;
            }
        }
    `]
})
export class AddFacilityModalComponent implements OnInit {
    @Input() facilityToEdit: Facility | null = null;
    @Input() isDarkTheme: boolean = false;
    @Output() close = new EventEmitter<void>();
    @Output() facilityAdded = new EventEmitter<Facility>();
    @Output() facilityUpdated = new EventEmitter<Facility>();

    facility: Facility = {
        id: 0,
        name: '',
        address: '',
        type: 'Офис',
        status: 'active',
        cost: 0
    };

    ngOnInit() {
        if (this.facilityToEdit) {
            this.facility = { ...this.facilityToEdit };
        }
    }

    onSubmit() {
        if (this.facilityToEdit) {
            this.facilityUpdated.emit(this.facility);
        } else {
            this.facilityAdded.emit(this.facility);
        }
    }

    onClose() {
        this.close.emit();
    }
} 