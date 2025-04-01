import { Component } from '@angular/core';

@Component({
  selector: 'app-student-schedule-tab',
  templateUrl: './student-schedule-tab.component.html',
  styleUrls: ['./student-schedule-tab.component.scss'],
})
export class StudentScheduleTabComponent {
  schedule: {
    [key: string]: { subject: string; time: string; period: number }[];
  } = {
    Monday: [
      { subject: 'Mathematics', time: '08:00 - 09:30', period: 1 },
      { subject: 'Physics', time: '10:00 - 11:30', period: 2 },
    ],
    Tuesday: [
      { subject: 'English', time: '09:00 - 10:30', period: 1 },
      { subject: 'History', time: '11:00 - 12:30', period: 2 },
    ],
    Wednesday: [{ subject: 'Biology', time: '08:30 - 10:00', period: 1 }],
    Thursday: [{ subject: 'Chemistry', time: '09:30 - 11:00', period: 1 }],
    Friday: [{ subject: 'Computer Science', time: '10:00 - 11:30', period: 1 }],
  };
}
