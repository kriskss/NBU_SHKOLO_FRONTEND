import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Teacher } from '../../models/teacher.model';
import { TeacherService } from '../../services/teacher.service';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import { HeadmasterService } from '../../services/headmaster.service';

@Component({
  selector: 'app-headmaster-teachers-tab',
  templateUrl: './headmaster-teachers-tab.component.html',
  styleUrls: ['./headmaster-teachers-tab.component.scss'],
})
export class HeadmasterTeachersTabComponent implements OnInit {
  teachers: Teacher[] = [];
  schoolId: number = 5;

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
      if (!user) {
        // console.error('User not found in userService');
        return;
      }
      const headmasterId = await firstValueFrom(
        this.headmasterService.getSchoolByUserId(user.id)
      );

      const schoolData = await firstValueFrom(
        this.headmasterService.getSchoolByHeadmasterId(headmasterId)
      );
      this.teachers = await firstValueFrom(
        this.teacherService.getTeachersBySchoolId(schoolData.id)
      );
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  }
}
