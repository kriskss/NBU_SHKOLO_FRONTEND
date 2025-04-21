import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { firstValueFrom } from 'rxjs';
import { GradeDetail } from '../models/gradeDetail.model';

export interface GroupedGrade {
  subject: string;
  winter: {
    tekushta: number[];
    srochna: number[];
  };
  spring: {
    tekushta: number[];
    srochna: number[];
  };
  godishna: number[];
}

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss'],
})
export class GradesComponent implements OnInit {
  displayedColumns: string[] = ['subject', 'type', 'term', 'grade', 'date'];
  grades: GroupedGrade[] = [];

  // firstHeaderRow: string[] = [
  //   'subject',
  //   'winterGroup',
  //   'winterGroup',
  //   'springGroup',
  //   'springGroup',
  //   'godishna',
  // ];

  secondHeaderRow: string[] = [
    'subject',
    'winterTekushta',
    'winterSrochna',
    'springTekushta',
    'springSrochna',
    'godishna',
  ];

  constructor(private studentService: StudentService) {}

  async ngOnInit(): Promise<void> {
    await this.fetchStudentGrades();
  }

  async fetchStudentGrades(): Promise<void> {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      console.error('No user info found in localStorage');
      return;
    }

    const userId = JSON.parse(userInfo).id;

    try {
      const studentId = await firstValueFrom(
        this.studentService.getStudentIdByUserId(userId)
      );

      if (studentId) {
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

          const gradeValue = grade.grade;
          const term = grade.term.termType; // WINTER or SPRING
          const type = grade.gradeType; // TEKUSHTA, SROCHNA, GODISHNA

          if (term === 'WINTER') {
            if (type === 'TEKUSHTA')
              grouped[subject].winter.tekushta.push(gradeValue);
            if (type === 'SROCHNA')
              grouped[subject].winter.srochna.push(gradeValue);
          } else if (term === 'SPRING') {
            if (type === 'TEKUSHTA')
              grouped[subject].spring.tekushta.push(gradeValue);
            if (type === 'SROCHNA')
              grouped[subject].spring.srochna.push(gradeValue);
          }

          if (type === 'GODISHNA') {
            grouped[subject].godishna.push(gradeValue);
          }
        });

        this.grades = Object.values(grouped);
      } else {
        console.error('Student ID not found');
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
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
