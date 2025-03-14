import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Facility {
  id: number;
  name: string;
  address: string;
  type: string;
  status: 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private apiUrl = `${environment.apiUrl}/facilities`;

  constructor(private http: HttpClient) { }

  getFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(this.apiUrl);
  }

  addFacility(facility: Omit<Facility, 'id'>): Observable<Facility> {
    return this.http.post<Facility>(this.apiUrl, facility);
  }

  updateFacility(id: number, facility: Partial<Facility>): Observable<Facility> {
    return this.http.put<Facility>(`${this.apiUrl}/${id}`, facility);
  }

  deleteFacility(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 