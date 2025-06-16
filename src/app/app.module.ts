import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LoginComponent } from './login-tab/login.component';
import {
  MatNativeDateModule,
  MatPseudoCheckboxModule,
} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HeaderComponent } from './headers/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TabsHeaderComponent } from './headers/tabsHeader/tabsHeader.component';
import { MatTabsModule } from '@angular/material/tabs';
import { GradesComponent } from './grades-tab/grades.component';
import { MatTableModule } from '@angular/material/table';
import { AbsenceComponent } from './absence-tab/absence.component';
import { YesNoPipe } from './pipes/yesNo.pipe';
import { MatGridListModule } from '@angular/material/grid-list';
import { withFetch } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ProfileTabComponent } from './profile-tab/profile-tab.component';
import { StudentScheduleTabComponent } from './student-schedule-tab/student-schedule-tab.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { GradesTeacherDashboardComponent } from './teacher-dashboard/grades-teacher-dashboard.component';
import { GradeEditDialogComponent } from './teacher-dashboard/grade-edit-dialog/grade-edit-dialog.component';
import { TeacherDashboardAbsencesComponent } from './teacher-dashboard/teacher-dashboard-absences/teacher-dashboard-absences.component';
import { AbsenceDialogComponent } from './teacher-dashboard/teacher-dashboard-absences/teacher-dashboard/absence-dialog/absence-dialog.component';
import { ScheduleTeacherDashboardComponent } from './teacher-dashboard/schedule-teacher-dashboard/schedule-teacher-dashboard.component';
import { GradesParentDashboardComponent } from './parent-dashboard/grades-parent-dashboard/grades-parent-dashboard.component';
import { ParentAbsenceComponent } from './parent-dashboard/absence-parent-dashboard/parent-absence.component';
import { ScheduleParentDashboardComponent } from './parent-dashboard/schedule-parent-dashboard/schedule-parent-dashboard.component';
import { HeadmasterDashboardComponent } from './headmaster-dashboard/headmaster-dashboard.component';
import { HeadmasterStudentsTabComponent } from './headmaster-dashboard/students-tab/headmaster-students-tab.component';
import { HeadmasterTeachersTabComponent } from './headmaster-dashboard/teachers-tab/headmaster-teachers-tab.component';
import { HeadmasterParentTabComponent } from './headmaster-dashboard/parent-tab/parent-dashboard.component';
import { HeadmasterKlassTabComponent } from './headmaster-dashboard/klass-tab/headmaster-klass-tab.component';
import { HeadmasterScheduleTabComponent } from './headmaster-dashboard/schedule-tab/headmaster-schedule-tab.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    TabsHeaderComponent,
    GradesComponent,
    AbsenceComponent,
    YesNoPipe,
    ProfileTabComponent,
    StudentScheduleTabComponent,
    GradesTeacherDashboardComponent,
    GradeEditDialogComponent,
    TeacherDashboardAbsencesComponent,
    AbsenceDialogComponent,
    ScheduleTeacherDashboardComponent,
    GradesParentDashboardComponent,
    ParentAbsenceComponent,
    ScheduleParentDashboardComponent,
    HeadmasterDashboardComponent,
    HeadmasterStudentsTabComponent,
    HeadmasterTeachersTabComponent,
    HeadmasterParentTabComponent,
    HeadmasterKlassTabComponent,
    HeadmasterScheduleTabComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule, // Add HttpClientModule here
    MatPseudoCheckboxModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatTooltipModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withFetch()),
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AppModule {}
