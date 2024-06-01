import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtService } from '../../../services/jwt.service';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
/*--------------------------------------------------------------------*/
export class LoginComponent {
  user: any;
  isLoading: boolean = false;
  apiError: string = '';
  showPassword: boolean = false;
  /*--------------------------------------------------------------------*/
  constructor(private _AuthService: AuthService, private _JwtService: JwtService, private _Router: Router) {}
  /*--------------------------------------------------------------------*/
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    // password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z][a-z0-9]{5,10}$/)]),
    password: new FormControl(null, [Validators.required]),
  });
  /*--------------------------------------------------------------------*/
  loginUser(loginForm: FormGroup) {
    this.isLoading = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this._AuthService.login({ email, password }).subscribe({
        next: (response) => {
          if (response) {
            const token = response.token;
            const role = this._JwtService.getRoleFromToken(token);
            if (role == 'Admin') {
              this.isLoading = false;
              this._Router.navigate(['/adminPanel']);
            } else {
              this.isLoading = false;
              this._Router.navigate(['/home']);
            }
          }
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 400) {
            // console.log(err.error);
            // this.apiError = err.error;
            this.apiError = 'Incorrect email or password. Please try again.';
          } else {
            this.apiError = 'An error occurred while logging in. Please try again later.';
          }
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.apiError = 'Please fill in all the required fields correctly.';
      this.isLoading = false;
    }
  }
  /*--------------------------------------------------------------------*/
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  /*--------------------------------------------------------------------*/
}
