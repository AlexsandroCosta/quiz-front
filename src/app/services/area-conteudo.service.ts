import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaConteudoService {
  constructor(private httpClient: HttpClient) {}

  getAreas(): Observable<{ id: number, nome: string }[]> {
    return this.httpClient.get<{ id: number, nome: string }[]>('http://127.0.0.1:8000/api/informacoes/area/');
  }

  getConteudos(area: number): Observable<{ id: number, nome: string, area: number }[]>{
    return this.httpClient.get<{ id: number, nome: string, area: number }[]>(`http://127.0.0.1:8000/api/informacoes/${area}/conteudo/`)
  }

}
