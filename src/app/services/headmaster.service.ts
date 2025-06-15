import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeadmasterService {
  private apiUrl = 'http://localhost:8081/headmaster';

  constructor(private http: HttpClient) {}

  getSchoolByUserId(userId: number) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/user/${userId}/id`, { headers });
  }

  getSchoolByHeadmasterId(headmasterId: number) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/${headmasterId}/school`, {
      headers,
    });
  }
}
