import { User } from './user.model';
import { Student } from './student.model';
import { StudentReturnData } from './studentReturnData.model';

export interface Parent {
  id: number;
  user: User;
  students: StudentReturnData[];
}
