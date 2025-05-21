import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Calculation } from '../models/calculation.model';

@Injectable({
    providedIn: 'root'
})
export class CalculationService {
    private apiUrl = 'api/calculations';

    constructor(private http: HttpClient) {}

    getCalculations(): Observable<Calculation[]> {
        return of([
            {
                id: 1,
                name: 'Расчет стоимости обслуживания',
                type: 'cost',
                date: new Date('2024-02-01'),
                result: 150000
            },
            {
                id: 2,
                name: 'Расчет эффективности',
                type: 'efficiency',
                date: new Date('2024-02-15'),
                result: 85.5
            }
        ]);
    }

    addCalculation(calculation: Calculation): Observable<Calculation> {
        return of(calculation);
    }

    updateCalculation(calculation: Calculation): Observable<Calculation> {
        return of(calculation);
    }

    deleteCalculation(id: number): Observable<void> {
        return of(void 0);
    }
}
