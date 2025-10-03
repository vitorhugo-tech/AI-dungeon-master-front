import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  constructor(private http: HttpClient) {}

  apiUrl = environment.apiUrl + '/campanha'
  token  = `Bearer ${localStorage.getItem('access_token')}`

  list(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      }
    });
  }

  /* Esta função não está sendo utilizada atualmente */
  create(personagem_id: string): Observable<any> {
    const data = {
      titulo: "A Maldição de Strahd",
      descricao: "Aventura com elementos de terror",
      personagem_id: personagem_id,
    }

    return this.http.post(this.apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      }
    });
  }

  /* Esta função não está sendo utilizada atualmente */
  get(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token
      }
    });
  }

  /* Esta função não está sendo utilizada atualmente */
  update(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${data.campanha_id}`, data, {
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
