/*--------------------------------------------------------------------*/
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt.service';
/*--------------------------------------------------------------------*/
export const adminGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const jwtService = inject(JwtService);
  /*------------------------------------------------------------------*/
  // Get token from localStorage or wherever it's stored
  const token = localStorage.getItem('token');
  if (token) {
    // Decode the token to get user information
    const role = jwtService.getRoleFromToken(token);
    // Check if user role is admin
    if (role === 'Admin') {
      return true;
    }
  }
  /*------------------------------------------------------------------*/
  // Redirect to '/' if user is not an admin or token is missing
  router.navigate(['/']);
  return false;
  /*------------------------------------------------------------------*/
};
