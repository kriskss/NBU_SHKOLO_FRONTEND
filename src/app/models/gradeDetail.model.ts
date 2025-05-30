import { Subject } from './subject.model';
import { Term } from './term.model';

export class GradeDetail {
  id: number;
  grade: number;
  gradeType: 'TEKUSHTA' | 'SROCHNA' | 'GODISHNA';
  subject: Subject;
  term: Term;
  dateAdded: string;
  dateOfGrade: string;

  constructor(
    id: number,
    grade: number,
    gradeType: 'TEKUSHTA' | 'SROCHNA' | 'GODISHNA',
    subject: Subject,
    term: Term,
    dateAdded: string,
    dateOfGrade: string
  ) {
    this.id = id;
    this.grade = grade;
    this.gradeType = gradeType;
    this.subject = subject;
    this.term = term;
    this.dateAdded = dateAdded;
    this.dateOfGrade = dateOfGrade;
  }
}
