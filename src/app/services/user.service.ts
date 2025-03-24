import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8081/user/fetchByUsername/';
  private currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromLocalStorage();
  }

  fetchUserByUsername(username: string): Observable<User> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.get<User>(`${this.apiUrl}${username}`, { headers }).pipe(
      tap((user) => {
        this.currentUser = user;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('userInfo', JSON.stringify(user));
        }
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  clearUser() {
    this.currentUser = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userInfo');
    }
  }

  // Safely load from localStorage
  private loadUserFromLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
  }

  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }
}
