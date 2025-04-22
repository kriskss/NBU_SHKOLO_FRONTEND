import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ScheduleService } from '../services/schedule.service';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-schedule-tab',
  templateUrl: './student-schedule-tab.component.html',
  styleUrls: ['./student-schedule-tab.component.scss'],
})
export class StudentScheduleTabComponent implements OnInit {
  filteredSchedule: any[] = [];

  mondaySchedule: any[] = [];
  tuesdaySchedule: any[] = [];
  wednesdaySchedule: any[] = [];
  thursdaySchedule: any[] = [];
  fridaySchedule: any[] = [];

  constructor(
    private scheduleService: ScheduleService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userInfo = localStorage.getItem('userInfo');
      const userId = userInfo ? JSON.parse(userInfo).id : null;

      if (userId) {
        this.filteredSchedule =
          await this.scheduleService.getTransformedSchedule(userId);

        this.mondaySchedule = this.getScheduleByDay('Понеделник');
        this.tuesdaySchedule = this.getScheduleByDay('Вторник');
        this.wednesdaySchedule = this.getScheduleByDay('Сряда');
        this.thursdaySchedule = this.getScheduleByDay('Четвъртък');
        this.fridaySchedule = this.getScheduleByDay('Петък');
      }
    }
  }

  getScheduleByDay(day: string): any[] {
    return this.filteredSchedule
      .filter((entry) => entry.dayOfTheWeek.toLowerCase() === day.toLowerCase())
      .sort((a, b) => Number(a.numberOfPeriod) - Number(b.numberOfPeriod));
  }

  getSubjectTitle(schedule: any[], period: number): string {
    const entry = schedule.find((e) => e.numberOfPeriod == period);
    return entry?.subject?.title || '-';
  }
}
