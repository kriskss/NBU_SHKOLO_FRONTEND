import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-tab',
  templateUrl: './profile-tab.component.html',
  styleUrls: ['./profile-tab.component.scss'],
})
export class ProfileTabComponent {
  userProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    phoneNumber: '123-456-7890',
    birthDate: '15/08/1995',
    address: '123 Main St, City',
    role: 'ROLE_STUDENT',
  };
}
