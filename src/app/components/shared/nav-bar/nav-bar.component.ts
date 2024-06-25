import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { JwtService } from '../../../services/jwt.service';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
/*--------------------------------------------------------------------*/
export class NavBarComponent implements OnInit {
  /*--------------------------------------------------------------------*/
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
    private _JwtService: JwtService,
    private _Router: Router,
    private _renderer: Renderer2,
    private _ElementRef: ElementRef
  ) {}
  /*--------------------------------------------------------------------*/
  ngOnInit(): void {
    this.updateLoginStatus();
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
          } else {
            this.isAdmin = false;
            this.isUser = true;
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
  }
  /*-----------------------------------------------------------------*/

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
}
