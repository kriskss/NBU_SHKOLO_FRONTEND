import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { KlassService } from '../../services/klass.service';
import { UserService } from '../../services/user.service';
import { HeadmasterService } from '../../services/headmaster.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TermService } from '../../services/term.service';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateScheduleDialogComponent,
  CreateScheduleDialogData,
} from './create-schedule-dialog/create-schedule-dialog.component';

@Component({
  selector: 'app-headmaster-schedule-tab',
  templateUrl: './headmaster-schedule-tab.component.html',
  styleUrls: ['./headmaster-schedule-tab.component.scss'],
})
export class HeadmasterScheduleTabComponent implements OnInit {
  klasses: any[] = [];
  selectedKlassId: number | null = null;

  availableTerms: { id: number; termType: string }[] = [];
  selectedTermId: number | null = null;

  filteredSchedule: any[] = [];
  mondaySchedule: any[] = [];
  tuesdaySchedule: any[] = [];
  wednesdaySchedule: any[] = [];
  thursdaySchedule: any[] = [];
  fridaySchedule: any[] = [];

  currentTerm: { id: number; termType: string } | null = null;

  constructor(
    private scheduleService: ScheduleService,
    private klassService: KlassService,
    private userService: UserService,
    private headmasterService: HeadmasterService,
    private termService: TermService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.userService.getUser();
    if (!user) return;

    try {
      this.availableTerms = await firstValueFrom(
        this.termService.getAllTerms()
      );

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

        const winterTerm = this.availableTerms.find(
          (t) => t.termType.toUpperCase() === 'WINTER'
        );
        this.selectedTermId = winterTerm
          ? winterTerm.id
          : this.availableTerms[0]?.id || null;

        await this.loadSchedule(this.selectedKlassId!, this.selectedTermId!);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async loadSchedule(klassId: number, termId?: number) {
    try {
      this.mondaySchedule = [];
      this.tuesdaySchedule = [];
      this.wednesdaySchedule = [];
      this.thursdaySchedule = [];
      this.fridaySchedule = [];

      const schedules = await this.scheduleService.getScheduleByKlassId(
        klassId
      );

      if (termId) {
        this.selectedTermId = termId;
      }

      this.filteredSchedule = schedules.filter(
        (s) => s.term?.id === this.selectedTermId
      );

      if (this.filteredSchedule.length > 0) {
        this.currentTerm = this.filteredSchedule[0].term;
      } else {
        this.currentTerm =
          this.availableTerms.find((t) => t.id === this.selectedTermId) || null;
      }

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
    const target = event.target as HTMLSelectElement;
    this.selectedKlassId = Number(target.value);

    const winterTerm = this.availableTerms.find(
      (t) => t.termType.toUpperCase() === 'WINTER'
    );
    this.selectedTermId = winterTerm
      ? winterTerm.id
      : this.availableTerms[0]?.id || null;

    if (this.selectedKlassId) {
      this.loadSchedule(this.selectedKlassId, this.selectedTermId!);
    }
  }

  onTermChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedTermId = Number(target.value);
    if (this.selectedKlassId && this.selectedTermId) {
      this.loadSchedule(this.selectedKlassId, this.selectedTermId);
    }
  }

  getTermName(termType: string): string {
    switch (termType.toUpperCase()) {
      case 'WINTER':
        return 'Зимен срок';
      case 'SPRING':
        return 'Пролетен срок';
      default:
        return termType;
    }
  }

  openCreateScheduleDialog(): void {
    if (!this.klasses.length || !this.availableTerms.length) {
      return;
    }

    const dialogRef = this.dialog.open(CreateScheduleDialogComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: {
        klasses: this.klasses,
        terms: this.availableTerms,
        selectedKlassId: this.selectedKlassId,
        selectedTermId: this.selectedTermId,
      } as CreateScheduleDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // result has klassId and termId
        this.selectedKlassId = result.klassId;
        this.selectedTermId = result.termId;
        this.loadSchedule(this.selectedKlassId!, this.selectedTermId!);
      }
    });
  }
}
