import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentService } from './student.service';
import { firstValueFrom } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private scheduleUrl = 'http://localhost:8081/schedule';

  constructor(
    private http: HttpClient,
    private studentService: StudentService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  async getTransformedSchedule(userId: number): Promise<any[]> {
    // Step 1: Get student ID from user ID
    const studentID: number = await firstValueFrom(
      this.studentService.getStudentIdByUserId(userId)
    );

    // Step 2: Get student details to extract class ID
    const studentData = await firstValueFrom(
      this.http.get<any>(`http://localhost:8081/student/fetch/${studentID}`, {
        headers: this.getAuthHeaders(),
      })
    );

    const classId = studentData.klass.id;
    // console.log('Class ID:', classId);

    // Step 3: Fetch all schedules
    const allSchedules = await firstValueFrom(
      this.http.get<any[]>(`${this.scheduleUrl}/fetch/all`, {
        headers: this.getAuthHeaders(),
      })
    );

    // console.log('All Schedules:', allSchedules);

    // Step 4: Filter schedules based on classId
    const filteredSchedules = allSchedules.filter(
      (schedule) => schedule.klass?.id === classId
    );

    // console.log('Filtered Schedules:', filteredSchedules);

    return filteredSchedules;
  }
}
