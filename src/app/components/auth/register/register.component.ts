import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
/*--------------------------------------------------------------------*/
export class RegisterComponent implements OnInit {
  user: any;
  loading: boolean = false;
  error: string | null = null;
  showPassword: boolean = false;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private authService: AuthService, private router: Router, private toaster: ToastrService) {}
  /*------------------------------------------------------------------*/
  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/i)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
  });
  /*------------------------------------------------------------------*/
  ngOnInit(): void {
    this.registerForm.valueChanges.subscribe({
      next: () => {
        this.registerForm.get('password').errors;
      },
    });
  }
  onRegister() {
    this.loading = true;
    this.error = null;
    this.authService.register(this.registerForm.value).subscribe({
      next: (value) => {
        this.loading = false;
        this.toaster.success('Registration Success');
        this.router.navigate(['users/login']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 400 && err.error.message === 'Email is already exist') {
          this.error = 'User with this email already exists. Please choose a different email.';
        } else {
          this.error = 'An unexpected error occurred. Please try again later.';
        }
      },
    });
  }
  /*------------------------------------------------------------------*/
  public get passwordMismatch(): boolean {
    if (!this.registerForm.get('confirmPassword')?.touched) return false;
    return this.registerForm.get('password')?.value?.trim() !== this.registerForm.get('confirmPassword')?.value?.trim();
  }
  /*------------------------------------------------------------------*/
}
