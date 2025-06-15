import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login-tab/login.component';
import { GradesComponent } from './grades-tab/grades.component';
import { AbsenceComponent } from './absence-tab/absence.component';
import { AuthGuard } from './login-tab/auth.guard';
import { ProfileTabComponent } from './profile-tab/profile-tab.component';
import { StudentScheduleTabComponent } from './student-schedule-tab/student-schedule-tab.component';
import { GradesTeacherDashboardComponent } from './teacher-dashboard/grades-teacher-dashboard.component';
import { TeacherDashboardAbsencesComponent } from './teacher-dashboard/teacher-dashboard-absences/teacher-dashboard-absences.component';
import { ScheduleTeacherDashboardComponent } from './teacher-dashboard/schedule-teacher-dashboard/schedule-teacher-dashboard.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'grades', component: GradesComponent, canActivate: [AuthGuard] },
  { path: 'absence', component: AbsenceComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'profile', component: ProfileTabComponent, canActivate: [AuthGuard] },
  { path: 'student-schedule', component: StudentScheduleTabComponent },
  {
    path: 'teacher-dashboard',
    component: GradesTeacherDashboardComponent,
    children: [
      { path: '', redirectTo: 'grades', pathMatch: 'full' },
      { path: 'grades', component: GradesComponent },
      // { path: 'absence', component: TeacherDashboardAbsencesComponent },
    ],
  },
  {
    path: 'teacher-dashboard/absence',
    component: TeacherDashboardAbsencesComponent,
  },
  {
    path: 'teacher-dashboard/student-schedule',
    component: ScheduleTeacherDashboardComponent,
  },
  {
    path: 'user-dashboard',
    component: ProfileTabComponent,
    canActivate: [AuthGuard],
  },
  // { path: '', redirectTo: '/grades', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
