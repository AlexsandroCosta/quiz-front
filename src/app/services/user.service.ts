import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../types/user.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  getUserInfo(): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });

    return this.httpClient.get<User>('http://127.0.0.1:8000/api/users/me/', { headers });
  }

  setUser(userData: User | null) {
    this.userSubject.next(userData);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }
}
