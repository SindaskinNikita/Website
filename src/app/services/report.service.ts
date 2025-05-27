import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report } from '../models/report.model';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private apiUrl = 'http://localhost:3000/api/reports';

    constructor(private http: HttpClient) {}

    getReports(): Observable<Report[]> {
        return this.http.get<Report[]>(this.apiUrl);
    }

    addReport(report: Report): Observable<Report> {
        return this.http.post<Report>(this.apiUrl, report);
    }

    updateReport(report: Report): Observable<Report> {
        return this.http.put<Report>(`${this.apiUrl}/${report.id}`, report);
    }

    deleteReport(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
