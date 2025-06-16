import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Klass } from '../models/klass.model';

@Injectable({
  providedIn: 'root',
})
export class KlassService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8081/klass';

  getKlassesBySchool(schoolId: number): Observable<Klass[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Klass[]>(`${this.baseUrl}/by-school/${schoolId}`, {
      headers,
    });
  }

  addKlass(name: string, schoolId: number): Observable<any> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No authentication token found.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      name,
      schoolId,
    };

    return this.http.post(`${this.baseUrl}/add`, body, { headers });
  }

  deleteKlass(klassId: number): Observable<any> {
    const token = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/delete/${klassId}`, { headers });
  }
}
