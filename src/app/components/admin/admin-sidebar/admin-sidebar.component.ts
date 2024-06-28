import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { WishListService } from '../../../services/wishList.service';
import { JwtService } from '../../../services/jwt.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminSidebarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private authSubscription: Subscription | undefined;

  isLogin: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;
  role: string;
  /*--------------------------------------------------------------------*/
  // Ctor
  constructor(
    private _AuthService: AuthService,
    private _CartService: CartService,
    private _WishListService: WishListService,
    private _JwtService: JwtService,
    private _Router: Router,
    private _renderer: Renderer2,
    private _ElementRef: ElementRef
  ) {}
  /*--------------------------------------------------------------------*/
  ngOnInit(): void {
    this.authSubscription = this._AuthService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.updateLoginStatus();
      } else {
        this.isLogin = false;
        this.isAdmin = false;
        this.isUser = false;
        this.unsubscribeFromSubscriptions();
        // this.clearCartAndWishlistCounts();
      }
    });
  }
  /*--------------------------------------------------------------------*/
  ngOnDestroy(): void {
    this.unsubscribeFromSubscriptions();
  }
  /*--------------------------------------------------------------------*/
  // Method to Update Login Status
  updateLoginStatus() {
    this._AuthService.userToken.subscribe({
      next: () => {
        if (this._AuthService.userToken.getValue() !== null) {
          this.isLogin = true;
          const token = this._AuthService.userToken.getValue();
          this.role = this._JwtService.getRoleFromToken(token);
          if (this.role === 'Admin') {
            this.isAdmin = true;
            this.isUser = false;
          }
        } else {
          this.isLogin = false;
          this.isAdmin = false;
          this.isUser = false;
        }
      },
    });
  }
  /*--------------------------------------------------------------------*/
  // Method to log out
  logOut() {
    this._AuthService.logout();
    this.isLogin = false;
    this.isAdmin = false;
    this.isUser = false;
    this.unsubscribeFromSubscriptions();
  }
  /*--------------------------------------------------------------------*/
  private unsubscribeFromSubscriptions() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  /*--------------------------------------------------------------------*/
}
