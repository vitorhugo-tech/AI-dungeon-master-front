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

  create(data: any): Observable<any> {
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
