import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { thumbnailImage } from '../../../../utils/constants';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile-image',
  templateUrl: './user-profile-image.component.html',
  styleUrl: './user-profile-image.component.css',
})
export class UserProfileImageComponent {
  imagePreview: string | null = null;
  uploadedFile: File | null = null;
  isProfileUpdating: boolean = false;
  @Input() imageSrc: string = thumbnailImage; // decorate the property with @Input()

  @ViewChild('uploader')
  uploader: ElementRef | undefined;
  constructor(private authService: AuthService, private toastr: ToastrService) {}

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
      next: (value) => {
        this.imageSrc = value.url as string;
        this.imagePreview = null;
        this.toastr.success('Woohoo image is updated!');
      },
      error: () => {
        this.isProfileUpdating = false;
        this.toastr.error('Ummm failed to update!');
      },
      complete: () => {
        this.isProfileUpdating = false;
      },
    });
  }
}
