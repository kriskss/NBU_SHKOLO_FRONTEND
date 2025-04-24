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

  private currentTabSubject = new BehaviorSubject<number>(0);
  public currentTab$ = this.currentTabSubject.asObservable();

  public userRole: any[] = [];
  public userID: number = 1;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromLocalStorage();
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
    // this.currentTabSubject.next(0);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userInfo', JSON.stringify(user));
      this.userID = user.id;
      this.userRole = user.authorities;
    }
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
        this.setUser(user);
      })
    );
  }

  clearUser(): void {
    this.currentUserSubject.next(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userInfo');
    }
  }

  private loadUserFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      }
    }
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
