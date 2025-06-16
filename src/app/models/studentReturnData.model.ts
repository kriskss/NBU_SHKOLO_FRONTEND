import { Absence } from './absence.model';
import { Klass } from './klass.model';

export interface StudentReturnData {
  id: number;
  absences: Absence[]; // Replace with actual Absence[] model if needed
  klass: Klass;
}
