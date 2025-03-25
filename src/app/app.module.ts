import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LoginComponent } from './login-tab/login.component';
import { MatPseudoCheckboxModule } from '@angular/material/core';
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
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withFetch()),
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AppModule {}
