export class Student {
  student_id: number;
  klass_id: number;
  school_id: number;
  user_id: number;

  constructor(
    student_id: number,
    klass_id: number,
    school_id: number,
    user_id: number
  ) {
    this.student_id = student_id;
    this.klass_id = klass_id;
    this.school_id = school_id;
    this.user_id = user_id;
  }
}
