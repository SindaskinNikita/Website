import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface FeedbackForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}

@Component({
    selector: 'app-feedback-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="feedback-container">
            <h2>Обратная связь</h2>
            <form (ngSubmit)="onSubmit()" #feedbackForm="ngForm">
                <div class="form-group">
                    <label for="name">Имя *</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        [(ngModel)]="feedback.name" 
                        required
                        #name="ngModel">
                    <div class="error" *ngIf="name.invalid && (name.dirty || name.touched)">
                        Имя обязательно для заполнения
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">Email *</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        [(ngModel)]="feedback.email" 
                        required 
                        email
                        #email="ngModel">
                    <div class="error" *ngIf="email.invalid && (email.dirty || email.touched)">
                        Введите корректный email
                    </div>
                </div>

                <div class="form-group">
                    <label for="subject">Тема</label>
                    <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        [(ngModel)]="feedback.subject">
                </div>

                <div class="form-group">
                    <label for="message">Сообщение *</label>
                    <textarea 
                        id="message" 
                        name="message" 
                        [(ngModel)]="feedback.message" 
                        required
                        #message="ngModel"
                        rows="5"></textarea>
                    <div class="error" *ngIf="message.invalid && (message.dirty || message.touched)">
                        Сообщение обязательно для заполнения
                    </div>
                </div>

                <div class="form-actions">
                    <button 
                        type="submit" 
                        [disabled]="feedbackForm.invalid || isSubmitting">
                        {{ isSubmitting ? 'Отправка...' : 'Отправить' }}
                    </button>
                </div>

                <div class="success-message" *ngIf="submitSuccess">
                    Ваше сообщение успешно отправлено!
                </div>
                <div class="error-message" *ngIf="submitError">
                    {{ submitError }}
                </div>
            </form>
        </div>
    `,
    styles: [`
        .feedback-container {
            max-width: 600px;
            margin: 2rem auto;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #333;
            margin-bottom: 1.5rem;
            text-align: center;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #555;
        }

        input, textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        textarea {
            resize: vertical;
        }

        .error {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }

        .form-actions {
            text-align: center;
            margin-top: 2rem;
        }

        button {
            padding: 0.75rem 2rem;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        button:hover:not(:disabled) {
            background-color: #45a049;
        }

        .success-message {
            color: #28a745;
            text-align: center;
            margin-top: 1rem;
            padding: 0.75rem;
            background-color: #d4edda;
            border-radius: 4px;
        }

        .error-message {
            color: #dc3545;
            text-align: center;
            margin-top: 1rem;
            padding: 0.75rem;
            background-color: #f8d7da;
            border-radius: 4px;
        }
    `]
})
export class FeedbackFormComponent {
    feedback: FeedbackForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
    };

    isSubmitting = false;
    submitSuccess = false;
    submitError = '';

    constructor(private http: HttpClient) {}

    async onSubmit() {
        if (this.isSubmitting) return;

        this.isSubmitting = true;
        this.submitSuccess = false;
        this.submitError = '';

        try {
            await this.http.post('/api/feedback', this.feedback).toPromise();
            this.submitSuccess = true;
            this.feedback = {
                name: '',
                email: '',
                subject: '',
                message: ''
            };
        } catch (error) {
            this.submitError = 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже.';
            console.error('Ошибка при отправке формы:', error);
        } finally {
            this.isSubmitting = false;
        }
    }
} 