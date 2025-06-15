import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Student } from '../../models/student.model'; // your existing model, leave it alone
import { StudentService } from '../../services/student.service';
import { StudentExtended } from '../../services/student.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../models/user.model';
import { HeadmasterService } from '../../services/headmaster.service';
import { UserService } from '../../services/user.service';

// interface StudentExtended {
//   id: number;
//   klass: Klass;
//   school: School;
//   absences: any[];
// }

@Component({
  selector: 'app-headmaster-students-tab',
  templateUrl: './headmaster-students-tab.component.html',
  styleUrls: ['./headmaster-students-tab.component.scss'],
})
export class HeadmasterStudentsTabComponent implements OnInit {
  // Use StudentExtended here, not Student (to avoid confusion with your main model)
  students: User[] = [];
  klassStudents: StudentExtended[] = [];
  schoolId: number = 5; // or get dynamically

  constructor(
    private studentService: StudentService,
    private headmasterService: HeadmasterService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  async loadStudents(): Promise<void> {
    try {
      const user = this.userService.getUser();
      if (!user) {
        console.error('User not found in userService');
        return; // Or handle redirect/login
      }
      const headmasterId = await firstValueFrom(
        this.headmasterService.getSchoolByUserId(user.id)
      );

      const schoolData = await firstValueFrom(
        this.headmasterService.getSchoolByHeadmasterId(headmasterId)
      );
      const schoolStudents = await firstValueFrom(
        this.studentService.getStudentsBySchoolId(schoolData.id)
      );

      if (!schoolStudents || schoolStudents.length === 0) {
        this.students = [];
        return;
      }
      this.klassStudents = schoolStudents;

      for (const student of schoolStudents) {
        const user = await firstValueFrom(
          this.studentService.getStudentUserById(student.id)
        );
        this.students.push(user);
      }
      console.log(this.students);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }
}
