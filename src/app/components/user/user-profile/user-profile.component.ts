import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { thumbnailImage } from '../../../../utils/constants';
import { ToastrService } from 'ngx-toastr';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
/*--------------------------------------------------------------------*/
export class UserProfileComponent implements OnInit {
  isLoading: boolean = false;
  error: string | null = null;
  thumbnailProfile = thumbnailImage;
  currentUser: User | null = null;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private authService: AuthService) {}
  /*------------------------------------------------------------------*/
  ngOnInit(): void {
    this.getCurrentUserInfo();
  }
  /*------------------------------------------------------------------*/
  getCurrentUserInfo() {
    this.isLoading = true;
    this.error = null;
    this.authService.getCurrentUserInfo().subscribe({
      next: (response: User) => {
        this.currentUser = response;
        this.currentUser.imageUrl = response.imageUrl?.trim() ? response.imageUrl : thumbnailImage;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = "Couldn't retrieve user info!";
        console.error('Error fetching user profile:', err);
        this.isLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
}
