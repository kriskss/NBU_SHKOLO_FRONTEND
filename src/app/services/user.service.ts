import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8081/user/fetchByUsername/';
  private currentUser: User | null = null;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromLocalStorage();
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('userInfo', JSON.stringify(user)); // Store in local storage
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  fetchUserByUsername(username: string): Observable<User> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.get<User>(`${this.apiUrl}${username}`, { headers }).pipe(
      tap((user) => {
        // debugger;
        this.currentUser = user;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('userInfo', JSON.stringify(user));
        }
      })
    );
  }

  get user(): User | null {
    // debugger;
    return this.currentUser;
  }

  // getCurrentUser(): User | null {
  //   debugger;
  //   return this.currentUser;
  // }

  clearUser() {
    this.currentUser = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userInfo');
    }
  }

  loadUserFromLocalStorage(): any {
    if (isPlatformBrowser(this.platformId)) {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  }

  // Safely load from localStorage
  // private loadUserFromLocalStorage() {
  //   debugger;
  //   if (isPlatformBrowser(this.platformId)) {
  //     const storedUser = localStorage.getItem('userInfo');
  //     if (storedUser !== 'undefined' && storedUser !== null) {
  //       this.currentUser = JSON.parse(storedUser);
  //     }
  //   }
  // }

  private getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }
}
