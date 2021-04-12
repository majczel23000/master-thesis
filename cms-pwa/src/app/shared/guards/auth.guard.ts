import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private loginService: LoginService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.loginService.getToken()) {
      if (state.url !== '/login') {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    } else {
      if (state.url === '/login') {
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }
  }
}
