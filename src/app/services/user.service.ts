import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../types/user.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    // Ao criar o serviço, tenta carregar o usuário salvo no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  getUserInfo(): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });

    return this.httpClient.get<User>('http://127.0.0.1:8000/api/users/me/', { headers });
  }

  setUser(userData: User | null) {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
    this.userSubject.next(userData);
  }

  // Retorna o valor atual do usuário (não um Observable)
  getUser(): User | null {
    return this.userSubject.value;
  }
}
