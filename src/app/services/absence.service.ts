import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface AbsenceDTO {
  id: number;
  dateOfAbsence: Date;
  numberOfPeriod: string;
  subject: string;
  absenceState: string;
  absenceType: string;
  dateAdded: Date;
  studentId: number;
  scheduleSummaryDTO: {
    id: number;
    dayOfTheWeek: string;
    numberOfPeriod: string;
    subject: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AbsenceService {
  private apiUrl = 'http://localhost:8081/absence';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAbsencesByStudentId(studentId: number): Observable<AbsenceDTO[]> {
    const token = localStorage.getItem('authToken'); // or whatever your key is
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.get<AbsenceDTO[]>(
      `${this.apiUrl}/fetch/by-student/${studentId}`,
      { headers }
    );
  }

  deleteAbsence(absenceId: number): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) return of([]);

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.delete(`${this.apiUrl}/delete/${absenceId}`, {
      headers,
    });
  }

  addAbsence(absenceData: any) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.post<any>(`${this.apiUrl}/add`, absenceData, { headers });
  }
}
