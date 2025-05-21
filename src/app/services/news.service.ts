import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { News } from '../models/news.model';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private apiUrl = 'api/news';

    constructor(private http: HttpClient) {}

    getNews(): Observable<News[]> {
        // Временные тестовые данные
        return of([
            {
                id: 1,
                title: 'Обновление системы управления',
                content: 'Мы рады сообщить о выпуске новой версии системы управления. В обновлении добавлены новые функции и улучшена производительность.',
                date: new Date('2024-02-15'),
                author: 'Иванов И.И.'
            },
            {
                id: 2,
                title: 'Новый объект введен в эксплуатацию',
                content: 'Успешно завершено строительство и ввод в эксплуатацию нового производственного объекта. Объект оснащен современным оборудованием и готов к работе.',
                date: new Date('2024-02-10'),
                author: 'Петров П.П.'
            },
            {
                id: 3,
                title: 'Плановое техническое обслуживание',
                content: 'В период с 20 по 25 февраля будет проводиться плановое техническое обслуживание системы. Просим учесть возможные ограничения в работе.',
                date: new Date('2024-02-05'),
                author: 'Сидоров С.С.'
            },
            {
                id: 4,
                title: 'Новые сотрудники в команде',
                content: 'К нашей команде присоединились новые специалисты. Мы рады приветствовать их и уверены, что их опыт и знания помогут нам в развитии.',
                date: new Date('2024-02-01'),
                author: 'Иванов И.И.'
            }
        ]);
    }

    addNews(news: News): Observable<News> {
        return this.http.post<News>(this.apiUrl, news);
    }

    updateNews(news: News): Observable<News> {
        return this.http.put<News>(`${this.apiUrl}/${news.id}`, news);
    }

    deleteNews(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
