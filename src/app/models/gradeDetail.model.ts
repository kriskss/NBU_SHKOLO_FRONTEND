import { Subject } from './subject.model';
import { Term } from './term.model';

export class GradeDetail {
  grade: number;
  gradeType: 'TEKUSHTA' | 'SROCHNA' | 'GODISHNA';
  subject: Subject;
  term: Term;
  dateAdded: string;
  dateOfGrade: string;

  constructor(
    grade: number,
    gradeType: 'TEKUSHTA' | 'SROCHNA' | 'GODISHNA',
    subject: Subject,
    term: Term,
    dateAdded: string,
    dateOfGrade: string
  ) {
    this.grade = grade;
    this.gradeType = gradeType;
    this.subject = subject;
    this.term = term;
    this.dateAdded = dateAdded;
    this.dateOfGrade = dateOfGrade;
  }
}
