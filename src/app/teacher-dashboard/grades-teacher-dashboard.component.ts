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
  // selectedKlass: Klass | null = null;
  // students: Student[] = [];
  // grades: { [studentId: number]: GradeDetail[] } = {};
  subjects: { id: number; title: string }[] = [];
  selectedSubjectId: number | null = null;

  constructor(
    private teacherService: TeacherService,
    private gradeService: GradeService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    const teacherId = this.teacherService.getTeacherID();

    if (teacherId == null) {
      // console.error('Teacher ID is not available');
      return; // Stop execution if ID is missing
    }

    this.subjects =
      (await this.teacherService
        .fetchSubjectsByTeacherId(teacherId)
        .toPromise()) || [];

    if (this.subjects.length > 0) {
      this.selectedSubjectId = this.subjects[0].id;
    }

    // Assuming you also need to load klasses, add logic here
    // Example:
    this.klasses =
      (await this.teacherService.fetchTeacherKlasses(teacherId).toPromise()) ||
      [];
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
