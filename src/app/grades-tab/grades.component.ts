import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { firstValueFrom } from 'rxjs';

export interface Grade {
  subject: string;
  grade: string;
}

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss'],
})
export class GradesComponent implements OnInit {
  displayedColumns: string[] = ['subject', 'grade'];
  grades: Grade[] = [];

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
      // Use firstValueFrom inside the component
      const studentId = await firstValueFrom(
        this.studentService.getStudentIdByUserId(userId)
      );
      console.log(studentId);
      if (studentId) {
        debugger;
        this.grades = await firstValueFrom(
          this.studentService.getStudentGrades(studentId)
        );
        console.log(this.grades);
      } else {
        console.error('Student ID not found');
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  }
}
