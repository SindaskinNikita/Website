import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Facility {
  id: number;
  name: string;
  address: string;
  type: string;
  status: 'active' | 'inactive' | 'ready';
  cost: number;
}

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private apiUrl = environment.apiUrl + '/facilities';

  constructor(private http: HttpClient) { }

  getFacilities(): Observable<Facility[]> {
    // В реальном приложении здесь будет запрос к API
    return of([
      { id: 1, name: 'Офис на Ленина', address: 'ул. Ленина, 45', type: 'Офис', status: 'active', cost: 2500000 },
      { id: 2, name: 'Складское помещение', address: 'ул. Промышленная, 12', type: 'Склад', status: 'inactive', cost: 1800000 },
      { id: 3, name: 'Производственный цех', address: 'ул. Заводская, 8', type: 'Производство', status: 'ready', cost: 5600000 },
      { id: 4, name: 'Главный офис', address: 'ул. Центральная, 1', type: 'Офис', status: 'active', cost: 7200000 },
      { id: 5, name: 'Торговая точка', address: 'ул. Магазинная, 76', type: 'Торговля', status: 'inactive', cost: 1200000 }
    ]);
  }

  getFacilityById(id: number): Observable<Facility> {
    // В реальном приложении здесь будет запрос к API
    return of({
      id: id,
      name: 'Название объекта',
      address: 'Адрес объекта',
      type: 'Тип объекта',
      status: 'active',
      cost: 3000000
    });
  }

  addFacility(facility: Omit<Facility, 'id'>): Observable<Facility> {
    // В реальном приложении здесь будет POST запрос к API
    const newFacility: Facility = {
      ...facility,
      id: Math.floor(Math.random() * 1000) + 5 // Генерация случайного ID
    };
    return of(newFacility);
  }

  updateFacility(facility: Facility): Observable<Facility> {
    // В реальном приложении здесь будет PUT запрос к API
    return of(facility);
  }

  deleteFacility(id: number): Observable<void> {
    // В реальном приложении здесь будет DELETE запрос к API
    return of(undefined);
  }
} 