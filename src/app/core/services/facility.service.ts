import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facility } from '../../shared/models/facility.model';

@Injectable({
    providedIn: 'root'
})
export class FacilityService {
    private apiUrl = '/api/facilities';

    constructor(private http: HttpClient) { }

    getFacilities(): Observable<Facility[]> {
        return this.http.get<Facility[]>(this.apiUrl);
    }

    getFacility(id: number): Observable<Facility> {
        return this.http.get<Facility>(`${this.apiUrl}/${id}`);
    }

    addFacility(facility: Omit<Facility, 'id'>): Observable<Facility> {
        return this.http.post<Facility>(this.apiUrl, facility);
    }

    updateFacility(id: number, facility: Omit<Facility, 'id'>): Observable<Facility> {
        return this.http.put<Facility>(`${this.apiUrl}/${id}`, facility);
    }

    deleteFacility(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 