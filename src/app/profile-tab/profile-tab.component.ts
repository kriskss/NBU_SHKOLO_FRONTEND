import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { StudentService } from '../services/student.service';
import { ParentService } from '../services/parent.service';
import { User } from '../models/user.model';
import { Klass } from '../models/klass.model'; // Make sure this model exists
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-profile-tab',
  templateUrl: './profile-tab.component.html',
  styleUrls: ['./profile-tab.component.scss'],
})
export class ProfileTabComponent implements OnInit {
  userProfile: User | null = null;
  children: User[] = [];
  klassMap: { [childId: number]: Klass } = {};
  isParent: boolean = false;

  constructor(
    private userService: UserService,
    private parentService: ParentService,
    private studentService: StudentService
  ) {}

  async ngOnInit(): Promise<void> {
    const storedUser = this.userService.getUser();
    const role = this.userService.getActiveRole();

    if (storedUser) {
      this.userProfile = storedUser;

      if (role === 'ROLE_PARENT') {
        this.isParent = true;

        try {
          const parentId = await this.parentService.getParentIdByUserIdAsync(
            storedUser.id
          );

          const childIds = await firstValueFrom(
            this.parentService.getChildrenIds(parentId)
          );

          const childDetails = await firstValueFrom(
            forkJoin(
              childIds.map((id: number) =>
                this.studentService.getStudentUserById(id)
              )
            )
          );

          this.children = childDetails;

          // Fetch class info for each child
          const klasses = await firstValueFrom(
            forkJoin(
              childIds.map((id: number) =>
                this.studentService.getKlassByStudentId(id)
              )
            )
          );

          childIds.forEach((id, index) => {
            this.klassMap[id] = klasses[index];
          });
        } catch (err) {
          console.error('Error loading children or class info:', err);
        }
      }
    } else {
      this.userService.fetchUserByUsername('johndoe').subscribe(
        (user) => {
          this.userProfile = user;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }
}
