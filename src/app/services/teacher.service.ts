// src/app/services/teacher.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, EMPTY } from 'rxjs'; // Import 'of' and 'EMPTY'
import { Teacher } from '../models/teacher.model'; // Assuming Teacher has an 'id' property

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = 'http://localhost:8081/teacher';
  public teacherKlass: number | undefined;
  public teacherID?: number | null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Return type is now Observable<Teacher | null> to reflect SSR possibility
  fetchTeacherId(id: number): Observable<number | null> {
    if (!isPlatformBrowser(this.platformId)) {
      // For SSR, return an observable that emits null and completes.
      // This means `toPromise()` will resolve to `null`.
      return of(null);
      // Alternatively, if you don't want to emit anything and have `toPromise()` resolve to `undefined`:
      // return EMPTY; // Return type would be Observable<Teacher>
    }

    // Browser-specific code
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.get<number>(`${this.apiUrl}/getTeacherId/${id}`, {
      headers,
    });
  }

  fetchTeacherKlasses(teacherId?: number): Observable<any[]> {
    // Assuming klasses is an array of some objects
    if (!isPlatformBrowser(this.platformId)) {
      return of([]); // Return empty array for SSR, it completes.
    }

    // Guard against calling API with undefined teacherId if it's mandatory
    if (teacherId === undefined || teacherId === null) {
      console.warn(
        'fetchTeacherKlasses called without a teacherId. Returning empty klasses.'
      );
      return of([]); // Or throw an error, or handle as appropriate
    }

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    // Ensure your API endpoint is correct. It was `${this.apiUrl}/${teacherId}/klasses`
    // If apiUrl is 'http://localhost:8081/teacher', then this becomes
    // 'http://localhost:8081/teacher/${teacherId}/klasses'
    return this.http.get<any[]>(
      `${this.apiUrl}/${teacherId}/klasses`, // Corrected this based on your original fetchTeacherKlasses
      { headers }
    );
  }
  fetchTeacher(id: number): Observable<Teacher | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null); // Avoid SSR issues
    }

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.get<Teacher>(`${this.apiUrl}/fetch/${id}`, { headers });
  }

  fetchSubjectsByTeacherId(
    teacherId: number
  ): Observable<{ id: number; title: string }[]> {
    if (!isPlatformBrowser(this.platformId)) return of([]);

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.get<{ id: number; title: string }[]>(
      `${this.apiUrl}/${teacherId}/subjects`,
      {
        headers,
      }
    );
  }
  getTeacherID(): number | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // SSR-safe
    }

    const storedId = localStorage.getItem('teacherID');
    return storedId ? Number(storedId) : null;
  }

  setTeacherID(id: number | null): void {
    if (isPlatformBrowser(this.platformId)) {
      if (id !== null && id !== undefined) {
        localStorage.setItem('teacherID', id.toString());
      } else {
        localStorage.removeItem('teacherID');
      }
    }
  }
}
