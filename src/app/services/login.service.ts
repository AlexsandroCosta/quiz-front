import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url_root: string = 'http://127.0.0.1:8000/api/auth/token/login/';
  
  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string){
    const body = {
      username: username,
      password: password
    };

    return this.httpClient.post<LoginResponse>(this.url_root, body);
  }
}
