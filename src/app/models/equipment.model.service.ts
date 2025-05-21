import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../models/equipment.model';

@Injectable({
    providedIn: 'root'
})
export class EquipmentService {
    private apiUrl = 'http://localhost:3000/api/equipment';

    constructor(private http: HttpClient) {}

    getEquipment(): Observable<Equipment[]> {
        return new Observable<Equipment[]>(observer => {
            observer.next([
                {
                    id: 1,
                    name: 'Кондиционер',
                    type: 'Климатическое оборудование',
                    facility: 'Главный офис',
                    status: 'active',
                    lastMaintenance: new Date('2024-02-15'),
                    nextMaintenance: new Date('2024-05-15')
                },
                {
                    id: 2,
                    name: 'Сервер',
                    type: 'IT оборудование',
                    facility: 'Дата-центр',
                    status: 'active',
                    lastMaintenance: new Date('2024-01-20'),
                    nextMaintenance: new Date('2024-04-20')
                }
            ]);
            observer.complete();
        });
    }

    addEquipment(equipment: Equipment): Observable<Equipment> {
        return this.http.post<Equipment>(this.apiUrl, equipment);
    }

    updateEquipment(equipment: Equipment): Observable<Equipment> {
        return this.http.put<Equipment>(`${this.apiUrl}/${equipment.id}`, equipment);
    }

    deleteEquipment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
