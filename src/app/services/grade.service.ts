import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { GradeDetail } from '../models/gradeDetail.model';
import { AddGradeDto } from '../models/add-grade.model';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private apiUrl = 'http://localhost:8081/grade';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  getGradesForStudent(studentId: number): Observable<GradeDetail[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }

    return this.http.get<GradeDetail[]>(`${this.apiUrl}/grades/${studentId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateGrade(grade: GradeDetail): Observable<GradeDetail> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }

    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.put<GradeDetail>(
      `${this.apiUrl}/edit/${grade.id}`,
      grade,
      { headers }
    );
  }

  addGrade(newGrade: AddGradeDto): Observable<GradeDetail> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null as any);
    }
    return this.http.post<GradeDetail>(`${this.apiUrl}/add`, newGrade, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteGrade(gradeId: number): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return of();
    }
    return this.http.delete<void>(`${this.apiUrl}/delete/${gradeId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
