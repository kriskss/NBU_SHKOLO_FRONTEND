import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { ScheduleService } from '../../services/schedule.service';
import { TeacherService } from '../../services/teacher.service';

@Component({
  selector: 'app-schedule-teacher-dashboard',
  templateUrl: './schedule-teacher-dashboard.component.html',
  styleUrls: ['./schedule-teacher-dashboard.component.scss'],
})
export class ScheduleTeacherDashboardComponent implements OnInit, OnDestroy {
  selectedKlassId!: number;
  klassSubscription!: Subscription;

  filteredSchedule: any[] = [];
  teacherId!: number | null;
  subjects: any[] = [];

  mondaySchedule: any[] = [];
  tuesdaySchedule: any[] = [];
  wednesdaySchedule: any[] = [];
  thursdaySchedule: any[] = [];
  fridaySchedule: any[] = [];

  isDataReady = false;

  constructor(
    private scheduleService: ScheduleService,
    private teacherService: TeacherService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    this.teacherId = this.teacherService.getTeacherID();
    if (this.teacherId == null) return;

    this.subjects =
      (await this.teacherService
        .fetchSubjectsByTeacherId(this.teacherId)
        .toPromise()) || [];

    this.klassSubscription = this.teacherService.selectedKlass$.subscribe(
      async (klass) => {
        if (klass && isPlatformBrowser(this.platformId)) {
          this.selectedKlassId = klass.id;

          const userInfo = localStorage.getItem('userInfo');
          const userId = userInfo ? JSON.parse(userInfo).id : null;

          if (userId) {
            this.filteredSchedule =
              await this.scheduleService.getTransformedScheduleByKlassId(
                userId,
                this.selectedKlassId
              );

            this.mondaySchedule = this.getScheduleByDay('Понеделник');
            this.tuesdaySchedule = this.getScheduleByDay('Вторник');
            this.wednesdaySchedule = this.getScheduleByDay('Сряда');
            this.thursdaySchedule = this.getScheduleByDay('Четвъртък');
            this.fridaySchedule = this.getScheduleByDay('Петък');

            this.isDataReady = true;
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.klassSubscription?.unsubscribe();
  }

  isTaughtByTeacher(subject: any): boolean {
    if (!subject || !this.subjects) return false;
    return this.subjects.some((s) => s.id === subject.id);
  }

  getScheduleByDay(day: string): any[] {
    return this.filteredSchedule
      .filter((entry) => entry.dayOfTheWeek.toLowerCase() === day.toLowerCase())
      .sort((a, b) => Number(a.numberOfPeriod) - Number(b.numberOfPeriod));
  }

  getSubjectIfTaught(schedule: any[], period: number): string | null {
    const entry = schedule.find((e) => Number(e.numberOfPeriod) === period);
    if (!entry || !entry.subject) return null;
    return this.isTaughtByTeacher(entry.subject) ? entry.subject.title : null;
  }
}
