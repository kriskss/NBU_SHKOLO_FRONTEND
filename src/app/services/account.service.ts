import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Data, Router } from '@angular/router';
// import { Address } from '../models/address.model';
// import { Account } from '../models/account.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = 'http://localhost:8080';
  public isAdmin: boolean = false;
  public isLogin: boolean = false;
  public currentUserId: number | undefined;
  private readonly TOKEN_KEY = 'jwt_token';

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  showErrorMessage() {
    let message = 'Sorry, Wrong Username or Password!';
    let action = 'Close';
    this._snackBar.open(message, action, { duration: 5000 });
  }

  showSuccessMessage() {
    let message = 'Congratulations, wellcome in!';
    let action = 'Close';
    this._snackBar.open(message, action, { duration: 5000 });
  }

  //   getAllAccounts(): Observable<Account[]> {
  //     return this.http.get<Account[]>(`${this.baseUrl}/account/fetch/all`);
  //   }

  //   fetchAccountById(id: number | undefined): Observable<Account> {
  //     return this.http.get<Account>(`${this.baseUrl}/account/fetch/${id}`);
  //   }

  //   getAccountByPasswordAndUsername(
  //     password: string,
  //     username: string
  //   ): Observable<Account> {
  //     const params = new HttpParams()
  //       .set('password', password)
  //       .set('username', username);

  //     return this.http.get<Account>(
  //       `${this.baseUrl}/account/by-password-username`,
  //       { params }
  //     );
  //   }

  //   login(token: string): void {
  //     localStorage.setItem(this.TOKEN_KEY, token);
  //     this.isLogin = true;
  //     this.router.navigateByUrl('/packages');
  //   }

  //   logout(): void {
  //     localStorage.removeItem('token');
  //     console.log(localStorage);
  //     this.isLogin = false;
  //     this.isAdmin = false;
  //     this.router.navigate(['/login']);
  //   }
}
