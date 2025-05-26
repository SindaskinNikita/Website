import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Contact, Company } from '../../services/data.service';

@Component({
    selector: 'app-contact-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
        <div class="modal" [class.show]="isVisible" tabindex="-1" role="dialog" [style.display]="isVisible ? 'block' : 'none'">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ editMode ? 'Редактировать контакт' : 'Добавить контакт' }}</h5>
                        <button type="button" class="btn-close" (click)="onClose()"></button>
                    </div>
                    <div class="modal-body">
                        <form [formGroup]="form">
                            <div class="mb-3">
                                <label class="form-label">ФИО</label>
                                <input type="text" class="form-control" formControlName="name">
                                <div class="invalid-feedback" *ngIf="form.get('name')?.errors?.['required'] && form.get('name')?.touched">
                                    ФИО обязательно
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" formControlName="email">
                                <div class="invalid-feedback" *ngIf="form.get('email')?.errors?.['email'] && form.get('email')?.touched">
                                    Некорректный email
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Телефон</label>
                                <input type="tel" class="form-control" formControlName="phone">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Должность</label>
                                <input type="text" class="form-control" formControlName="position">
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
export class ContactModalComponent {
    @Input() isVisible = false;
    @Input() editMode = false;
    @Input() companies: Company[] = [];
    @Input() set contact(value: Contact | null) {
        if (value) {
            this.form.patchValue(value);
        } else {
            this.form.reset();
        }
    }

    @Output() saved = new EventEmitter<Partial<Contact>>();
    @Output() closed = new EventEmitter<void>();

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.email]],
            phone: [''],
            position: [''],
            company_id: [null]
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