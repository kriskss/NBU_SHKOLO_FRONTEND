import { Component, OnInit } from '@angular/core';

export interface Grade {
  subject: string;
  grade: string;
}

const GRADES_DATA: Grade[] = [
  { subject: 'Math', grade: '3' },
  { subject: 'History', grade: '4' },
  { subject: 'Science', grade: '6' },
  // Add more subjects and grades as needed
];

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss'],
})
export class GradesComponent implements OnInit {
  displayedColumns: string[] = ['subject', 'grade'];
  grades = GRADES_DATA;

  constructor() {}

  ngOnInit(): void {}
}
