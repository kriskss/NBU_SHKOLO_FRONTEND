import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Term {
  id: number;
  termType: string;
}

@Injectable({
  providedIn: 'root',
})
export class TermService {
  private baseUrl = 'http://localhost:8081/term';

  constructor(private http: HttpClient) {}

  getAllTerms(): Observable<Term[]> {
    const token = localStorage.getItem('authToken') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Term[]>(`${this.baseUrl}/fetch/all`, { headers });
  }
}
