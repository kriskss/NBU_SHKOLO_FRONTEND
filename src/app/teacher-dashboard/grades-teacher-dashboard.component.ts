import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../services/teacher.service';
import { UserService } from '../services/user.service';
import { Student } from '../models/student.model';
import { Klass } from '../models/klass.model';
import { GradeService } from '../services/grade.service';
import { GradeDetail } from '../models/gradeDetail.model';
import { StudentService } from '../services/student.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { GradeEditDialogComponent } from './grade-edit-dialog/grade-edit-dialog.component';

interface GroupedGrade {
  subject: string;
  winter: {
    tekushta: GradeDetail[];
    srochna: GradeDetail[];
  };
  spring: {
    tekushta: GradeDetail[];
    srochna: GradeDetail[];
  };
  godishna: GradeDetail[];
}

export interface AddGradeDto {
  grade: number;
  dateOfGrade: string;
  gradeType: 'TEKUSHTA' | 'SROCHNA' | 'GODISHNA';
  dateAdded: string;
  studentId: number;
  subjectId: number;
  termId: number;
}

interface StudentWithGrades {
  id: number;
  name: string;
  grades: GroupedGrade;
}

@Component({
  selector: 'app-grades-teacher-dashboard',
  templateUrl: './grades-teacher-dashboard.component.html',
  styleUrls: ['./grades-teacher-dashboard.component.scss'],
})
export class GradesTeacherDashboardComponent implements OnInit {
  teacherId: number | null = null;
  klasses: Klass[] = [];
  subjects: { id: number; title: string }[] = [];
  selectedSubjectId: number | null = null;
  private klassSubscription?: Subscription;
  studentsInClass: { id: number; fullName: string }[] = [];
  selectedKlassId: number | null = null;
  studentsWithGrades: StudentWithGrades[] = [];

  constructor(
    private teacherService: TeacherService,
    private gradeService: GradeService,
    private userService: UserService,
    private studentService: StudentService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.teacherId = this.teacherService.getTeacherID();

    if (this.teacherId == null) {
      return;
    }

    this.klasses =
      (await this.teacherService
        .fetchTeacherKlasses(this.teacherId)
        .toPromise()) || [];

    this.subjects =
      (await this.teacherService
        .fetchSubjectsByTeacherId(this.teacherId)
        .toPromise()) || [];

    if (this.subjects.length > 0) {
      this.selectedSubjectId = this.subjects[0].id;
    }

    this.klassSubscription = this.teacherService.selectedKlass$.subscribe(
      async (klass) => {
        if (klass) {
          this.selectedKlassId = klass.id;
          if (this.selectedSubjectId) {
            await this.onKlassChange();
          }
        }
      }
    );
  }

  async onKlassChange() {
    if (!this.selectedKlassId || !this.selectedSubjectId) return;

    const studentIds: number[] = await firstValueFrom(
      this.studentService.getStudentIdsByKlassId(this.selectedKlassId)
    );

    const result: StudentWithGrades[] = [];

    for (const studentId of studentIds) {
      const user = await firstValueFrom(
        this.studentService.getStudentUserById(studentId)
      );
      const studentName = `${user.firstName} ${user.lastName}`;

      const rawGrades: GradeDetail[] =
        (await this.studentService.getStudentGrades(studentId).toPromise()) ??
        [];

      const filteredGrades = rawGrades.filter(
        (g) => `${g.subject?.id}` === `${this.selectedSubjectId}`
      );
      if (filteredGrades.length === 0) {
        console.warn(
          `No grades found for student ${studentName} and subject ID ${this.selectedSubjectId}`
        );
      }

      const grouped: GroupedGrade = {
        subject: filteredGrades[0]?.subject?.title ?? '',
        winter: { tekushta: [], srochna: [] },
        spring: { tekushta: [], srochna: [] },
        godishna: [],
      };

      for (const grade of filteredGrades) {
        const term = grade.term.termType;
        const type = grade.gradeType;

        if (term === 'WINTER') {
          if (type === 'TEKUSHTA') grouped.winter.tekushta.push(grade);
          if (type === 'SROCHNA') grouped.winter.srochna.push(grade);
        } else if (term === 'SPRING') {
          if (type === 'TEKUSHTA') grouped.spring.tekushta.push(grade);
          if (type === 'SROCHNA') grouped.spring.srochna.push(grade);
        }

        if (type === 'GODISHNA') grouped.godishna.push(grade);
      }

      result.push({
        id: studentId,
        name: studentName,
        grades: grouped,
      });
    }

    this.studentsWithGrades = result;
  }

  getGradeClass(grade: number): string {
    if (grade >= 5.5) return 'grade-excellent';
    if (grade >= 4.5) return 'grade-good';
    if (grade >= 3.5) return 'grade-average';
    if (grade >= 3.0) return 'grade-pass';
    return 'grade-fail';
  }

  onSubjectChange() {
    this.onKlassChange();
  }

  getStudentsInClass(klassId: number): void {
    this.studentService.getStudentIdsByKlassId(klassId).subscribe({
      next: (studentIds: number[]) => {
        this.studentsInClass = [];

        studentIds.forEach((studentId) => {
          this.studentService.getStudentUserById(studentId).subscribe({
            next: (user) => {
              const fullName = `${user.firstName} ${user.lastName}`;
              this.studentsInClass.push({ id: studentId, fullName });
            },
            error: (err) => {
              console.error(`Failed to load student ${studentId}`, err);
            },
          });
        });
      },
      error: (err) => {
        console.error('Failed to load student IDs', err);
      },
    });
  }

  openEditGradeDialog(student: StudentWithGrades, grade: GradeDetail) {
    const dialogRef = this.dialog.open(GradeEditDialogComponent, {
      width: '400px',
      height: '200px',
      data: { grade, mode: 'edit' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;

      if (result.action === 'save') {
        try {
          await this.gradeService
            .updateGrade({ ...grade, grade: result.gradeValue })
            .toPromise();

          grade.grade = result.gradeValue;
        } catch (error) {
          console.error('Failed to update grade', error);
        }
      } else if (result.action === 'delete') {
        try {
          if (grade.id === undefined) {
            throw new Error('Grade ID is undefined, cannot delete');
          }
          await this.gradeService.deleteGrade(grade.id).toPromise();
          this.removeGradeFromLocalState(student, grade);
        } catch (error) {
          console.error('Failed to delete grade', error);
        }
      }
    });
  }

  removeGradeFromLocalState(
    student: StudentWithGrades,
    gradeToRemove: GradeDetail
  ) {
    const terms = ['winter', 'spring'] as const;
    const types = ['tekushta', 'srochna'] as const;

    terms.forEach((term) => {
      types.forEach((type) => {
        const gradesArray = student.grades[term][type];
        const index = gradesArray.findIndex((g) => g.id === gradeToRemove.id);
        if (index > -1) {
          gradesArray.splice(index, 1);
        }
      });
    });

    // Godishna
    const godishnaIndex = student.grades.godishna.findIndex(
      (g) => g.id === gradeToRemove.id
    );
    if (godishnaIndex > -1) {
      student.grades.godishna.splice(godishnaIndex, 1);
    }
  }

  addGrade(studentId: number) {
    const dialogRef = this.dialog.open(GradeEditDialogComponent, {
      width: '400px',
      data: {
        mode: 'add',
        studentId: studentId,
        subjectId: this.selectedSubjectId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'save') {
        const newGrade: AddGradeDto = {
          studentId: studentId,
          subjectId: this.selectedSubjectId!,
          termId: result.termId,
          gradeType: result.gradeType,
          grade: result.gradeValue,
          dateOfGrade: '2024-09-17',
          dateAdded: new Date().toISOString(),
        };

        this.gradeService.addGrade(newGrade).subscribe({
          next: () => {
            this.onKlassChange();
          },
          error: (err) => {
            console.error('Failed to add grade', err);
          },
        });
      }
    });
  }
}
