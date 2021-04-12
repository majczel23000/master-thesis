import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req, next) {
    const loginService = this.injector.get(LoginService);
    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${loginService.getToken()}`
      }
    });
    return next.handle(tokenizedReq);
  }
}
