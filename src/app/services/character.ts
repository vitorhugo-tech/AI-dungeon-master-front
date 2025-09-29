import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  constructor(private http: HttpClient) {}

  apiUrl = environment.apiUrl + '/personagem'
  token  = `Bearer ${localStorage.getItem('access_token')}`

  list(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      }
    });
  }

  create(data: { nome: string, classe: string, raca: string, origens: string[] | string, atr?: object }): Observable<any> {
    data.atr = { STR: 1, AGI: 1, RES: 1, INT: 1, PER: 1, DET: 1 };
    data.origens = data.origens[0] + ' e ' + data.origens[1];

    if (data.classe == 'Guerreiro') data.atr = { STR: 4, AGI: 3, RES: 4, INT: 1, PER: 2, DET: 2 };
    if (data.classe == 'Mago')      data.atr = { STR: 1, AGI: 2, RES: 1, INT: 5, PER: 4, DET: 3 };
    if (data.classe == 'Ladino')    data.atr = { STR: 2, AGI: 4, RES: 2, INT: 2, PER: 3, DET: 3 };
    if (data.classe == 'Clérigo')   data.atr = { STR: 2, AGI: 1, RES: 3, INT: 3, PER: 4, DET: 3 };

    return this.http.post(this.apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      }
    });
  }

  get(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      }
    });
  }

  update(data: { personagem_id: string, nome: string, classe: string, raca: string, origens: string[] | string, atr?: object }): Observable<any> {
    data.atr = { STR: 1, AGI: 1, RES: 1, INT: 1, PER: 1, DET: 1 };
    data.origens = data.origens[0] + ' e ' + data.origens[1];

    if (data.classe == 'Guerreiro') data.atr = { STR: 4, AGI: 3, RES: 4, INT: 1, PER: 2, DET: 2 };
    if (data.classe == 'Mago')      data.atr = { STR: 1, AGI: 2, RES: 1, INT: 5, PER: 4, DET: 3 };
    if (data.classe == 'Ladino')    data.atr = { STR: 2, AGI: 4, RES: 2, INT: 2, PER: 3, DET: 3 };
    if (data.classe == 'Clérigo')   data.atr = { STR: 2, AGI: 1, RES: 3, INT: 3, PER: 4, DET: 3 };

    return this.http.put(`${this.apiUrl}/${data.personagem_id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      }
    });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      }
    });
  }
}
