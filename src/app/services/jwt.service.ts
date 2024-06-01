import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
/*--------------------------------------------------------------------*/
@Injectable({
  providedIn: 'root',
})
/*--------------------------------------------------------------------*/
export class JwtService {
  constructor() {}
  /*--------------------------------------------------------------------*/
  // Get role from token
  getRoleFromToken(token: string): string | null {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
  /*--------------------------------------------------------------------*/
  // Get role from token
  getUserIdFromToken(token: string): string | null {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
  /*--------------------------------------------------------------------*/
}
