import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setting } from '../models/setting.model';

@Injectable({
    providedIn: 'root'
})
export class SettingService {
    private apiUrl = 'http://localhost:3000/api/settings';

    constructor(private http: HttpClient) {}

    getSettings(): Observable<Setting[]> {
        return this.http.get<Setting[]>(this.apiUrl);
    }

    updateSetting(setting: Setting): Observable<Setting> {
        return this.http.put<Setting>(`${this.apiUrl}/${setting.id}`, setting);
    }
}
