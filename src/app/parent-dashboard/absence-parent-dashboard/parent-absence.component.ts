import { Component, OnInit } from '@angular/core';
import { firstValueFrom, forkJoin } from 'rxjs';
import { AbsenceDTO, AbsenceService } from '../../services/absence.service';
import { StudentService } from '../../services/student.service';
import { ParentService } from '../../services/parent.service';
import { ScheduleService } from '../../services/schedule.service';

interface Child {
  id: number;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-parent-absence',
  templateUrl: './parent-absence.component.html',
  styleUrls: ['./parent-absence.component.scss'],
})
export class ParentAbsenceComponent implements OnInit {
  displayedColumns: string[] = [
    'dateOfAbsence',
    'numberOfPeriod',
    'subject',
    'absenceState',
    'absenceType',
    'dateAdded',
  ];

  absences: AbsenceDTO[] = [];
  children: Child[] = [];
  selectedChildId!: number;
  isLoading = true;
  klassSchedule: any[] = [];

  constructor(
    private absenceService: AbsenceService,
    private studentService: StudentService,
    private parentService: ParentService,
    private scheduleService: ScheduleService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      console.error('No user info found in localStorage');
      this.isLoading = false;
      return;
    }

    const userId = JSON.parse(userInfo).id;

    try {
      const parentId = await this.parentService.getParentIdByUserIdAsync(
        userId
      );
      const childIds = await firstValueFrom(
        this.parentService.getChildrenIds(parentId)
      );

      const childDetailsObservables = childIds.map((id: number) =>
        this.studentService.getStudentUserById(id)
      );

      this.children = await firstValueFrom(forkJoin(childDetailsObservables));
      console.log(this.children);

      if (this.children.length > 0) {
        this.selectedChildId = this.children[0].id;
        await this.loadKlassSchedule();
        await this.loadAbsencesForChild(this.selectedChildId);
      } else {
        console.warn('No children found for parent');
      }
    } catch (error) {
      console.error('Error loading children or absences:', error);
    } finally {
      this.isLoading = false;
      this.loadKlassSchedule();
    }
  }

  async onChildSelected(): Promise<void> {
    this.isLoading = true;
    await this.loadAbsencesForChild(this.selectedChildId);
    this.isLoading = false;
  }

  private async loadAbsencesForChild(childId: number): Promise<void> {
    try {
      const absences = await firstValueFrom(
        this.absenceService.getAbsencesByStudentId(childId)
      );

      this.absences = absences.map((absence) => {
        const subject = this.findSubjectForSchedule(absence.scheduleSummaryDTO);
        return {
          ...absence,
          subject,
          numberOfPeriod: absence.scheduleSummaryDTO?.numberOfPeriod ?? 'N/A',
        };
      });
    } catch (error) {
      console.error('Error fetching absences:', error);
      this.absences = [];
    }
  }

  async loadKlassSchedule() {
    try {
      const klass = await firstValueFrom(
        this.studentService.getKlassByStudentId(this.selectedChildId)
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
