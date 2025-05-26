import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Company } from '../../services/data.service';

@Component({
    selector: 'app-company-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
        <div class="modal" [class.show]="isVisible" tabindex="-1" role="dialog" [style.display]="isVisible ? 'block' : 'none'">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ editMode ? 'Редактировать компанию' : 'Добавить компанию' }}</h5>
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
                                <label class="form-label">Описание</label>
                                <textarea class="form-control" formControlName="description" rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Год основания</label>
                                <input type="number" class="form-control" formControlName="founded_year">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Веб-сайт</label>
                                <input type="text" class="form-control" formControlName="website">
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
export class CompanyModalComponent {
    @Input() isVisible = false;
    @Input() editMode = false;
    @Input() set company(value: Company | null) {
        if (value) {
            this.form.patchValue(value);
        } else {
            this.form.reset();
        }
    }

    @Output() saved = new EventEmitter<Partial<Company>>();
    @Output() closed = new EventEmitter<void>();

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            founded_year: [null],
            website: ['']
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