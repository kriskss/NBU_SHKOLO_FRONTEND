import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  displayedColumns: string[] = [
    'id',
    'username',
    'email',
    'firstName',
    'lastName',
    'phoneNumber',
    'role',
  ];

  availableRoles: string[] = [
    'ROLE_STUDENT',
    'ROLE_TEACHER',
    'ROLE_PARENT',
    'ROLE_ADMIN',
    'NO_ROLE',
  ];
  selectedRole: string = '';

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.filteredUsers = data;
      },
      error: (err) => {
        // console.error('Failed to fetch users:', err);
      },
    });
  }

  getRoles(user: any): string {
    return (
      user.authorities?.map((auth: any) => auth.authority).join(', ') || ''
    );
  }

  applyRoleFilter(): void {
    if (!this.selectedRole) {
      this.filteredUsers = this.allUsers;
    } else if (this.selectedRole === 'NO_ROLE') {
      this.filteredUsers = this.allUsers.filter(
        (user) => !user.authorities || user.authorities.length === 0
      );
    } else {
      this.filteredUsers = this.allUsers.filter((user) =>
        user.authorities?.some(
          (auth: any) => auth.authority === this.selectedRole
        )
      );
    }
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '600px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.userService.getAllUsers().subscribe((users) => {
          this.allUsers = users;
          this.selectedRole = '';
          this.filteredUsers = users;
        });
      }
    });
  }
}
