import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { KlassService } from '../../services/klass.service';
import { UserService } from '../../services/user.service';
import { HeadmasterService } from '../../services/headmaster.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-headmaster-schedule-tab',
  templateUrl: './headmaster-schedule-tab.component.html',
  styleUrls: ['./headmaster-schedule-tab.component.scss'],
})
export class HeadmasterScheduleTabComponent implements OnInit {
  klasses: any[] = [];
  selectedKlassId: number | null = null;

  filteredSchedule: any[] = [];
  mondaySchedule: any[] = [];
  tuesdaySchedule: any[] = [];
  wednesdaySchedule: any[] = [];
  thursdaySchedule: any[] = [];
  fridaySchedule: any[] = [];

  constructor(
    private scheduleService: ScheduleService,
    private klassService: KlassService,
    private userService: UserService,
    private headmasterService: HeadmasterService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.userService.getUser();
    if (!user) return;

    try {
      const headmasterId = await firstValueFrom(
        this.headmasterService.getSchoolByUserId(user.id)
      );
      const school = await firstValueFrom(
        this.headmasterService.getSchoolByHeadmasterId(headmasterId)
      );
      this.klasses = await firstValueFrom(
        this.klassService.getKlassesBySchool(school.id)
      );

      if (this.klasses.length > 0) {
        this.selectedKlassId = this.klasses[0].id;
        this.loadSchedule(this.selectedKlassId!);
      }
    } catch (error) {
      console.error('Error loading classes or schedule:', error);
    }
  }

  async loadSchedule(klassId: number) {
    try {
      this.mondaySchedule = [];
      this.tuesdaySchedule = [];
      this.wednesdaySchedule = [];
      this.thursdaySchedule = [];
      this.fridaySchedule = [];

      this.filteredSchedule = await this.scheduleService.getScheduleByKlassId(
        klassId
      );

      this.mondaySchedule = this.getScheduleByDay('Понеделник');
      this.tuesdaySchedule = this.getScheduleByDay('Вторник');
      this.wednesdaySchedule = this.getScheduleByDay('Сряда');
      this.thursdaySchedule = this.getScheduleByDay('Четвъртък');
      this.fridaySchedule = this.getScheduleByDay('Петък');
    } catch (error) {
      console.error('Failed to load schedule for klass:', error);
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

  onKlassChange(event: Event) {
    const target = event.target as HTMLSelectElement; // typecast here
    const value = target.value;
    this.selectedKlassId = Number(value);
    this.loadSchedule(this.selectedKlassId);
  }
}
