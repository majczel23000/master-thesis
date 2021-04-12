import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserLoginData } from '../models/userLoginData.model';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { LoginResponseModel } from '../models/LoginResponse.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user: User;
  apiUrl = environment.setting.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  isUserLogged() {
    return localStorage.getItem('token');
  }

  loginUser(userData: UserLoginData) {
    return this.http.post<LoginResponseModel>(`${this.apiUrl}/users/login`, userData);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setUser(user: User) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
