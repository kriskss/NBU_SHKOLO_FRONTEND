import { School } from './school.model';

export class Klass {
  id: number;
  name: string;
  school: School;

  constructor(id: number, name: string, school: School) {
    this.id = id;
    this.name = name;
    this.school = school;
  }
}
