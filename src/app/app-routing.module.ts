import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login-tab/login.component';
import { GradesComponent } from './grades-tab/grades.component';
import { AbsenceComponent } from './absence-tab/absence.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'grades', component: GradesComponent },
  { path: 'absence', component: AbsenceComponent },
  { path: '', component: GradesComponent },
  // { path: '', redirectTo: '/grades', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
