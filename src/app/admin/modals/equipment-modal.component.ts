import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Company } from '../../services/data.service';
import { Equipment } from '../../models/equipment.model';

@Component({
    selector: 'app-equipment-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    template: `
        <div class="modal" [class.show]="isVisible" tabindex="-1" role="dialog" [style.display]="isVisible ? 'block' : 'none'">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ editMode ? 'Редактировать оборудование' : 'Добавить оборудование' }}</h5>
                        <button type="button" class="btn-close" (click)="onClose()"></button>
                    </div>
                    <div class="modal-body">
                        <form [formGroup]="form">
                            <div class="mb-3">
                                <label class="form-label">Название</label>
                                <input type="text" class="form-control" formControlName="name">
                                <div class="invalid-feedback" *ngIf="form.get('name')?.errors?.['required'] && form.get('name')?.touched">
                                    Название обязательно
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Тип</label>
                                <input type="text" class="form-control" formControlName="type">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Описание</label>
                                <textarea class="form-control" formControlName="description" rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Инвентарный номер</label>
                                <input type="text" class="form-control" formControlName="inventory_number">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Местоположение</label>
                                <input type="text" class="form-control" formControlName="location">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Дата покупки</label>
                                <input type="date" class="form-control" formControlName="purchase_date">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Дата последнего ТО</label>
                                <input type="date" class="form-control" formControlName="last_maintenance_date">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Дата следующего ТО</label>
                                <input type="date" class="form-control" formControlName="next_maintenance_date">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Статус</label>
                                <select class="form-select" formControlName="status">
                                    <option value="Активен">Активен</option>
                                    <option value="Ремонт">Ремонт</option>
                                    <option value="Тестирование">Тестирование</option>
                                    <option value="Неисправен">Неисправен</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Компания</label>
                                <select class="form-select" formControlName="company_id">
                                    <option [value]="null">Выберите компанию</option>
                                    <option *ngFor="let company of companies" [value]="company.id">
                                        {{ company.name }}
                                    </option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" (click)="onClose()">Отмена</button>
                        <button type="button" class="btn btn-primary" (click)="onSave()" [disabled]="!form.valid">
                            {{ editMode ? 'Сохранить' : 'Добавить' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show" *ngIf="isVisible"></div>
    `,
    styles: [`
        :host {
            display: block;
        }
        .modal {
            background-color: rgba(0, 0, 0, 0.5);
        }
    `]
})
export class EquipmentModalComponent {
    @Input() isVisible = false;
    @Input() editMode = false;
    @Input() companies: Company[] = [];
    @Input() set equipment(value: Equipment | null) {
        if (value) {
            this.form.patchValue({
                ...value,
                purchase_date: value.purchase_date ? new Date(value.purchase_date).toISOString().split('T')[0] : null,
                last_maintenance_date: value.last_maintenance_date ? new Date(value.last_maintenance_date).toISOString().split('T')[0] : null,
                next_maintenance_date: value.next_maintenance_date ? new Date(value.next_maintenance_date).toISOString().split('T')[0] : null
            });
        } else {
            this.form.reset({
                status: 'Активен',
                created_at: new Date()
            });
        }
    }

    @Output() saved = new EventEmitter<Partial<Equipment>>();
    @Output() closed = new EventEmitter<void>();

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            type: [''],
            status: ['Активен'],
            inventory_number: [''],
            location: [''],
            description: [''],
            purchase_date: [null],
            last_maintenance_date: [null],
            next_maintenance_date: [null],
            company_id: [null],
            created_at: [new Date()]
        });
    }

    onSave() {
        if (this.form.valid) {
            this.saved.emit(this.form.value);
        }
    }

    onClose() {
        this.closed.emit();
    }
} 