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
  private apiUrl = 'http://localhost:3000/api/facilities';

  constructor(private http: HttpClient) { }

  getFacilities(): Observable<Facility[]> {
    return this.http.get<Facility[]>(this.apiUrl);
  }

  addFacility(facility: Facility): Observable<Facility> {
    return this.http.post<Facility>(this.apiUrl, facility);
  }
} 