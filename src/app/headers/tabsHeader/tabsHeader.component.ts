import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TabService } from '../../services/tab.service';

@Component({
  selector: 'app-tabsHeader',
  templateUrl: './tabsHeader.component.html',
  styleUrls: ['./tabsHeader.component.scss'],
})
export class TabsHeaderComponent implements OnInit {
  selectedTab: number = 0; // Default to first tab

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private tabService: TabService
  ) {}

  ngOnInit(): void {
    // Ensure localStorage is accessible (only on browser side)
    // debugger;
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTabIndex = localStorage.getItem('selectedTab');
      if (savedTabIndex !== null) {
        this.selectedTab =
          savedTabIndex !== null ? parseInt(savedTabIndex, 10) : 0;
      }
    }
    this.tabService.currentTab$.subscribe((tabIndex) => {
      this.selectedTab = tabIndex;
    });
  }

  onTabChange(event: any) {
    const index = event.index;
    this.tabService.setTab(index);

    // Navigate to the corresponding route
    const routes = ['/grades', '/absence', '/student-schedule'];
    this.router.navigate([routes[index]]);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
