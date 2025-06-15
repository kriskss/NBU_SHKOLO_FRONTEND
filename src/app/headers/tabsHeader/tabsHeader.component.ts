import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TabService } from '../../services/tab.service';
import { UserService } from '../../services/user.service';

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
    private tabService: TabService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTabIndex = localStorage.getItem('selectedTab');
      if (savedTabIndex !== null) {
        this.selectedTab = parseInt(savedTabIndex, 10);
      }
    }

    this.syncTabWithUrl(this.router.url);

    this.router.events.subscribe((event: any) => {
      if (event.urlAfterRedirects) {
        this.syncTabWithUrl(event.urlAfterRedirects);
      }
    });

    this.tabService.currentTab$.subscribe((tabIndex) => {
      this.selectedTab = tabIndex;
    });
  }

  private syncTabWithUrl(url: string): void {
    if (url.includes('grades')) this.selectedTab = 0;
    else if (url.includes('absence')) this.selectedTab = 1;
    else if (url.includes('student-schedule')) this.selectedTab = 2;
  }

  onTabChange(event: any) {
    const index = event.index;
    const role = this.userService.getActiveRole();
    let baseRoute = '';

    switch (role) {
      case 'ROLE_TEACHER':
        baseRoute = '/teacher-dashboard';
        break;
      case 'ROLE_PARENT':
        baseRoute = '/parent-dashboard';
        break;
      case 'ROLE_STUDENT':
        baseRoute = ''; // base for students
        break;
      default:
        baseRoute = '';
    }

    const tabRoutes = ['grades', 'absence', 'student-schedule'];

    this.tabService.setTab(index);
    localStorage.setItem('selectedTab', index.toString());

    this.router.navigate([`${baseRoute}/${tabRoutes[index]}`]);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
