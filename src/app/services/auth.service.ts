import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse } from '../types/login-response.type';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private httpClient: HttpClient, 
    private router: Router,
    private userService: UserService
  ) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  signup(username: string, email: string, password: string){
    const body = {
      username: username,
      email: email,
      password: password
    };

    return this.httpClient.post('http://127.0.0.1:8000/api/users/', body);
  }

  login(username: string, password: string){
    const body = {
      username: username,
      password: password
    };
  
    return this.httpClient.post<LoginResponse>('http://127.0.0.1:8000/api/auth/token/login/', body);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
