import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  StudentExtended,
  StudentService,
} from '../../services/student.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../models/user.model';
import { HeadmasterService } from '../../services/headmaster.service';
import { UserService } from '../../services/user.service';

interface StudentWithKlass {
  user: User;
  klass: { id: number; name: string } | null;
}

@Component({
  selector: 'app-headmaster-students-tab',
  templateUrl: './headmaster-students-tab.component.html',
  styleUrls: ['./headmaster-students-tab.component.scss'],
})
export class HeadmasterStudentsTabComponent implements OnInit {
  studentsWithKlass: StudentWithKlass[] = [];
  klasses: { id: number; name: string }[] = [];
  searchName: string = '';
  selectedKlass: string = 'all';
  filteredStudentsWithKlass: StudentWithKlass[] = [];

  constructor(
    private headmasterService: HeadmasterService,
    private studentService: StudentService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  async loadStudents(): Promise<void> {
    try {
      const user = this.userService.getUser();
      if (!user) return;

      const headmasterId = await firstValueFrom(
        this.headmasterService.getSchoolByUserId(user.id)
      );
      const schoolData = await firstValueFrom(
        this.headmasterService.getSchoolByHeadmasterId(headmasterId)
      );
      const klassStudents = await firstValueFrom(
        this.studentService.getStudentsBySchoolId(schoolData.id)
      );

      if (!klassStudents || klassStudents.length === 0) {
        this.studentsWithKlass = [];
        this.filteredStudentsWithKlass = [];
        return;
      }

      this.klasses = this.getUniqueKlasses(klassStudents);

      this.studentsWithKlass = [];

      for (const ks of klassStudents) {
        const studentUser = await firstValueFrom(
          this.studentService.getStudentUserById(ks.id)
        );
        this.studentsWithKlass.push({
          user: studentUser,
          klass: ks.klass || null,
        });
      }

      this.filteredStudentsWithKlass = [...this.studentsWithKlass];
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  getUniqueKlasses(
    klassStudents: StudentExtended[]
  ): { id: number; name: string }[] {
    const klassMap = new Map<number, string>();
    klassStudents.forEach((ks) => {
      if (ks.klass && !klassMap.has(ks.klass.id)) {
        klassMap.set(ks.klass.id, ks.klass.name);
      }
    });
    return Array.from(klassMap, ([id, name]) => ({ id, name }));
  }

  applyFilter(): void {
    const searchLower = this.searchName.toLowerCase().trim();

    this.filteredStudentsWithKlass = this.studentsWithKlass.filter(
      ({ user, klass }) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const matchesName = fullName.includes(searchLower);
        const matchesKlass =
          this.selectedKlass === 'all' ||
          (klass && klass.id.toString() === this.selectedKlass);

        return matchesName && matchesKlass;
      }
    );
  }
}
