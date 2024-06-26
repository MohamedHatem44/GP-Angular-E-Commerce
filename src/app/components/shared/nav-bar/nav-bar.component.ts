import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { JwtService } from '../../../services/jwt.service';
import { CartService } from '../../../services/cart.service';
import { Subscription } from 'rxjs';
import { WishListService } from '../../../services/wishList.service';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
/*--------------------------------------------------------------------*/
export class NavBarComponent implements OnInit, OnDestroy {
  /*--------------------------------------------------------------------*/
  isLoggedIn: boolean = false;
  private authSubscription: Subscription | undefined;

  cartItemCount: number = 0;
  wishlistItemCount: number = 0;
  private cartCountSubscription: Subscription;
  private wishlistCountSubscription: Subscription;

  isLogin: boolean = false;
  isAdmin: boolean = false;
  isUser: boolean = false;
  role: string;

  isCollapsed = true;
  isDropdownCollapsed = true;
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
        this.resetLoginStatus();
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
        const token = this._AuthService.userToken.getValue();
        if (token !== null) {
          this.isLogin = true;
          this.role = this._JwtService.getRoleFromToken(token);
          if (this.role === 'Admin') {
            this.isAdmin = true;
            this.isUser = false;
          } else {
            this.isAdmin = false;
            this.isUser = true;
            this.subscribeToCartItemCount();
            this.subscribeToWishlistItemCount();
          }
        } else {
          this.resetLoginStatus();
        }
      },
    });
  }
  /*--------------------------------------------------------------------*/
  resetLoginStatus() {
    this.isLogin = false;
    this.isAdmin = false;
    this.isUser = false;
    this.unsubscribeFromSubscriptions();
    this.clearCartAndWishlistCounts();
  }
  /*--------------------------------------------------------------------*/
  isActiveRoute(route: string) {
    return this._Router.url.includes(route);
  }
  /*-----------------------------------------------------------------*/
  toggleCollapse(event: Event) {
    event.preventDefault();
    this.isCollapsed = !this.isCollapsed;
    const togglerIcon = (event.currentTarget as HTMLElement).querySelector('.navbar-toggler-icon');
    if (this.isCollapsed) {
      this._renderer.removeClass(togglerIcon, 'open');
    } else {
      this._renderer.addClass(togglerIcon, 'open');
    }
  }
  /*--------------------------------------------------------------------*/
  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownCollapsed = !this.isDropdownCollapsed;
  }
  /*--------------------------------------------------------------------*/
  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (!this._ElementRef.nativeElement.contains(event.target)) {
      this.isDropdownCollapsed = true;
    }
  }
  /*--------------------------------------------------------------------*/
  private subscribeToCartItemCount() {
    this.cartCountSubscription = this._CartService.cartItemCount$.subscribe(
      (count) => (this.cartItemCount = count),
      (error) => console.error('Error subscribing to cart item count:', error)
    );
  }
  /*--------------------------------------------------------------------*/
  private subscribeToWishlistItemCount() {
    this.wishlistCountSubscription = this._WishListService.wishListItemCount$.subscribe(
      (count) => (this.wishlistItemCount = count),
      (error) => console.error('Error subscribing to wishlist item count:', error)
    );
  }
  /*--------------------------------------------------------------------*/
  private unsubscribeFromSubscriptions() {
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
    }
    if (this.wishlistCountSubscription) {
      this.wishlistCountSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  /*--------------------------------------------------------------------*/
  private clearCartAndWishlistCounts() {
    this.cartItemCount = 0;
    this.wishlistItemCount = 0;
  }
  /*--------------------------------------------------------------------*/
  // Method to log out
  logOut() {
    this._AuthService.logout();
    this._CartService.clearCartItemCount();
    this._WishListService.clearWishListItemCount();
    this.isLogin = false;
    this.isAdmin = false;
    this.isUser = false;
    this.unsubscribeFromSubscriptions();
  }
  /*-----------------------------------------------------------------*/
  isLoginOrRegisterRoute(): boolean {
    const currentUrl = this._Router.url;
    return currentUrl.includes('users/login') || currentUrl.includes('users/register');
  }
  /*-----------------------------------------------------------------*/
}
