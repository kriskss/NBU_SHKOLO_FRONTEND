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
import { TeacherService } from '../services/teacher.service';
import { firstValueFrom } from 'rxjs';
import { HeadmasterService } from '../services/headmaster.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userInfo: any;
  user: User | null = null;
  schoolName: string = 'Your School Name';
  studentName: string = 'Student Name';
  className: string = '';

  klasses: any[] = [];
  selectedClass: any = null;

  @Output() userLoggedOut = new EventEmitter<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private studentService: StudentService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private tabService: TabService,
    private teacherService: TeacherService,
    private headmasterService: HeadmasterService
  ) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(async (user) => {
      this.user = user;
      console.log('Header updated user:', this.user);

      const activeRole = this.userService.getActiveRole();

      if (user && activeRole === 'ROLE_PARENT') {
        this.schoolName = 'Родител';
      } else if (user && activeRole === 'ROLE_STUDENT') {
        this.userService.userID = user.id;
        try {
          const studentData = await this.studentService.fetchStudent(
            this.userService.userID
          );
          this.schoolName = studentData.klass.school.name;
        } catch (error) {
          console.error('Failed to fetch student data:', error);
          this.schoolName = 'Student Data Error';
        }
      } else if (user && activeRole === 'ROLE_TEACHER') {
        try {
          const teacherObject = await firstValueFrom(
            this.teacherService.fetchTeacherId(user.id)
          );
          this.teacherService.setTeacherID(teacherObject);

          if (teacherObject) {
            const klassesArray = await firstValueFrom(
              this.teacherService.fetchTeacherKlasses(teacherObject)
            );
            const teacherData = await firstValueFrom(
              this.teacherService.fetchTeacher(teacherObject)
            );
            this.schoolName = teacherData?.schools?.[0]?.name ?? '';

            if (klassesArray && klassesArray.length > 0) {
              this.klasses = klassesArray;
              if (this.klasses[0]) {
                this.setClass(this.klasses[0]);
              } else {
                this.className = '';
                this.schoolName = 'School Info Unavailable';
              }
            } else {
              this.klasses = [];
              this.className = '';
              this.schoolName = 'No Classes Assigned';
            }
          } else {
            this.klasses = [];
            this.className = '';
            this.schoolName = 'Teacher Data Unavailable';
          }
        } catch (error) {
          console.error('Failed to fetch teacher info or klasses:', error);
          this.klasses = [];
          this.className = '';
          this.schoolName = 'Error Loading Teacher Data';
        }
      } else if (user && activeRole === 'ROLE_HEADMASTER') {
        try {
          const headmasterId = await firstValueFrom(
            this.headmasterService.getSchoolByUserId(user.id)
          );

          const schoolData = await firstValueFrom(
            this.headmasterService.getSchoolByHeadmasterId(headmasterId)
          );

          this.schoolName = schoolData?.name || 'Unknown School';
        } catch (error) {
          console.error('Failed to fetch headmaster school:', error);
          this.schoolName = 'School Info Unavailable';
        }
      }
    });
  }

  // NEW: sets current class and updates displayed names
  setClass(klass: any) {
    this.selectedClass = klass;
    this.className = klass.name;
    // this.teacherService.teacherKlass = this.selectedClass;
    this.teacherService.setSelectedKlass(this.selectedClass);
    // this.schoolName = klass.school.name;
  }

  onClassChange(classId: number) {
    const selected = this.klasses.find((k) => k.id === classId);
    if (selected) {
      this.selectedClass = selected;
      this.className = selected.name;

      // ✅ Notify the rest of the app
      this.teacherService.setSelectedKlass(this.selectedClass);
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
