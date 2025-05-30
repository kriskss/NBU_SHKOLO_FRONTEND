import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../services/teacher.service';
import { UserService } from '../services/user.service';
import { Student } from '../models/student.model';
import { Klass } from '../models/klass.model';
import { GradeService } from '../services/grade.service';
import { GradeDetail } from '../models/gradeDetail.model';

@Component({
  selector: 'app-grades-teacher-dashboard',
  templateUrl: './grades-teacher-dashboard.component.html',
  styleUrls: ['./grades-teacher-dashboard.component.scss'],
})
export class GradesTeacherDashboardComponent implements OnInit {
  klasses: Klass[] = [];
  selectedKlass: Klass | null = null;
  students: Student[] = [];
  grades: { [studentId: number]: GradeDetail[] } = {};

  constructor(
    private teacherService: TeacherService,
    private gradeService: GradeService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    // const user = this.userService.getUser();
    // if (!user) return;
    // const teacherInfo = await this.teacherService.fetchTeacher(user.id).toPromise();
    // this.klasses = teacherInfo.klasses || [];
    // if (this.klasses.length > 0) {
    //   this.selectKlass(this.klasses[0]);
    // }
  }

  async selectKlass(klass: Klass) {
    //   this.selectedKlass = klass;
    //   this.students = await this.teacherService.getStudentsInClass(klass.id).toPromise();
    //   for (const student of this.students) {
    //     this.grades[student.id] = await this.gradeService.getGradesForStudent(student.id).toPromise();
    //   }
    // }
    // async updateGrade(studentId: number, grade: Grade) {
    //   await this.gradeService.updateGrade(grade).toPromise();
    //   this.grades[studentId] = await this.gradeService.getGradesForStudent(studentId).toPromise();
  }
}
