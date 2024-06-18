import { Component, OnInit } from '@angular/core';

export interface Absence {
  date: Date;
  excused: boolean;
  subject: string;
}

const ABSENCE_DATA: Absence[] = [
  { date: new Date('2023-01-15'), excused: true, subject: 'English' },
  { date: new Date('2023-02-10'), excused: true, subject: 'Bio' },
  { date: new Date('2023-03-22'), excused: false, subject: 'Math' },
];

@Component({
  selector: 'app-absence',
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.scss'],
})
export class AbsenceComponent implements OnInit {
  displayedColumns: string[] = ['subject', 'date', 'excused'];
  absences = ABSENCE_DATA;

  constructor() {}

  ngOnInit(): void {}
}
