import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../enviroment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  apiUrl = environment.apiUrl

  login(data: { email: string, password: string }): Observable<any> {
    const body = new HttpParams()
      .set('username', data.email)
      .set('password', data.password);

    return this.http.post(`${this.apiUrl}/auth/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  create(data: { email: string, password: string, username?: string }): Observable<any> {
    data.username = data.email
    return this.http.post(`${this.apiUrl}/users/adiciona`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveTokens(data: { access_token: string, refresh_token: string }) {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
  }

  getTokens(): object {
    return {
      access_token: localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token')
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isLoggedIn(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/test-token`, '', {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    }).pipe(
      map(() => true),
      catchError(() => of(false))
    );;
  }
}
