import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentService } from './student.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Student } from '../models/student.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private scheduleUrl = 'http://localhost:8081/schedule';

  constructor(
    private http: HttpClient,
    private studentService: StudentService,
    @Inject(PLATFORM_ID) private platformId: Object
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
    const studentData = await this.studentService.fetchStudent(studentID);

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

  async getTransformedScheduleByKlassId(
    userId: number,
    klassIdOverride?: number
  ): Promise<any[]> {
    let klassId: number;

    if (klassIdOverride != null) {
      klassId = klassIdOverride;
    } else {
      // Step 1: Get student ID from user ID
      const studentID: number = await firstValueFrom(
        this.studentService.getStudentIdByUserId(userId)
      );

      // Step 2: Get student details to extract class ID
      const studentData = await this.studentService.fetchStudent(studentID);
      klassId = studentData.klass.id;
    }

    // Step 3: Fetch all schedules
    const allSchedules = await firstValueFrom(
      this.http.get<any[]>(`${this.scheduleUrl}/fetch/all`, {
        headers: this.getAuthHeaders(),
      })
    );

    // Step 4: Filter schedules based on klassId
    const filteredSchedules = allSchedules.filter(
      (schedule) => schedule.klass?.id === klassId
    );

    return filteredSchedules;
  }

  async getScheduleByKlassId(klassId: number): Promise<any[]> {
    const allSchedules = await firstValueFrom(
      this.http.get<any[]>(`${this.scheduleUrl}/fetch/all`, {
        headers: this.getAuthHeaders(),
      })
    );

    return allSchedules.filter((schedule) => schedule.klass?.id === klassId);
  }

  async addScheduleEntry(entry: any): Promise<any> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
    return await firstValueFrom(
      this.http.post(`${this.scheduleUrl}/add`, entry, {
        headers,
      })
    );
  }

  editScheduleEntry(entry: any): Promise<any> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
    return firstValueFrom(
      this.http.patch(`${this.scheduleUrl}/edit/${entry.id}`, entry, {
        headers,
      })
    );
  }
}
