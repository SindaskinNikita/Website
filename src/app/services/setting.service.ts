import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Setting } from '../models/setting.model';

@Injectable({
    providedIn: 'root'
})
export class SettingService {
    private apiUrl = 'api/settings';

    constructor(private http: HttpClient) {}

    getSettings(): Observable<Setting[]> {
        // Временные тестовые данные
        return of([
            {
                id: 1,
                category: 'system',
                name: 'Язык интерфейса',
                value: 'ru',
                description: 'Выберите язык интерфейса системы'
            },
            {
                id: 2,
                category: 'system',
                name: 'Часовой пояс',
                value: 'Europe/Moscow',
                description: 'Установите ваш часовой пояс'
            },
            {
                id: 3,
                category: 'notification',
                name: 'Email уведомления',
                value: true,
                description: 'Включить отправку уведомлений на email'
            },
            {
                id: 4,
                category: 'notification',
                name: 'Push уведомления',
                value: true,
                description: 'Включить push-уведомления в браузере'
            },
            {
                id: 5,
                category: 'security',
                name: 'Двухфакторная аутентификация',
                value: false,
                description: 'Включить двухфакторную аутентификацию'
            },
            {
                id: 6,
                category: 'security',
                name: 'Автоматический выход',
                value: true,
                description: 'Включить автоматический выход после периода неактивности'
            },
            {
                id: 7,
                category: 'appearance',
                name: 'Темная тема',
                value: false,
                description: 'Включить темную тему интерфейса'
            },
            {
                id: 8,
                category: 'appearance',
                name: 'Компактный режим',
                value: false,
                description: 'Включить компактный режим отображения'
            }
        ]);
    }

    updateSetting(setting: Setting): Observable<Setting> {
        return this.http.put<Setting>(`${this.apiUrl}/${setting.id}`, setting);
    }
}
