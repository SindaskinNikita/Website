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
        return this.http.get<Equipment[]>(this.apiUrl);
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