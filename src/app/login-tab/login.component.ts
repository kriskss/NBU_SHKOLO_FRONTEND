import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { TabService } from '../services/tab.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  roles: any[] = [];
  selectedRole: string | null = null;
  loginStep: 'credentials' | 'roleSelection' = 'credentials';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private tabService: TabService
  ) {}

  async onLogin() {
    try {
      const response = await firstValueFrom(
        this.authService.login(this.username, this.password)
      );
      if (!response.token) throw new Error('No token');

      this.authService.storeToken(response.token);

      const userInfo = await firstValueFrom(
        this.userService.fetchUserByUsername(this.username)
      );
      this.userService.setUser(userInfo);
      this.roles = userInfo.authorities;

      if (this.roles.length === 1) {
        this.userService.userRole = this.roles[0].authority;
        this.selectedRole = this.roles[0].authority;
        this.finalizeLogin();
      } else {
        this.userService.isMoreThanOneRole = true;
        this.loginStep = 'roleSelection';
      }
      console.log(this.userService.isMoreThanOneRole);
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Please check your credentials.');
    }
  }

  onRoleSelected() {
    if (!this.selectedRole) return;
    this.finalizeLogin();
  }

  finalizeLogin() {
    if (!this.selectedRole) return;

    this.userService.setActiveRole(this.selectedRole);
    this.tabService.resetTab();
    this.navigateByRole(this.selectedRole);
  }

  private navigateByRole(role: string) {
    switch (role) {
      case 'ROLE_STUDENT':
        this.router.navigate(['/grades']);
        break;
      case 'ROLE_TEACHER':
        this.router.navigate(['/teacher-dashboard']);
        break;
      case 'ROLE_PARENT':
        this.router.navigate(['/parent-dashboard']);
        break;
      case 'ROLE_USER':
        this.router.navigate(['/user-dashboard']);
        break;
      case 'ROLE_ADMIN':
        this.router.navigate(['/admin-dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
