import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';
import { thumbnailImage } from '../../../../utils/constants';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
/*--------------------------------------------------------------------*/
export class UserProfileComponent implements OnInit {
  isLoading: boolean = false;
  thumbnailProfile = thumbnailImage;
  currentUser: User | null = null;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(private _AuthService: AuthService) {}
  /*------------------------------------------------------------------*/
  ngOnInit(): void {
    this._getCurrentUserInfo();
  }
  /*------------------------------------------------------------------*/
  _getCurrentUserInfo() {
    this.isLoading = true;
    this._AuthService.getCurrentUserInfo().subscribe({
      next: (response: User) => {
        this.currentUser = response;
        this.currentUser.imageUrl = response.imageUrl?.trim() ? response.imageUrl : thumbnailImage;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching user profile:', err);
        this.isLoading = false;
      },
    });
  }
  /*------------------------------------------------------------------*/
}
