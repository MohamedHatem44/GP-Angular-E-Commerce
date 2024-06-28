import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
/*--------------------------------------------------------------------*/
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  /*------------------------------------------------------------------*/
  const isLoggedIn = inject(AuthService).isAuthenticated();
  if (isLoggedIn) return true;
  /*------------------------------------------------------------------*/
  inject(Router).navigate(['users/login']);
  return false;
  /*------------------------------------------------------------------*/
};
