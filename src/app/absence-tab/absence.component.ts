import { Component, OnInit } from '@angular/core';
import { AbsenceService, AbsenceDTO } from '../services/absence.service';
import { StudentService } from '../services/student.service';
import { firstValueFrom } from 'rxjs';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-absence',
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.scss'],
})
export class AbsenceComponent implements OnInit {
  displayedColumns: string[] = [
    'dateOfAbsence',
    'numberOfPeriod',
    'subject',
    'absenceState',
    'absenceType',
    'dateAdded',
  ];

  absences: AbsenceDTO[] = [];
  klassSchedule: any[] = [];
  studentId: number = 0;

  constructor(
    private absenceService: AbsenceService,
    private studentService: StudentService,
    private scheduleService: ScheduleService
  ) {}

  async ngOnInit(): Promise<void> {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      console.error('No user info found in localStorage');
      return;
    }

    const userId = JSON.parse(userInfo).id;

    try {
      this.studentId = await firstValueFrom(
        this.studentService.getStudentIdByUserId(userId)
      );

      if (!this.studentId) {
        console.error('Student ID not found');
        return;
      }

      // First, load schedule based on klass
      await this.loadKlassSchedule();

      // Then fetch absences and resolve subjects
      const absences = await firstValueFrom(
        this.absenceService.getAbsencesByStudentId(this.studentId)
      );
      this.absences = absences.map((absence) => ({
        ...absence,
        subject:
          this.findSubjectForSchedule(absence.scheduleSummaryDTO) ?? 'N/A',
        numberOfPeriod: absence.scheduleSummaryDTO?.numberOfPeriod ?? 'N/A',
      }));
    } catch (error) {
      console.error('Error loading student absences or schedule:', error);
    }
  }

  async loadKlassSchedule() {
    try {
      const klass = await firstValueFrom(
        this.studentService.getKlassByStudentId(this.studentId)
      );

      console.log('Klass info:', klass);

      this.klassSchedule = await this.scheduleService.getScheduleByKlassId(
        klass.id
      );
      // console.log('Loaded klassSchedule:', this.klassSchedule);
    } catch (err) {
      console.error('Failed to load klass or schedule', err);
      this.klassSchedule = [];
    }
  }

  findSubjectForSchedule(summary: any): string {
    if (!summary || !this.klassSchedule.length) return '';

    const match = this.klassSchedule.find(
      (s) =>
        s.dayOfTheWeek === summary.dayOfTheWeek &&
        s.numberOfPeriod === summary.numberOfPeriod
    );

    return (
      match?.subject?.title ||
      `${summary.dayOfTheWeek} - Period ${summary.numberOfPeriod}`
    );
  }
}
