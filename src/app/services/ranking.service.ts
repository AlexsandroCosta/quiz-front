import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RankingEntry {
  nome: string;
  pontuacao: number;
}

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private apiUrl = 'http://127.0.0.1:8000/api/informacoes/ranking/';

  constructor(private httpClient: HttpClient) {}

  getRanking(): Observable<RankingEntry[]> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${localStorage.getItem('token')}`
    });
    return this.httpClient.get<RankingEntry[]>(this.apiUrl, { headers });
  }
}
