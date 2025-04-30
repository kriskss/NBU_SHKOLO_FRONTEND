import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { Student } from '../models/student.model';
import { StudentService } from '../services/student.service';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { TabService } from '../services/tab.service';

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

  @Output() userLoggedOut = new EventEmitter<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private studentService: StudentService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private tabService: TabService
  ) {}

  async ngOnInit() {
    this.userService.currentUser$.subscribe(async (user) => {
      this.user = user;
      console.log('Header updated user:', this.user);

      // Only fetch student data if the active role is student
      const activeRole = this.userService.getActiveRole();
      if (user && activeRole === 'ROLE_STUDENT') {
        this.userService.userID = user.id;
        try {
          const studentData = await this.studentService.fetchStudent(
            this.userService.userID
          );
          console.log(studentData);
          this.schoolName = studentData.klass.school.name;
        } catch (error) {
          console.error('Failed to fetch student data:', error);
        }
      }
    });

    if (!this.user) {
      this.user = this.userService.getUser();
    }
  }

  onLogOutClicked(): void {
    this.authService.logout();
    this.userService.clearUser();
    this.user = null;
    localStorage.removeItem('selectedTab');
    this.tabService.resetTab();
    this.userLoggedOut.emit();
    this.userService.clearActiveRole();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onProfileClicked(): void {
    this.router.navigate(['/profile']);
  }
}
