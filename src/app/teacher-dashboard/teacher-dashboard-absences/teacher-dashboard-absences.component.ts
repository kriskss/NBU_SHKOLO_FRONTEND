import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Subscription, forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { StudentService } from '../../services/student.service';
import { AbsenceService } from '../../services/absence.service';
import { TeacherService } from '../../services/teacher.service';

interface AbsenceWithStudent {
  id: number;
  studentId: number;
  studentName: string;
  dateOfAbsence: Date;
  absenceType: string;
  absenceState: string;
  scheduleInfo: string;
}

@Component({
  selector: 'app-teacher-dashboard-absences',
  templateUrl: './teacher-dashboard-absences.component.html',
  styleUrls: ['./teacher-dashboard-absences.component.scss'],
})
export class TeacherDashboardAbsencesComponent implements OnInit, OnDestroy {
  selectedKlassId: number | null = null;

  private klassSubscription?: Subscription;

  absencesList: AbsenceWithStudent[] = [];
  loading = false;
  error = '';

  constructor(
    private teacherService: TeacherService,
    private studentService: StudentService,
    private absenceService: AbsenceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.klassSubscription = this.teacherService.selectedKlass$.subscribe(
      (klass) => {
        this.selectedKlassId = klass?.id ?? null;
        if (this.selectedKlassId) {
          this.loadAbsencesForKlass(this.selectedKlassId);
        }
      }
    );
  }

  loadAbsencesForKlass(klassId: number): void {
    this.loading = true;
    this.error = '';
    this.absencesList = [];

    this.studentService
      .getStudentIdsByKlassId(klassId)
      .pipe(
        switchMap((studentIds: number[]) => {
          if (!studentIds.length) {
            this.loading = false;
            return of([]);
          }

          const studentDataCalls = studentIds.map((studentId) =>
            forkJoin({
              absences: this.absenceService
                .getAbsencesByStudentId(studentId)
                .pipe(
                  catchError((err) => {
                    console.error(
                      `Error loading absences for student ${studentId}`,
                      err
                    );
                    return of([]);
                  })
                ),
              user: this.studentService.getStudentUserById(studentId).pipe(
                catchError((err) => {
                  console.error(
                    `Error loading user for student ${studentId}`,
                    err
                  );
                  return of({
                    firstName: 'Unknown',
                    lastName: `#${studentId}`,
                  });
                })
              ),
            })
          );

          return forkJoin(studentDataCalls);
        })
      )
      .subscribe({
        next: (results) => {
          this.absencesList = [];

          results.forEach(({ absences, user }) => {
            const studentName = `${user.firstName} ${user.lastName}`;

            absences.forEach((abs: any) => {
              this.absencesList.push({
                id: abs.id,
                studentId: abs.studentId,
                studentName,
                dateOfAbsence: abs.dateOfAbsence,
                absenceType: abs.absenceType,
                absenceState: abs.absenceState,
                scheduleInfo: abs.scheduleSummaryDTO
                  ? `${abs.scheduleSummaryDTO.dayOfTheWeek} - Period ${abs.scheduleSummaryDTO.numberOfPeriod}`
                  : '',
              });
            });
          });

          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load absences';
          this.loading = false;
          console.error(err);
        },
      });
  }

  openAddAbsenceDialog() {
    console.log('Open Add Absence Dialog');
  }

  openEditAbsenceDialog(absence: AbsenceWithStudent) {
    console.log('Open Edit Absence Dialog for', absence);
  }

  deleteAbsence(absenceId: number) {
    if (!confirm('Are you sure you want to delete this absence?')) return;

    this.absenceService.deleteAbsence(absenceId).subscribe({
      next: () => {
        if (this.selectedKlassId !== null) {
          this.loadAbsencesForKlass(this.selectedKlassId);
        }
      },
      error: (err) => {
        console.error('Failed to delete absence:', err);
        this.error = 'Failed to delete absence.';
      },
    });
  }

  ngOnDestroy(): void {
    this.klassSubscription?.unsubscribe();
  }
}
