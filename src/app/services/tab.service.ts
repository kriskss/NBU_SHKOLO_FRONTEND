import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private currentTabSubject = new BehaviorSubject<number>(0); // Default: First tab
  public currentTab$ = this.currentTabSubject.asObservable();

  setTab(index: number) {
    this.currentTabSubject.next(index);
  }

  resetTab() {
    this.currentTabSubject.next(0); // Reset to first tab
  }

  get currentTabValue(): number {
    return this.currentTabSubject.value;
  }
}
