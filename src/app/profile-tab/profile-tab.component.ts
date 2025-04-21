import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile-tab',
  templateUrl: './profile-tab.component.html',
  styleUrls: ['./profile-tab.component.scss'],
})
export class ProfileTabComponent implements OnInit {
  userProfile: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const storedUser = this.userService.getUser();

    if (storedUser) {
      this.userProfile = storedUser;
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
