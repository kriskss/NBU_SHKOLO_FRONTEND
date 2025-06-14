export interface ScheduleSummaryDTO {
  id: number;
  dayOfTheWeek: string;
  numberOfPeriod: string;
}

export interface Absence {
  id: number;
  absenceState: string;
  absenceType: string;
  dateAdded: string;
  dateOfAbsence: Date;
  studentId: number;
  scheduleSummaryDTO: ScheduleSummaryDTO;
}
