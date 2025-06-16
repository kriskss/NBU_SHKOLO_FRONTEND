import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Term } from '../../../models/term.model';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Klass } from '../../../models/klass.model';
import { HeadmasterService } from '../../../services/headmaster.service';
import { TeacherService } from '../../../services/teacher.service';
import { UserService } from '../../../services/user.service';
import { Subject } from '../../../models/subject.model';
import { ScheduleService } from '../../../services/schedule.service';

export interface CreateScheduleDialogData {
  klasses: any[];
  terms: Term[];
  selectedKlassId: number | null;
  selectedTermId: number | null;
}

@Component({
  selector: 'app-create-schedule-dialog',
  templateUrl: './create-schedule-dialog.component.html',
  styleUrls: ['./create-schedule-dialog.component.scss'],
})
export class CreateScheduleDialogComponent implements OnInit {
  klasses: any[] = [];
  terms: Term[] = [];

  selectedKlassId: number | null = null;
  selectedTermId: number | null = null;

  daysOfWeek = ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък'];
  periods = [1, 2, 3, 4, 5, 6, 7];

  scheduleForm!: FormGroup;

  subjects: { id: number; title: string }[] = [];
  teachers: any[] = [];
  klassesMap: Map<number, Klass[]> = new Map();

  filteredTeachersMap = new Map<number, any[]>();

  constructor(
    public dialogRef: MatDialogRef<CreateScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateScheduleDialogData,
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private userService: UserService,
    private headmasterService: HeadmasterService,
    private scheduleService: ScheduleService
  ) {}

  async ngOnInit(): Promise<void> {
    this.klasses = this.data.klasses;
    this.terms = this.data.terms;
    this.selectedKlassId = this.data.selectedKlassId;
    this.selectedTermId = this.data.selectedTermId;
    this.buildForm();

    await this.loadTeachers();

    this.initSubjectTeacherListeners();
  }

  async loadTeachers() {
    try {
      const user = this.userService.getUser();
      if (!user) return;

      const headmasterId = await firstValueFrom(
        this.headmasterService.getSchoolByUserId(user.id)
      );

      const schoolData = await firstValueFrom(
        this.headmasterService.getSchoolByHeadmasterId(headmasterId)
      );

      this.teachers = await firstValueFrom(
        this.teacherService.getTeachersBySchoolId(schoolData.id)
      );

      await this.loadTeacherKlasses(schoolData.id);

      this.extractSubjects();
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  }

  async loadTeacherKlasses(currentSchoolId: number) {
    for (const teacher of this.teachers) {
      try {
        const rawKlasses = await firstValueFrom(
          this.teacherService.getKlassesByTeacherId(teacher.id)
        );

        const klassesInThisSchool: Klass[] = rawKlasses
          .filter((klass: any) => klass.schoolId === currentSchoolId)
          .map(
            (klass: any) =>
              new Klass(klass.id, klass.name, {
                id: klass.schoolId,
                name: '',
                address: '',
              })
          );

        this.klassesMap.set(teacher.id, klassesInThisSchool);
      } catch (e) {
        console.error(`Error fetching klasses for teacher ${teacher.id}`, e);
      }
    }
  }

  extractSubjects() {
    const subjectMap = new Map<number, string>();
    this.teachers.forEach((teacher) => {
      teacher.subjects.forEach((subject: Subject) => {
        if (!subjectMap.has(subject.id)) {
          subjectMap.set(subject.id, subject.title);
        }
      });
    });
    this.subjects = Array.from(subjectMap, ([id, title]) => ({
      id,
      title,
    })).sort((a, b) => a.title.localeCompare(b.title));
  }

  buildForm() {
    const scheduleArray = this.fb.array<FormGroup>([]);

    for (let period of this.periods) {
      for (let day of this.daysOfWeek) {
        scheduleArray.push(
          this.fb.group({
            dayOfTheWeek: [day],
            numberOfPeriod: [period],
            subjectId: [null, Validators.required],
            teacherId: [null, Validators.required],
          })
        );
      }
    }

    this.scheduleForm = this.fb.group({
      scheduleEntries: scheduleArray,
    });
  }

  get scheduleEntries(): FormArray {
    return this.scheduleForm.get('scheduleEntries') as FormArray<FormGroup>;
  }

  initSubjectTeacherListeners() {
    this.scheduleEntries.controls.forEach(
      (control: AbstractControl, index: number) => {
        const group = control as FormGroup;

        group
          .get('subjectId')
          ?.valueChanges.subscribe((subjectId: number | null) => {
            const filtered = this.filterTeachersBySubject(subjectId);
            this.filteredTeachersMap.set(index, filtered);
            console.log(this.filteredTeachersMap);

            group.get('teacherId')?.setValue(null);
          });

        this.filteredTeachersMap.set(index, this.teachers);
      }
    );
  }

  filterTeachersBySubject(subjectId: number | null) {
    if (!subjectId) {
      return this.teachers;
    }
    return this.teachers.filter((teacher) =>
      teacher.subjects.some((subject: any) => subject.id === subjectId)
    );
  }

  getFilteredTeachersForIndex(index: number) {
    return this.filteredTeachersMap.get(index) || [];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onCreate(): Promise<void> {
    if (
      this.scheduleForm.invalid ||
      !this.selectedKlassId ||
      !this.selectedTermId
    ) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    const entries = this.scheduleEntries.controls.map((group) => {
      const val = group.value;
      return {
        dayOfTheWeek: val.dayOfTheWeek,
        numberOfPeriod: val.numberOfPeriod,
        klassId: this.selectedKlassId!,
        termId: this.selectedTermId!,
        subjectId: val.subjectId,
        teacherId: val.teacherId,
      };
    });

    const validEntries = entries.filter(
      (e) => e.subjectId !== null && e.teacherId !== null
    );

    try {
      for (const entry of validEntries) {
        await this.scheduleService.addScheduleEntry(entry);
      }

      this.dialogRef.close(true);
    } catch (error) {
      console.error('Failed to save schedule entries:', error);
    }
  }

  getScheduleEntry(i: number): FormGroup {
    return this.scheduleEntries.at(i) as FormGroup;
  }
}
