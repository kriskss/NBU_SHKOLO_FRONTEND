import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tabsHeader',
  templateUrl: './tabsHeader.component.html',
  styleUrls: ['./tabsHeader.component.scss'],
})
export class TabsHeaderComponent implements OnInit {
  selectedTab: number = 0; // Default to first tab

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Ensure localStorage is accessible (only on browser side)
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTabIndex = localStorage.getItem('selectedTab');
      if (savedTabIndex !== null) {
        this.selectedTab = parseInt(savedTabIndex, 10);
      }
    }
  }

  onTabChange(event: any) {
    const index = event.index;
    this.selectedTab = index;

    // Ensure localStorage is accessible (only on browser side)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('selectedTab', index.toString());
    }

    if (index === 0) {
      this.router.navigate(['/grades']);
    } else if (index === 1) {
      this.router.navigate(['/absence']);
    } else if (index === 2) {
      this.router.navigate(['/student-schedule']);
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
