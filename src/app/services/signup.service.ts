import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  url_root: string = 'http://127.0.0.1:8000/api/users/';

  constructor(private httpClient: HttpClient) { }

  signup(username: string, email: string, password: string){
    const body = {
      username: username,
      email: email,
      password: password
    };

    return this.httpClient.post(this.url_root, body);
  }

}
