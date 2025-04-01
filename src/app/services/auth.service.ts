import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/v1/auth/login';

  // private currentUserSubject = new BehaviorSubject<User | null>(null);
  // public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // The login method where we include the token in the header if it exists
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // If token exists, add it to the headers
      Authorization: 'Bearer ' + this.getToken() || '',
    });

    return this.http.post<any>(
      this.apiUrl,
      { username, password },
      { headers }
    );
  }

  // login(username: string, password: string): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: 'Bearer ' + this.getToken() || '',
  //   });

  //   return this.http
  //     .post<any>(this.apiUrl, { username, password }, { headers })
  //     .pipe(
  //       tap((response) => {
  //         if (response.token) {
  //           this.storeToken(response.token);
  //           this.storeUser(response.user); // Store the user and update the observable
  //         }
  //       })
  //     );
  // }

  // private storeUser(user: User): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.setItem('userInfo', JSON.stringify(user));
  //   }
  //   this.currentUserSubject.next(user); // Notify subscribers (header updates automatically)
  // }

  // private loadStoredUser(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const storedUser = localStorage.getItem('userInfo');
  //     if (storedUser) {
  //       debugger;
  //       this.currentUserSubject.next(JSON.parse(storedUser));
  //     }
  //   }
  // }

  storeToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken'); // Only in the browser
    }
    return false;
  }

  // isAuthenticated(): boolean {
  //   return !!this.getToken();
  // }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
    this.router.navigate(['/login']);
  }

  // logout(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.removeItem('authToken');
  //     localStorage.removeItem('userInfo');
  //   }
  //   this.currentUserSubject.next(null); // Reset the user state
  //   this.router.navigate(['/login']);
  // }
}
