import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../types/quiz.type';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private httpClient: HttpClient) { }
  
  gerarQuiz(dados: { area: number; conteudos: number[]; nivel: string; }){
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });

    return this.httpClient.post<Quiz[]>('http://127.0.0.1:8000/api/quiz/', dados, { headers }); 
  }

  getHistorico(): Observable<Quiz[]> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });

    return this.httpClient.get<Quiz[]>('http://127.0.0.1:8000/api/quiz/historico/', { headers }); 
  }
}
