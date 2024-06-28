import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-pass-edit',
  templateUrl: './user-pass-edit.component.html',
  styleUrl: './user-pass-edit.component.css',
})
export class UserPassEditComponent implements OnInit {
  error: unknown = null;
  loading: boolean = false;
  showOldPass: boolean = false;
  showPassword: boolean = false;
  showConfirmPass: boolean = false;
  passwordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
  });
  constructor(private authService: AuthService, private toastr: ToastrService, private _Router: Router) {}

  public get passwordMismatch(): boolean {
    if (!this.passwordForm.get('confirmPassword')?.touched) return false;
    return this.passwordForm.get('password')?.value?.trim() !== this.passwordForm.get('confirmPassword')?.value?.trim();
  }

  ngOnInit(): void {
    // Reset errors whenever form is receiving changes from both fields 'password' | 'confirmPassword'
    this.passwordForm.get('password')?.valueChanges.subscribe({
      next: () => {
        this.error = null;
      },
    });
    this.passwordForm.get('confirmPassword')?.valueChanges.subscribe({
      next: () => {
        this.error = null;
      },
    });
  }

  onSubmit() {
    this.error = null;
    this.loading = true;
    const body = this.passwordForm.value as {
      oldPassword: string;
      password: string;
    };
    this.authService.updatePassword(body).subscribe({
      next: () => {
        this.toastr.success('Password updated successfully! 🥳');
        this.passwordForm.reset();
        this.loading = false;
        this._Router.navigate(['/profile']);
      },
      error: (err) => {
        this.toastr.error('Changing password is failed! 😣', err?.error || '');
        // this.passwordForm.reset();
        this.loading = false;
        this.error = err?.error || 'Changing password is failed!';
      },
    });
  }
  log(event) {
    console.log(event);
  }
}
