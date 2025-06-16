import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { SchoolService } from '../../services/school.service';
import { TeacherService } from '../../services/teacher.service';
import { StudentService } from '../../services/student.service';
import { KlassService } from '../../services/klass.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
})
export class AddUserDialogComponent implements OnInit {
  schools: { id: number; name: string }[] = [];
  klasses: { id: number; name: string }[] = [];
  parentStudents: { id: number; name: string }[] = [];

  roles: string[] = [
    'ROLE_ADMIN',
    'ROLE_PARENT',
    'ROLE_STUDENT',
    'ROLE_TEACHER',
    'ROLE_HEADMASTER',
  ];

  roleMap = {
    ROLE_ADMIN: 1,
    ROLE_PARENT: 3,
    ROLE_STUDENT: 4,
    ROLE_TEACHER: 2,
    ROLE_HEADMASTER: 5,
  };

  selectedParentSchoolId: number | null = null;

  userForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    egn: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phoneNumber: new FormControl(''),
    birthDate: new FormControl(''),
    address: new FormControl(''),
    role: new FormControl('', Validators.required),
    schoolIds: new FormControl([]), // for teacher
    studentSchoolId: new FormControl(null), // for student
    studentKlassId: new FormControl(null),
    studentParentIds: new FormControl([]), // for student
    parentStudentIds: new FormControl([]), // for parent
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    private userService: UserService,
    private schoolService: SchoolService,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private klassService: KlassService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadSchools();
    this.onSchoolChange();
    this.userForm.get('role')?.valueChanges.subscribe((role) => {
      if (role === 'ROLE_PARENT') {
        this.userForm.patchValue({ parentStudentIds: [] });
        this.parentStudents = [];
        this.selectedParentSchoolId = null;
      }
    });
  }

  loadSchools(): void {
    this.schoolService.getAllSchools().subscribe({
      next: (schools) => {
        this.schools = schools;
      },
      error: (err) => console.error('Failed to load schools', err),
    });
  }

  onSchoolChange(): void {
    this.userForm.get('studentSchoolId')?.valueChanges.subscribe((schoolId) => {
      if (schoolId) {
        this.klassService.getKlassesBySchool(schoolId).subscribe({
          next: (klasses) => {
            this.klasses = klasses;
            this.userForm.patchValue({ studentKlassId: null });
          },
          error: (err) => console.error('Failed to load klasses', err),
        });
      } else {
        this.klasses = [];
        this.userForm.patchValue({ studentKlassId: null });
      }
    });
  }

  get isTeacher(): boolean {
    return this.userForm.get('role')?.value === 'ROLE_TEACHER';
  }

  get isStudent(): boolean {
    return this.userForm.get('role')?.value === 'ROLE_STUDENT';
  }

  get isParent(): boolean {
    return this.userForm.get('role')?.value === 'ROLE_PARENT';
  }

  //   onParentSchoolSelected(schoolId: number): void {
  //     this.selectedParentSchoolId = schoolId;
  //     this.parentStudents = [];
  //     this.userForm.patchValue({ parentStudentIds: [] });

  //     this.studentService.getStudentsBySchoolId(schoolId).subscribe({
  //       next: (students) => {
  //         const requests = students.map((student) =>
  //           this.studentService
  //             .getStudentUserById(student.id)
  //             .toPromise()
  //             .then((user) => ({
  //               id: student.id,
  //               name: `${user.firstName} ${user.lastName}`,
  //             }))
  //         );

  //         Promise.all(requests)
  //           .then((studentNames) => {
  //             this.parentStudents = studentNames;
  //           })
  //           .catch((err) => {
  //             console.error('Failed to fetch student users for parent', err);
  //           });
  //       },
  //       error: (err) => console.error('Failed to load students for parent', err),
  //     });
  //   }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;
    const roleKey = formValue.role as keyof typeof this.roleMap;
    const phoneNumber = formValue.phoneNumber?.trim() || null;

    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      console.error('Phone number must be exactly 10 digits.');
      return;
    }

    const newUser = {
      username: formValue.username,
      password: formValue.password,
      email: formValue.email,
      egn: formValue.egn,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phoneNumber: phoneNumber,
      birthDate: formValue.birthDate,
      address: formValue.address,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      enabled: true,
      authorities: [
        {
          id: this.roleMap[roleKey],
          authority: roleKey,
        },
      ],
    };

    this.userService.addUser(newUser).subscribe({
      next: (createdUser) => {
        if (roleKey === 'ROLE_TEACHER') {
          this.teacherService
            .assignTeacher({
              userId: createdUser.id,
              schoolIds: formValue.schoolIds ?? [],
              subjectIds: [],
            })
            .subscribe({
              next: () => this.dialogRef.close('refresh'),
              error: (err) => console.error('Assign teacher failed', err),
            });
        } else if (roleKey === 'ROLE_STUDENT') {
          const studentPayload = {
            userId: createdUser.id,
            schoolId: formValue.studentSchoolId || 0,
            klassId: formValue.studentKlassId || 0,
            parentIds: formValue.studentParentIds || [],
          };
          this.studentService.createStudent(studentPayload).subscribe({
            next: () => this.dialogRef.close('refresh'),
            error: (err) => console.error('Add student failed', err),
          });
        }
        // else if (roleKey === 'ROLE_PARENT') {
        //   const parentPayload = {
        //     userId: createdUser.id,
        //     studentIds: formValue.parentStudentIds || [],
        //   };
        //   this.http
        //     .post('http://localhost:8081/parent/add', parentPayload)
        //     .subscribe({
        //       next: () => this.dialogRef.close('refresh'),
        //       error: (err) => console.error('Add parent failed', err),
        //     });
        // }
        else {
          this.dialogRef.close('refresh');
        }
      },
      error: (err) => console.error('Add user failed', err),
    });
  }

  //   loadStudentsForSchool(schoolId: number): void {
  //     this.selectedParentSchoolId = schoolId;
  //     this.parentStudents = [];
  //     this.userForm.patchValue({ parentStudentIds: [] });

  //     this.studentService.getStudentsBySchoolId(schoolId).subscribe({
  //       next: (students) => {
  //         const requests = students.map((student) =>
  //           this.studentService
  //             .getStudentUserById(student.id)
  //             .toPromise()
  //             .then((user) => ({
  //               id: student.id,
  //               name: `${user.firstName} ${user.lastName}`,
  //             }))
  //         );

  //         Promise.all(requests)
  //           .then((studentNames) => {
  //             this.parentStudents = studentNames;
  //           })
  //           .catch((err) => {
  //             console.error('Failed to fetch student users for parent', err);
  //           });
  //       },
  //       error: (err) => console.error('Failed to load students for parent', err),
  //     });
  //   }
}
