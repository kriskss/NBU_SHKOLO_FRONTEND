import { Component, OnInit } from '@angular/core';
import { ParentService } from '../../services/parent.service';
import { StudentService } from '../../services/student.service';
import { ScheduleService } from '../../services/schedule.service';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-schedule-parent-dashboard',
  templateUrl: './schedule-parent-dashboard.component.html',
  styleUrls: ['./schedule-parent-dashboard.component.scss'],
})
export class ScheduleParentDashboardComponent implements OnInit {
  children: any[] = [];
  selectedChildId!: number;
  filteredSchedule: any[] = [];

  mondaySchedule: any[] = [];
  tuesdaySchedule: any[] = [];
  wednesdaySchedule: any[] = [];
  thursdaySchedule: any[] = [];
  fridaySchedule: any[] = [];

  isLoading = true;

  constructor(
    private parentService: ParentService,
    private studentService: StudentService,
    private scheduleService: ScheduleService
  ) {}

  async ngOnInit() {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return;

    const userId = JSON.parse(userInfo).id;

    try {
      const parentId = await this.parentService.getParentIdByUserIdAsync(
        userId
      );
      const childIds = await firstValueFrom(
        this.parentService.getChildrenIds(parentId)
      );

      const childDetails = await firstValueFrom(
        forkJoin(
          childIds.map((id: number) =>
            this.studentService.getStudentUserById(id)
          )
        )
      );
      this.children = childDetails;

      if (this.children.length > 0) {
        this.selectedChildId = this.children[0].id;
        await this.loadSchedule(this.selectedChildId);
      }
    } catch (err) {
      console.error('Failed to load children or schedule', err);
    } finally {
      this.isLoading = false;
    }
  }

  async onChildSelected() {
    this.isLoading = true;
    await this.loadSchedule(this.selectedChildId);
    this.isLoading = false;
  }

  async loadSchedule(studentId: number) {
    this.filteredSchedule = await this.scheduleService.getTransformedSchedule(
      studentId
    );

    this.mondaySchedule = this.getScheduleByDay('Понеделник');
    this.tuesdaySchedule = this.getScheduleByDay('Вторник');
    this.wednesdaySchedule = this.getScheduleByDay('Сряда');
    this.thursdaySchedule = this.getScheduleByDay('Четвъртък');
    this.fridaySchedule = this.getScheduleByDay('Петък');
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
