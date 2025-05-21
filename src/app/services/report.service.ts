import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Report } from '../models/report.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private apiUrl = 'api/reports';

    constructor(private http: HttpClient) {}

    getReports(): Observable<Report[]> {
        return of([
            {
                id: 1,
                title: 'Ежемесячный отчет',
                type: 'financial',
                date: new Date('2024-02-01'),
                status: 'published',
                author: 'Иван Петров'
            },
            {
                id: 2,
                title: 'Отчет по обслуживанию',
                type: 'operational',
                date: new Date('2024-02-15'),
                status: 'draft',
                author: 'Мария Сидорова'
            }
        ]);
    }

    addReport(report: Report): Observable<Report> {
        return of(report);
    }

    updateReport(report: Report): Observable<Report> {
        return of(report);
    }

    deleteReport(id: number): Observable<void> {
        return of(void 0);
    }
}
