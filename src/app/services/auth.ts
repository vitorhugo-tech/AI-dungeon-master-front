import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  create(data: {email: string, password: string, username?: string }): Observable<any> {
    data.username = data.email
    return this.http.post(`${this.apiUrl}/users/adiciona`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
  }
}
