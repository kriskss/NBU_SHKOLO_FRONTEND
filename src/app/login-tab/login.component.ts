import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public userControl = new FormControl('', [Validators.required]);
  public passwordControl = new FormControl('', [Validators.required]);
  hide = true;

  constructor(private fb: FormBuilder) {
    this.loginForm = new FormGroup({
      //   user: this.userControl,
      //   password: this.passwordControl,
    });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Handle form submission
      console.log(this.loginForm.value);
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import {
//   FormGroup,
//   FormControl,
//   Validators,
//   FormBuilder,
// } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AccountService } from '../services/account.service';
// // import { LoginInformation, LoginService } from '../services/login.service';
// // import { AccountService } from '../services/account.service';
// // import { Account } from '../models/account.model';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
// })
// export class LoginComponent implements OnInit {
//   hide = true;
//   isValidated = true;
//   public loginForm: FormGroup;
//   // public isLoginMode = true;
//   onSwitchMode() {
//     // this.isLoginMode = !this.isLoginMode;
//   }
//   public userControl = new FormControl('', [Validators.required]);
//   public passwordControl = new FormControl('', [Validators.required]);

//   constructor(
//     private accountService: AccountService,
//     private router: Router,
//     private formBuilder: FormBuilder
//   ) {
//     this.loginForm = new FormGroup({
//       user: this.userControl,
//       password: this.passwordControl,
//     });
//   }

//   async onSubmit(): Promise<void> {
//     if (this.loginForm.valid) {
//       const username = this.userControl.value as string;
//   const password = this.passwordControl.value as string;

// Call the service to check if the account can login
//   this.accountService
//     .getAccountByPasswordAndUsername(password, username)
//     .subscribe(
//       (account: Account) => {
//         // If account exists and login is successful
//         if (account && account.accountRole?.id == 2) {
//           this.accountService.isAdmin = true;
//           this.accountService.isLogin = true;
//           console.log('Login successful as Admin');
//           console.log(this.accountService.isAdmin);
//           this.accountService.showSuccessMessage();
//           this.router.navigateByUrl('packages');
//           this.accountService.currentUserId = account.id;
//         } else if (account.accountRole?.id == 1) {
//           this.accountService.isAdmin = false;
//           this.accountService.isLogin = true;
//           this.accountService.showSuccessMessage();
//           this.router.navigateByUrl('packages');
//           console.log('Login successful as Client');
//           this.accountService.currentUserId = account.id;
//         } else {
//           this.accountService.showErrorMessage();
//           console.log('Invalid username or password');
//         }
//       },
//       (error) => {
//         // Handle error
//         this.accountService.showErrorMessage();
//         this.accountService.isLogin = false;
//         console.error('Error logging in:', error);
//       }
//     );
// }

// this.service.login(this.userControl.value, this.passwordControl.value);
// if (this.service.successfulLogIn) {
//   this.service.showSuccessMessage();
//   this.router.navigateByUrl('packages');
// } else {
//   this.service.showErrorMessage();
// }
// this.isLoading = false;
// this.service
//   .login(this.userControl.value, this.passwordControl.value)
//   .subscribe((value) => {
//     console.log(value);
//     if(value["data"][0]["token"]){
//       this.router.navigateByUrl("dashboard");
//       this.service.showSuccessMessage();
//     }
//     else{
//        this.service.showErrorMessage();
//     }
//   });
// console.log(this.userControl.value);
// console.log(this.passwordControl.value);
//   }

//   ngOnInit(): void {}
// }
