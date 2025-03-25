import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Student } from '../models/student.model';
import { StudentService } from '../services/student.service';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userInfo: any;
  user: User | null = null;
  schoolName: string = 'Your School Name'; // Replace with actual school name
  studentName: string = 'Student Name'; // Replace with actual student name

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private studentService: StudentService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    // console.log(this.user);
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        this.userInfo = JSON.parse(storedUser);
      }
    } else {
      console.warn('Running on the server. Skipping localStorage.');
    }
  }

  onLogOutClicked(): void {
    this.authService.logout();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onProfileClicked(): void {
    this.router.navigate(['/profile']);
  }
}
