import { Subject } from './subject.model';
import { Term } from './term.model';

export class Schedule {
  id: number;
  dayOfTheWeek: string;
  numberOfPeriod: string;
  subject: Subject;
  term: Term;

  constructor(
    id: number,
    dayOfTheWeek: string,
    numberOfPeriod: string,
    subject: Subject,
    term: Term
  ) {
    this.id = id;
    this.dayOfTheWeek = dayOfTheWeek;
    this.numberOfPeriod = numberOfPeriod;
    this.subject = subject;
    this.term = term;
  }
}
