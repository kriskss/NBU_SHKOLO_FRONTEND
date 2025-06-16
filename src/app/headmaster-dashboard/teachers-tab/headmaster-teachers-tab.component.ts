import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Teacher } from '../../models/teacher.model';
import { TeacherService } from '../../services/teacher.service';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import { HeadmasterService } from '../../services/headmaster.service';
import { Klass } from '../../models/klass.model';

@Component({
  selector: 'app-headmaster-teachers-tab',
  templateUrl: './headmaster-teachers-tab.component.html',
  styleUrls: ['./headmaster-teachers-tab.component.scss'],
})
export class HeadmasterTeachersTabComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  subjects: { id: number; title: string }[] = [];
  klasses: { id: number; name: string }[] = [];

  selectedSubjectId: number | 'all' = 'all';
  selectedKlassId: number | 'all' = 'all';
  searchText: string = '';

  klassesMap: Map<number, Klass[]> = new Map();

  constructor(
    private teacherService: TeacherService,
    private userService: UserService,
    private headmasterService: HeadmasterService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    await this.loadTeachers();
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

      await this.loadTeacherKlasses();

      this.extractSubjects();
      this.extractKlasses();
      this.applyFilter();
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  }

  async loadTeacherKlasses() {
    for (const teacher of this.teachers) {
      try {
        const klasses = await firstValueFrom(
          this.teacherService.getKlassesByTeacherId(teacher.id)
        );
        this.klassesMap.set(teacher.id, klasses);
      } catch (e) {
        console.error(`Error fetching klasses for teacher ${teacher.id}`, e);
      }
    }
  }

  extractSubjects() {
    const subjectMap = new Map<number, string>();
    this.teachers.forEach((teacher) => {
      teacher.subjects.forEach((subject) => {
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

  extractKlasses() {
    const klassMap = new Map<number, string>();
    for (const klassList of this.klassesMap.values()) {
      for (const klass of klassList) {
        if (!klassMap.has(klass.id)) {
          klassMap.set(klass.id, klass.name);
        }
      }
    }
    this.klasses = Array.from(klassMap, ([id, name]) => ({ id, name })).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }

  applyFilter() {
    let filtered = this.teachers;

    // Filter by subject
    if (this.selectedSubjectId !== 'all') {
      filtered = filtered.filter((teacher) =>
        teacher.subjects.some((s) => s.id === this.selectedSubjectId)
      );
    }

    // Filter by klass
    if (this.selectedKlassId !== 'all') {
      filtered = filtered.filter((teacher) =>
        teacher.klasses.some((k) => k.id === this.selectedKlassId)
      );
    }

    // Filter by name search (case-insensitive)
    if (this.searchText.trim().length > 0) {
      const lowerSearch = this.searchText.toLowerCase();
      filtered = filtered.filter((teacher) => {
        const fullName = (
          teacher.user.firstName +
          ' ' +
          teacher.user.lastName
        ).toLowerCase();
        return fullName.includes(lowerSearch);
      });
    }

    this.filteredTeachers = filtered;
  }

  getKlassesForTeacher(teacherId: number) {
    return this.klassesMap.get(teacherId) || [];
  }
}
