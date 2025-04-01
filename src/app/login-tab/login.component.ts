import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        if (response.token) {
          this.authService.storeToken(response.token);
          this.userService.fetchUserByUsername(this.username).subscribe(
            (userInfo) => {
              console.log('User Info:', userInfo);
              this.userService.setUser(userInfo); // Update user state
              this.router.navigate(['/grades']);
            },
            (error) => console.error('Failed to fetch user info:', error)
          );
        }
      },
      (error) => {
        console.error('Login failed', error);
        alert('Invalid credentials. Please try again.');
      }
    );
  }

  // onLogin() {
  //   this.authService.login(this.username, this.password).subscribe(
  //     (response) => {
  //       if (response.token) {
  //         this.authService.storeToken(response.token);
  //         // Fetch user info and save it
  //         this.userService.fetchUserByUsername(this.username).subscribe(
  //           (userInfo) => {
  //             console.log('User Info:', userInfo);
  //             this.router.navigate(['/grades']);
  //           },
  //           (error) => {
  //             console.error('Failed to fetch user info:', error);
  //           }
  //         );
  //       }
  //     },
  //     (error) => {
  //       console.error('Login failed', error);
  //       alert('Invalid credentials. Please try again.');
  //     }
  //   );
  // }

  // onLogin() {
  //   this.authService.login(this.username, this.password).subscribe(
  //     (response) => {
  //       console.log('Login response:', response); // Log response to check token
  //       if (response.token) {
  //         this.authService.storeToken(response.token);
  //         this.router.navigate(['/grades']);
  //       }
  //     },
  //     (error) => {
  //       console.error('Login failed', error);
  //       alert('Invalid credentials. Please try again.');
  //     }
  //   );
  // }
}
