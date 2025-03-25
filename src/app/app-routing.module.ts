import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login-tab/login.component';
import { GradesComponent } from './grades-tab/grades.component';
import { AbsenceComponent } from './absence-tab/absence.component';
import { AuthGuard } from './login-tab/auth.guard';
import { ProfileTabComponent } from './profile-tab/profile-tab.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'grades', component: GradesComponent, canActivate: [AuthGuard] },
  { path: 'absence', component: AbsenceComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'profile', component: ProfileTabComponent, canActivate: [AuthGuard] },
  // { path: '', redirectTo: '/grades', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
