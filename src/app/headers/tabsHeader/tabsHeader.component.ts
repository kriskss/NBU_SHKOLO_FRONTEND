import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabsHeader',
  templateUrl: './tabsHeader.component.html',
  styleUrls: ['./tabsHeader.component.scss'],
})
export class TabsHeaderComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  onTabChange(event: any) {
    const index = event.index;
    if (index === 0) {
      this.router.navigate(['/grades']);
    } else if (index === 1) {
      this.router.navigate(['/absence']);
    } else if (index === 2) {
      this.router.navigate(['/schedule']);
    }
  }
}
