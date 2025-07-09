import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../types/quiz.type';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private quiz!: Quiz;

  constructor(private httpClient: HttpClient) { }

  setQuiz(resposta: Quiz) {
    this.quiz = resposta;

    localStorage.setItem('quiz', JSON.stringify(resposta));
  }

  getQuiz(): Quiz {
    if (!this.quiz) {
      const stored = localStorage.getItem('quiz');
      if (stored && stored !== 'undefined') {
        try {
          this.quiz = JSON.parse(stored);
        } catch (e) {
          console.error('Erro ao fazer parse do quiz:', e);
          localStorage.removeItem('quiz');
        }
      }
    }
    return this.quiz;
  }

  clearQuiz() {
    localStorage.removeItem('quiz');
  }
  
  gerarQuiz(dados: { area: number; conteudos: number[]; nivel: string; }){
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });

    return this.httpClient.post<Quiz>('http://127.0.0.1:8000/api/quiz/', dados, { headers }); 
  }

  responderQuiz(quizId: number, respostas: { id_pergunta: number; id_resposta: number }[]): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    });

    return this.httpClient.put(`http://127.0.0.1:8000/api/quiz/${quizId}/`, respostas , { headers });
  }

  getRanking(){
    return this.httpClient.get<{ id: number; usuario: number; nome_usuario: string; pontuacao: number }[]>('http://127.0.0.1:8000/api/informacoes/ranking/')
  }

  getHistorico(): Observable<Quiz[]> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });

    return this.httpClient.get<Quiz[]>('http://127.0.0.1:8000/api/quiz/historico/', { headers }); 
  }
}
