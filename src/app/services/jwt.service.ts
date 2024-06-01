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
}
