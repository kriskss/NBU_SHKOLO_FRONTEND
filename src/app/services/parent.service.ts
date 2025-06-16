import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Parent } from '../models/parent.model';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  private apiUrl = 'http://localhost:8081/parent';

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

  getChildrenIds(parentId: number): Observable<number[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<number[]>(`${this.apiUrl}/${parentId}/students`, {
      headers,
    });
  }
  async getChildrenAsync(parentId: number): Promise<any[]> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }

    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/${parentId}/students`, { headers })
    );
  }

  getParentIdByUserIdAsync(userId: number): Promise<number> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }

    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return firstValueFrom(
      this.http.get<number>(`${this.apiUrl}/getParentId/${userId}`, { headers })
    );
  }

  getParentsBySchoolId(schoolId: number): Observable<Parent[]> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }

    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.get<Parent[]>(`${this.apiUrl}/by-school/${schoolId}`, {
      headers,
    });
  }
}
