import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app.component';
import { LoginComponent } from './login-tab/login.component';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatPseudoCheckboxModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()), // Correctly providing HttpClient with fetch
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// import { NgModule } from '@angular/core';
// import {
//   BrowserModule,
//   provideClientHydration,
// } from '@angular/platform-browser';

// import { AppRoutingModule } from './app-routing.module';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { AppComponent } from './app.component';
// import { LoginComponent } from './login-tab/login.component';
// import { MatPseudoCheckboxModule } from '@angular/material/core';
// import { FormsModule } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatIconModule } from '@angular/material/icon';
// import {
//   HttpClientModule,
//   provideHttpClient,
//   withFetch,
// } from '@angular/common/http';

// @NgModule({
//   declarations: [AppComponent, LoginComponent],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     MatPseudoCheckboxModule,
//     MatCardModule,
//     FormsModule,
//     MatFormFieldModule,
//     MatIconModule,
//     ReactiveFormsModule,
//     MatInputModule,
//     MatButtonModule,
//     HttpClientModule,
//   ],
//   providers: [
//     provideClientHydration(),
//     provideAnimationsAsync(),
//     {
//       provide: HttpClientModule,
//       useFactory: () => provideHttpClient(withFetch()),
//     },
//   ],
//   bootstrap: [AppComponent],
//   // test1
// })
// export class AppModule {}
