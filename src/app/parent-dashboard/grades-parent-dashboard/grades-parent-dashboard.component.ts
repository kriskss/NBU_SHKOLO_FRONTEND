import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GradeService } from '../../services/grade.service';
import { ParentService } from '../../services/parent.service';
import { StudentService } from '../../services/student.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { GradeDetail } from '../../models/gradeDetail.model';

export interface GroupedGrade {
  subject: string;
  winter: {
    tekushta: { grade: number; dateAdded: string; dateOfGrade: string }[];
    srochna: { grade: number; dateAdded: string; dateOfGrade: string }[];
  };
  spring: {
    tekushta: { grade: number; dateAdded: string; dateOfGrade: string }[];
    srochna: { grade: number; dateAdded: string; dateOfGrade: string }[];
  };
  godishna: { grade: number; dateAdded: string; dateOfGrade: string }[];
}

@Component({
  selector: 'app-grades-parent-dashboard',
  templateUrl: './grades-parent-dashboard.component.html',
  styleUrls: ['./grades-parent-dashboard.component.scss'],
})
export class GradesParentDashboardComponent implements OnInit {
  children: any[] = [];
  selectedChildId: number | null = null;
  isLoading = true;
  grades: GroupedGrade[] = [];
  secondHeaderRow: string[] = [
    'subject',
    'winterTekushta',
    'winterSrochna',
    'springTekushta',
    'springSrochna',
    'godishna',
  ];

  constructor(
    private userService: UserService,
    private gradeService: GradeService,
    private parentService: ParentService,
    private studentService: StudentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    const userId = this.userService.getUser()?.id;
    if (!userId) return;

    try {
      const parentId = await this.parentService.getParentIdByUserIdAsync(
        userId
      );
      const childIds = await firstValueFrom(
        this.parentService.getChildrenIds(parentId)
      );

      const childDetailsObservables = childIds.map((id: number) =>
        this.studentService.getStudentUserById(id)
      );

      this.children = await firstValueFrom(forkJoin(childDetailsObservables));
      console.log(this.children);

      if (this.children.length > 0) {
        // Select first child automatically
        this.selectedChildId = this.children[0].id;
        if (this.selectedChildId !== null) {
          await this.loadGrades(this.selectedChildId);
        }
      }
    } catch (error) {
      console.error('Error loading children or grades', error);
    } finally {
      this.isLoading = false;
    }
  }

  private groupGrades(rawGrades: any[]): GroupedGrade[] {
    const grouped: { [key: string]: GroupedGrade } = {};

    rawGrades.forEach((grade: any) => {
      const subject = grade.subject.title;
      if (!grouped[subject]) {
        grouped[subject] = {
          subject,
          winter: { tekushta: [], srochna: [] },
          spring: { tekushta: [], srochna: [] },
          godishna: [],
        };
      }

      const gradeInfo = {
        grade: grade.grade,
        dateAdded: grade.dateAdded,
        dateOfGrade: grade.dateOfGrade,
      };

      const term = grade.term.termType; // WINTER or SPRING
      const type = grade.gradeType; // TEKUSHTA, SROCHNA, GODISHNA

      if (term === 'WINTER') {
        if (type === 'TEKUSHTA')
          grouped[subject].winter.tekushta.push(gradeInfo);
        if (type === 'SROCHNA') grouped[subject].winter.srochna.push(gradeInfo);
      } else if (term === 'SPRING') {
        if (type === 'TEKUSHTA')
          grouped[subject].spring.tekushta.push(gradeInfo);
        if (type === 'SROCHNA') grouped[subject].spring.srochna.push(gradeInfo);
      }

      if (type === 'GODISHNA') {
        grouped[subject].godishna.push(gradeInfo);
      }
    });

    return Object.values(grouped);
  }

  async onChildSelected() {
    if (this.selectedChildId !== null) {
      await this.loadGrades(this.selectedChildId);
    }
  }

  private async loadGrades(studentId: number): Promise<void> {
    this.isLoading = true;
    try {
      await this.fetchStudentGrades(studentId);
    } catch (error) {
      console.error('Error loading grades', error);
      this.grades = [];
    } finally {
      this.isLoading = false;
    }
  }

  async fetchStudentGrades(studentId: number): Promise<void> {
    if (!studentId) {
      console.error('No student ID provided');
      return;
    }

    try {
      const rawGrades = await firstValueFrom(
        this.studentService.getStudentGrades(studentId)
      );

      const grouped: { [key: string]: GroupedGrade } = {};

      rawGrades.forEach((grade: GradeDetail) => {
        const subject = grade.subject.title;
        if (!grouped[subject]) {
          grouped[subject] = {
            subject,
            winter: { tekushta: [], srochna: [] },
            spring: { tekushta: [], srochna: [] },
            godishna: [],
          };
        }

        const gradeInfo = {
          grade: grade.grade,
          dateAdded: grade.dateAdded,
          dateOfGrade: grade.dateOfGrade,
        };

        const term = grade.term.termType; // WINTER or SPRING
        const type = grade.gradeType; // TEKUSHTA, SROCHNA, GODISHNA

        if (term === 'WINTER') {
          if (type === 'TEKUSHTA')
            grouped[subject].winter.tekushta.push(gradeInfo);
          if (type === 'SROCHNA')
            grouped[subject].winter.srochna.push(gradeInfo);
        } else if (term === 'SPRING') {
          if (type === 'TEKUSHTA')
            grouped[subject].spring.tekushta.push(gradeInfo);
          if (type === 'SROCHNA')
            grouped[subject].spring.srochna.push(gradeInfo);
        }

        if (type === 'GODISHNA') {
          grouped[subject].godishna.push(gradeInfo);
        }
      });

      this.grades = Object.values(grouped);
    } catch (error) {
      console.error('Error fetching grades:', error);
      this.grades = [];
    }
  }

  getGradeClass(grade: number): string {
    if (grade >= 5.5) {
      return 'excellent';
    } else if (grade >= 4.0) {
      return 'good';
    } else if (grade >= 3.0) {
      return 'average';
    } else {
      return 'bad';
    }
  }
}
