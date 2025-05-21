import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Feedback, FeedbackResponse } from '../models/feedback.model';

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private apiUrl = 'api/feedback';

    constructor(private http: HttpClient) {}

    getFeedback(): Observable<Feedback[]> {
        // Временные тестовые данные
        return of([
            {
                id: 1,
                author: 'Анна Смирнова',
                email: 'anna@example.com',
                subject: 'Вопрос по обслуживанию',
                message: 'Здравствуйте! Подскажите, пожалуйста, когда будет проводиться плановое обслуживание системы отопления?',
                date: new Date('2024-02-15'),
                status: 'new',
                priority: 'medium',
                responses: []
            },
            {
                id: 2,
                author: 'Петр Иванов',
                email: 'petr@example.com',
                subject: 'Срочная проблема',
                message: 'В офисе не работает кондиционер, температура поднимается. Нужна срочная помощь!',
                date: new Date('2024-02-14'),
                status: 'in_progress',
                priority: 'high',
                responses: [
                    {
                        id: 1,
                        feedbackId: 2,
                        author: 'Администратор',
                        message: 'Мы отправили специалиста. Он будет у вас в течение часа.',
                        date: new Date('2024-02-14T10:30:00'),
                        isAdmin: true
                    }
                ]
            },
            {
                id: 3,
                author: 'Мария Петрова',
                email: 'maria@example.com',
                subject: 'Предложение по улучшению',
                message: 'Хотелось бы видеть больше информации о проводимых работах на сайте.',
                date: new Date('2024-02-13'),
                status: 'resolved',
                priority: 'low',
                responses: [
                    {
                        id: 2,
                        feedbackId: 3,
                        author: 'Администратор',
                        message: 'Спасибо за предложение! Мы работаем над улучшением информативности сайта.',
                        date: new Date('2024-02-13T15:45:00'),
                        isAdmin: true
                    }
                ]
            }
        ]);
    }

    updateFeedbackStatus(feedback: Feedback): Observable<Feedback> {
        return of(feedback);
    }

    addResponse(feedbackId: number, response: FeedbackResponse): Observable<Feedback> {
        return of({
            id: feedbackId,
            author: 'Администратор',
            email: 'admin@example.com',
            subject: 'Ответ на обращение',
            message: 'Ответ добавлен',
            date: new Date(),
            status: 'in_progress',
            priority: 'medium',
            responses: [response]
        });
    }

    deleteFeedback(id: number): Observable<void> {
        return of(void 0);
    }
} 