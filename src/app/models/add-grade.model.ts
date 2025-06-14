export interface AddGradeDto {
  grade: number;
  dateOfGrade: string;
  gradeType: 'TEKUSHTA' | 'SROCHNA' | 'GODISHNA';
  dateAdded: string;
  studentId: number;
  subjectId: number;
  termId: number;
}
