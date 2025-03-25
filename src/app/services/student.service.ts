import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private baseUrl = 'http://localhost:8081/student';

  // private httpOptions = {
  //   headers: new HttpHeaders({
  //     Authorization: 'Bearer ' + window.localStorage.getItem('token'),
  //   }),
  // };

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}`);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/fetch/${id}`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}`, student);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // getStudentIdByUserId(userId: number): Observable<number> {
  //   return this.http.get<number>(
  //     `${this.baseUrl}/getStudentId/${userId}`,
  //   );
  // }

  getStudentIdByUserId(userId: number): Observable<number> {
    const token = localStorage.getItem('authToken');
    // console.log(token);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
    // console.log(httpOptions);

    return this.http.get<number>(
      `${this.baseUrl}/getStudentId/${userId}`,
      httpOptions
    );
  }

  // getStudentIdByUserId(userId: number): Observable<number> {
  //   const token = this.authService.getToken();

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: token ? `Bearer ${token}` : '',
  //   });

  //   // Make the HTTP request with the headers
  //   return this.http.get<number>(`${this.baseUrl}/getStudentId/${userId}`, {
  //     headers,
  //   });
  // }

  getStudentGrades(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
    });

    return this.http.get<any>(`${this.baseUrl}/fetch/studentGrades/${id}`, {
      headers,
    });
  }
}
