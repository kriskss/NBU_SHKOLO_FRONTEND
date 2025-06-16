import { Component, OnInit } from '@angular/core';
import { Klass } from '../../models/klass.model';
import { KlassService } from '../../services/klass.service';
import { UserService } from '../../services/user.service';
import { HeadmasterService } from '../../services/headmaster.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-headmaster-klasses-tab',
  templateUrl: './headmaster-klass-tab.component.html',
  styleUrls: ['./headmaster-klass-tab.component.scss'],
})
export class HeadmasterKlassTabComponent implements OnInit {
  klasses: Klass[] = [];
  filteredKlasses: Klass[] = [];
  displayedColumns: string[] = ['id', 'name', 'actions'];

  schoolId = 0;
  newKlassName: string = '';
  filterText: string = '';

  constructor(
    private klassService: KlassService,
    private userService: UserService,
    private headmasterService: HeadmasterService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadKlasses();
  }

  async loadKlasses() {
    const user = this.userService.getUser();
    if (!user) return;

    try {
      const headmasterId = await firstValueFrom(
        this.headmasterService.getSchoolByUserId(user.id)
      );
      const school = await firstValueFrom(
        this.headmasterService.getSchoolByHeadmasterId(headmasterId)
      );
      this.schoolId = school.id;

      this.klasses = await firstValueFrom(
        this.klassService.getKlassesBySchool(this.schoolId)
      );
      this.applyFilter();
    } catch (err) {
      console.error('Failed to fetch klasses', err);
    }
  }

  async createNewKlass(name: string) {
    try {
      await firstValueFrom(this.klassService.addKlass(name, this.schoolId));
      this.newKlassName = '';
      await this.loadKlasses();
    } catch (error) {
      console.error('Failed to create klass:', error);
      alert('Failed to create klass');
    }
  }

  applyFilter() {
    const filter = this.filterText.trim().toLowerCase();
    if (filter) {
      this.filteredKlasses = this.klasses.filter((k) =>
        k.name.toLowerCase().includes(filter)
      );
    } else {
      this.filteredKlasses = [...this.klasses];
    }
  }

  async deleteKlass(klassId: number) {
    if (!confirm('Сигурни ли сте, че искате да изтриете този клас?')) return;

    try {
      await firstValueFrom(this.klassService.deleteKlass(klassId));
      this.klasses = this.klasses.filter((k) => k.id !== klassId);
      this.applyFilter(); // update filtered view
    } catch (error) {
      console.error('Неуспешно изтриване на клас:', error);
      alert('Грешка при изтриване на клас');
    }
  }
}
