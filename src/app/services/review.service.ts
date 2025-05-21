import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private apiUrl = 'api/reviews';

    constructor(private http: HttpClient) {}

    getReviews(): Observable<Review[]> {
        // Временные тестовые данные
        return of([
            {
                id: 1,
                author: 'Иван Петров',
                content: 'Отличный сервис, все работает как часы!',
                rating: 5,
                date: new Date('2024-02-15'),
                status: 'pending',
                facility: 'Офис на Ленина'
            },
            {
                id: 2,
                author: 'Мария Сидорова',
                content: 'Хорошее обслуживание, но есть над чем поработать.',
                rating: 4,
                date: new Date('2024-02-14'),
                status: 'approved',
                facility: 'Складское помещение',
                response: 'Спасибо за отзыв! Мы работаем над улучшением сервиса.'
            },
            {
                id: 3,
                author: 'Алексей Иванов',
                content: 'Не очень доволен качеством обслуживания.',
                rating: 2,
                date: new Date('2024-02-13'),
                status: 'rejected',
                facility: 'Производственный цех'
            }
        ]);
    }

    updateReviewStatus(review: Review): Observable<Review> {
        return of(review);
    }

    addResponse(review: Review): Observable<Review> {
        return of(review);
    }

    deleteReview(id: number): Observable<void> {
        return of(void 0);
    }
} 