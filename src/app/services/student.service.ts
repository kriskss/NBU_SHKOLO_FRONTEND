import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Klass } from '../models/klass.model';
import { School } from '../models/school.model';
import { StudentDTO } from '../models/studentDTO.model';

export interface StudentExtended {
  id: number;
  klass: Klass;
  school: School;
  absences: any[];
}
@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private baseUrl = 'http://localhost:8081/student';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}`);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/fetch/${id}`);
  }

  createStudent(studentDTO: StudentDTO): Observable<Student> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }

    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.post<Student>(`${this.baseUrl}/add`, studentDTO, {
      headers,
    });
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getStudentIdByUserId(userId: number): Observable<number> {
    const token = localStorage.getItem('authToken');
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };

    return this.http.get<number>(
      `${this.baseUrl}/getStudentId/${userId}`,
      httpOptions
    );
  }

  getStudentGrades(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    });

    return this.http.get<any>(`${this.baseUrl}/fetch/studentGrades/${id}`, {
      headers,
    });
  }

  async fetchStudent(id: number): Promise<any> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }

    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return firstValueFrom(
      this.http.get<any>(`${this.baseUrl}/fetch/${id}`, { headers })
    );
  }

  getStudentIdsByKlassId(klassId: number): Observable<number[]> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }

    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.get<number[]>(
      `${this.baseUrl}/klasses/${klassId}/student-ids`,
      { headers }
    );
  }

  getStudentUserById(studentId: number): Observable<any> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.get(`${this.baseUrl}/${studentId}/user`, { headers });
  }
  getKlassByStudentId(studentId: number): Observable<Klass> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Klass>(`${this.baseUrl}/${studentId}/klass`, {
      headers,
    });
  }

  getStudentsBySchoolId(schoolId: number): Observable<StudentExtended[]> {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('authToken') || '';
    }
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });

    return this.http.get<StudentExtended[]>(
      `${this.baseUrl}/by-school/${schoolId}`,
      {
        headers,
      }
    );
  }
}
