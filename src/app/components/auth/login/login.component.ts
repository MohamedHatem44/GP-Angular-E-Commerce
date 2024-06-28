import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtService } from '../../../services/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { retry } from 'rxjs';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
/*--------------------------------------------------------------------*/
export class LoginComponent {
  user: any;
  active: boolean;
  isLoading: boolean = false;
  apiError: string = '';
  showPassword: boolean = false;
  /*--------------------------------------------------------------------*/
  constructor(private _AuthService: AuthService, private _JwtService: JwtService, private _Router: Router, private _ToastrService: ToastrService) {}
  /*--------------------------------------------------------------------*/
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  /*--------------------------------------------------------------------*/
  loginUser(loginForm: FormGroup) {
    this.isLoading = true;
    this.apiError = '';
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this._AuthService.login({ email, password }).subscribe({
        next: (response) => {
          if (response) {
            const token = response.token;
            const role = this._JwtService.getRoleFromToken(token);
            if (role == 'Admin') {
              this.isLoading = false;
              this._Router.navigate(['/admindashboard']);
            } else {
              this.isLoading = false;
              this._Router.navigate(['/home']);
            }
            this._ToastrService.success('Login successfully');
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 400) {
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
