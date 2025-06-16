import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ParentService } from '../../services/parent.service';
import { UserService } from '../../services/user.service';
import { HeadmasterService } from '../../services/headmaster.service';
import { StudentService } from '../../services/student.service';
import { Parent } from '../../models/parent.model';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-headmaster-parents-tab',
  templateUrl: './parent-dashboard.component.html',
  styleUrls: ['./parent-dashboard.component.scss'],
})
export class HeadmasterParentTabComponent implements OnInit {
  parents: Parent[] = [];
  studentNames: Map<number, string> = new Map();
  selectedKlass: string = 'all';
  klasses: string[] = [];
  filteredParents: Parent[] = [];
  searchText: string = ''; // <-- added for name filter

  constructor(
    private parentService: ParentService,
    private userService: UserService,
    private headmasterService: HeadmasterService,
    private studentService: StudentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadParentsAndStudents();
  }

  async loadParentsAndStudents() {
    try {
      const user = this.userService.getUser();
      if (!user) {
        return;
      }

      const headmasterId = await firstValueFrom(
        this.headmasterService.getSchoolByUserId(user.id)
      );
      const school = await firstValueFrom(
        this.headmasterService.getSchoolByHeadmasterId(headmasterId)
      );

      this.parents = await firstValueFrom(
        this.parentService.getParentsBySchoolId(school.id)
      );

      this.extractKlasses();
      this.applyFilter();

      const fetchedStudentIds = new Set<number>();

      for (const parent of this.parents) {
        for (const student of parent.students) {
          if (!fetchedStudentIds.has(student.id)) {
            fetchedStudentIds.add(student.id);
            this.fetchStudentName(student.id);
          }
        }
      }
    } catch (error) {
      console.error('Error loading parents or student names:', error);
    }
  }

  async fetchStudentName(studentId: number) {
    try {
      if (!isPlatformBrowser(this.platformId)) return;

      const studentUser = await firstValueFrom(
        this.studentService.getStudentUserById(studentId)
      );
      const fullName = `${studentUser.firstName} ${studentUser.lastName}`;
      this.studentNames.set(studentId, fullName);
    } catch (error) {
      console.error(`Error fetching student name for ID ${studentId}:`, error);
    }
  }

  getStudentName(studentId: number): string {
    return this.studentNames.get(studentId) || 'Зареждане...';
  }

  extractKlasses(): void {
    const klassSet = new Set<string>();
    this.parents.forEach((parent) =>
      parent.students.forEach((student) => {
        if (student.klass?.name) {
          klassSet.add(student.klass.name);
        }
      })
    );
    this.klasses = Array.from(klassSet).sort();
  }

  applyFilter(): void {
    const searchLower = this.searchText.trim().toLowerCase();

    this.filteredParents = this.parents.filter((parent) => {
      const klassMatch =
        this.selectedKlass === 'all' ||
        parent.students.some(
          (student) => student.klass?.name === this.selectedKlass
        );

      const fullName =
        `${parent.user.firstName} ${parent.user.lastName}`.toLowerCase();
      const email = parent.user.email.toLowerCase();

      const nameOrEmailMatch =
        !searchLower ||
        fullName.includes(searchLower) ||
        email.includes(searchLower);

      return klassMatch && nameOrEmailMatch;
    });
  }
}
