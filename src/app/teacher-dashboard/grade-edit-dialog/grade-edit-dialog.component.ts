import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GradeDetail } from '../../models/gradeDetail.model';

@Component({
  selector: 'app-grade-edit-dialog',
  templateUrl: './grade-edit-dialog.component.html',
  styleUrls: ['./grade-edit-dialog.component.scss'],
})
export class GradeEditDialogComponent {
  gradeValue: number;

  // Default term and gradeType
  termId: number = 3; // default WINTER id
  gradeType: 'TEKUSHTA' | 'SROCHNA' | 'GODISHNA' = 'TEKUSHTA';
  selectedTermType: 'WINTER' | 'SPRING' = 'WINTER';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      grade?: GradeDetail;
      mode: 'edit' | 'add';
      studentId: number;
      subjectId: number;
    },
    private dialogRef: MatDialogRef<GradeEditDialogComponent>
  ) {
    this.gradeValue = data.grade?.grade ?? 2;
    this.selectedTermType = data.grade?.term?.termType ?? 'WINTER';

    this.updateTermIdFromTermType(this.selectedTermType);

    this.gradeType = data.grade?.gradeType ?? 'TEKUSHTA';

    if (data.mode === 'edit' && data.grade) {
      this.termId = data.grade.term.id;
      this.gradeType = data.grade.gradeType;
      this.selectedTermType = data.grade.term.termType;
    }
  }

  onTermTypeChange() {
    this.updateTermIdFromTermType(this.selectedTermType);
  }

  private updateTermIdFromTermType(termType: 'WINTER' | 'SPRING') {
    if (termType === 'WINTER') {
      this.termId = 3;
    } else if (termType === 'SPRING') {
      this.termId = 4;
    }
  }

  save() {
    const result: any = {
      action: 'save',
      gradeValue: this.gradeValue,
      termId: this.termId,
      gradeType: this.gradeType,
      termType: this.selectedTermType,
    };

    this.dialogRef.close(result);
  }

  deleteGrade() {
    this.dialogRef.close({ action: 'delete' });
  }

  cancel() {
    this.dialogRef.close({ action: 'cancel' });
  }
}
