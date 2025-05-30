import { Klass } from './klass.model';
import { School } from './school.model';
import { Subject } from './subject.model';
import { User } from './user.model';

export class Teacher {
  id: number;
  schools: School[];
  subjects: Subject[];
  user: User;
  klasses: Klass[];

  constructor(
    id: number,
    schools: School[],
    subjects: Subject[],
    user: User,
    klasses: Klass[]
  ) {
    this.id = id;
    this.schools = schools;
    this.subjects = subjects;
    this.user = user;
    this.klasses = klasses;
  }
}
