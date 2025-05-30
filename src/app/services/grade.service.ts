import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { GradeDetail } from '../models/gradeDetail.model';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private apiUrl = 'http://localhost:8081/grade'; // Adjust if needed

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getGradesForStudent(studentId: number): Observable<GradeDetail[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }
    return this.http.get<GradeDetail[]>(`${this.apiUrl}/grades/${studentId}`);
  }

  updateGrade(grade: GradeDetail): Observable<GradeDetail> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(grade);
    }
    return this.http.put<GradeDetail>(
      `${this.apiUrl}/grades/${grade.id}`,
      grade
    );
  }

  addGrade(grade: GradeDetail): Observable<GradeDetail> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(grade);
    }
    return this.http.post<GradeDetail>(`${this.apiUrl}/grades`, grade);
  }

  deleteGrade(gradeId: number): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(undefined);
    }
    return this.http.delete<void>(`${this.apiUrl}/grades/${gradeId}`);
  }
}
