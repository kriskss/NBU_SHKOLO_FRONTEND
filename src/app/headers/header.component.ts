import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  schoolName: string = 'Your School Name'; // Replace with actual school name
  studentName: string = 'Student Name'; // Replace with actual student name

  constructor() {}

  ngOnInit(): void {
    // Fetch and set school name and student name from a service if necessary
  }

  onLogOutClicked(): void {
    // this.accountService.logout();
  }

  onProfileClicked(): void {
    // Navigate to profile page or perform other actions
  }
}
