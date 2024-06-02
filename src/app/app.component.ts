import { Component } from '@angular/core';
import { Router } from '@angular/router';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
/*--------------------------------------------------------------------*/
export class AppComponent {
  // Ctor
  constructor(private router: Router) {}
  /*--------------------------------------------------------------------*/

  hideNavBar(): boolean {
    // Get the current route
    const currentRoute = this.router.url;
    // Check if the current route is the login or register route
    return currentRoute.includes('adminpanel');
  }
  /*--------------------------------------------------------------------*/
  hideFooter(): boolean {
    // Get the current route
    const currentRoute = this.router.url;
    // Check if the current route is the login or register route
    return currentRoute.includes('users/login') || currentRoute.includes('users/register') || currentRoute.includes('adminpanel');
  }
  /*--------------------------------------------------------------------*/
}
