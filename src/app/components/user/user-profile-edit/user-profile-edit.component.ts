import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { thumbnailImage } from '../../../../utils/constants';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.css',
})
export class UserProfileEditComponent implements OnInit {
  // Just when user uploaded image
  // After finishing the edit , you should reset this to null
  imagePreview: string | null = null;
  uploadedFile: File | null = null;
  imageSrc: string = thumbnailImage;
  userId: string = '';
  isSubmitting: boolean = false;
  isProfileUpdating: boolean = false;
  loadingUserInfo:boolean =true;
  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.minLength(3), Validators.maxLength(50), Validators.required]),
    lastName: new FormControl('', [Validators.minLength(3), Validators.maxLength(50), Validators.required]),
    address: new FormControl('', [Validators.minLength(3), Validators.maxLength(100), Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(100),
      Validators.required,
    ]),
    email: new FormControl({value:'', disabled:true}, [Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g), Validators.required]),
  });

  @ViewChild('uploader')
  uploader: ElementRef | undefined;

  constructor(private authService: AuthService, private toastr:ToastrService, private router:Router) {}

  ngOnInit(): void {
    this.loadingUserInfo = true;
    this.authService.getCurrentUserInfo().subscribe({
      next: (user) => {
        console.log({ user });
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
          phoneNumber: user.phoneNumber,
        });
        
        this.profileForm.markAllAsTouched();
        this.userId = user.id;
        this.imageSrc = user.imageUrl || thumbnailImage;
      },
      error:()=>{
        this.loadingUserInfo = false
      },
      complete:()=>{
        this.loadingUserInfo = false
      }
    });
  }

  onUploadImage(event: Event) {
    const file = ((event.target as HTMLInputElement).files || [])[0];
    this.uploadedFile = file;
    this.setPreviewImage(file);
  }

  setPreviewImage(image: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = (e.target as FileReader & { result: string }).result;
    };
    reader.readAsDataURL(image);
  }

  reset() {
    (this.uploader as ElementRef).nativeElement.value = '';
    this.imagePreview = null;
  }

  onSaveImage() {
    this.isProfileUpdating = true;
    this.authService.updateProfileImage(this.uploadedFile).subscribe({
      next: () => {
        this.imageSrc = this.imagePreview as string;
        this.imagePreview = null;
        this.toastr.success('Woohoo image is updated!')
      },
      error:()=>{
        this.isProfileUpdating = false;
        this.toastr.error('Ummm failed to update!')
      },
      complete: () => {
        this.isProfileUpdating = false;
      },
    });
  }

  saveProfile() {
    this.isSubmitting = true;
    const updates:Partial<User> = { ...this.profileForm.value,email:this.profileForm.get('email').value, id: this.userId };
    this.authService.updateProfileInfo(updates).subscribe({
      next: () => {
        this.router.navigateByUrl('/profile');
        this.toastr.success('Woohoo profile is updated!')
      },
      error:() => {
        this.isSubmitting = false;
        this.toastr.error('Ummm failed to update!')
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
