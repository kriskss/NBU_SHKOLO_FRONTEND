import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

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
  providedIn: 'root'
})
export class AbsenceService {
  private apiUrl = 'http://localhost:8081/absence';

  constructor(private http: HttpClient) {}

  getAbsencesByStudentId(studentId: number): Observable<AbsenceDTO[]> {
    const token = localStorage.getItem('authToken'); // or whatever your key is
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });

    return this.http.get<AbsenceDTO[]>(
      `${this.apiUrl}/fetch/by-student/${studentId}`,
      { headers }
    );
  }
}
