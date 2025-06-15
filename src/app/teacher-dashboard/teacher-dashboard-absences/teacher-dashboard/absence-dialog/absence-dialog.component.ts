import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentService } from '../../../../services/student.service';
import { switchMap, of, catchError, forkJoin } from 'rxjs';
import { ScheduleService } from '../../../../services/schedule.service';
import { AbsenceService } from '../../../../services/absence.service';

@Component({
  selector: 'app-absence-dialog',
  templateUrl: './absence-dialog.component.html',
  styleUrls: ['./absence-dialog.component.scss'],
})
export class AbsenceDialogComponent implements OnInit {
  absenceForm!: FormGroup;
  scheduleData: any[] = [];
  filteredSubjects: any[] = [];
  students: { id: number; firstName: string; lastName: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private dialogRef: MatDialogRef<AbsenceDialogComponent>,
    private scheduleService: ScheduleService,
    private absenceService: AbsenceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit(): Promise<void> {
    this.absenceForm = this.fb.group({
      studentId: [null, Validators.required],
      dateOfAbsence: [null, Validators.required],
      absenceType: ['UNEXCUSED', Validators.required],
      absenceState: ['PENDING', Validators.required],
      subjectId: [null, Validators.required],
      scheduleInfo: [''],
    });

    this.loadStudents();

    const userInfo = localStorage.getItem('userInfo');
    const userId = userInfo ? JSON.parse(userInfo).id : null;

    const klassId = this.data?.klassId;
    if (klassId) {
      this.scheduleData = await this.scheduleService.getScheduleByKlassId(
        klassId
      );
    }

    this.absenceForm.get('dateOfAbsence')?.valueChanges.subscribe((date) => {
      if (date && this.scheduleData.length) {
        this.updateSubjectsForDate(date);
      } else {
        this.filteredSubjects = [];
        this.absenceForm.get('subjectId')?.setValue(null);
      }
    });
  }

  updateSubjectsForDate(date: Date) {
    const klassId = this.data.klassId;
    if (!klassId) return;

    const scheduleForDay = this.getSubjectsForDateAndKlass(
      this.scheduleData,
      date,
      klassId
    );
    this.filteredSubjects = scheduleForDay.map((entry) => entry.subject);

    // reset subject selection when date changes
    this.absenceForm.get('subjectId')?.setValue(null);
  }

  loadStudents(): void {
    const klassId = this.data?.klassId;
    if (!klassId) return;

    let studentIds: number[] = []; // 🔹 declare outside

    this.studentService
      .getStudentIdsByKlassId(klassId)
      .pipe(
        switchMap((ids: number[]) => {
          studentIds = ids; // 🔹 store here for use later
          if (!ids.length) return of([]);
          const userCalls = ids.map((id) =>
            this.studentService.getStudentUserById(id).pipe(
              catchError((err) => {
                console.error(`Failed to load user for student ID ${id}`, err);
                return of(null);
              })
            )
          );
          return forkJoin(userCalls);
        })
      )
      .subscribe({
        next: (users) => {
          this.students = users
            .map((user, index) => {
              const studentId = studentIds[index]; // 🔹 use stored array
              if (!user) return null;
              return {
                id: studentId,
                firstName: user.firstName,
                lastName: user.lastName,
              };
            })
            .filter(
              (s): s is { id: number; firstName: string; lastName: string } =>
                !!s
            );
        },
        error: (err) => {
          console.error('Failed to load student users', err);
        },
      });
  }

  getSubjectsForDateAndKlass(
    scheduleData: any[],
    selectedDate: Date,
    selectedKlassId: number
  ): any[] {
    const dayOfWeekBg = this.dayOfWeekToBulgarian(selectedDate);

    const scheduleForKlass = scheduleData.filter(
      (entry) => entry.klass.id === selectedKlassId
    );

    const scheduleForDay = scheduleForKlass.filter(
      (entry) => entry.dayOfTheWeek === dayOfWeekBg
    );

    return scheduleForDay;
  }

  dayOfWeekToBulgarian(date: Date): string {
    const daysBg = [
      'Неделя', // Sunday
      'Понеделник', // Monday
      'Вторник', // Tuesday
      'Сряда', // Wednesday
      'Четвъртък', // Thursday
      'Петък', // Friday
      'Събота', // Saturday
    ];
    return daysBg[date.getDay()];
  }

  disableWeekends = (d: Date | null): boolean => {
    if (!d) return false;
    const day = d.getDay();
    // Sunday = 0, Saturday = 6
    return day !== 0 && day !== 6;
  };

  onSubmit(): void {
    if (this.absenceForm.valid) {
      const formData = this.absenceForm.value;

      const selectedSubjectId = formData.subjectId;
      const scheduleMatch = this.scheduleData.find(
        (entry) =>
          entry.subject.id === selectedSubjectId &&
          entry.dayOfTheWeek ===
            this.dayOfWeekToBulgarian(new Date(formData.dateOfAbsence))
      );

      if (!scheduleMatch) {
        alert('No matching schedule found for this subject and date.');
        return;
      }

      const payload = {
        studentId: formData.studentId,
        dateOfAbsence: formData.dateOfAbsence,
        absenceType: formData.absenceType,
        absenceState: formData.absenceState,
        scheduleSummaryDTO: {
          id: scheduleMatch.id,
        },
      };

      this.absenceService.addAbsence(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error('Failed to add absence', err);
          alert('Failed to add absence');
        },
      });
    }
  }
}
