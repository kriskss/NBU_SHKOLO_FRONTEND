import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'NBU_SHKOLO_FRONTEND';
  showTabsHeader = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const role = this.userService.getActiveRole();
    this.showTabsHeader = role !== 'ROLE_HEADMASTER';
  }
}
