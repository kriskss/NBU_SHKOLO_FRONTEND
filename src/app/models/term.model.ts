export class Term {
  id: number;
  termType: 'WINTER' | 'SPRING';

  constructor(id: number, termType: 'WINTER' | 'SPRING') {
    this.id = id;
    this.termType = termType;
  }
}
