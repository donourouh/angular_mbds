import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roleKey = 'userRole';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>('http://localhost:8010/api/login', { login: username, password })
      .pipe(
        map(res => {
          localStorage.setItem(this.roleKey, res.role); // On stocke le rôle de l'utilisateur
          return true;
        }),
        catchError(() => {
          return of(false);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.roleKey);
    window.location.href = '/login';
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getRoleConnecte(): string {
    return this.getUserRole() || '';
  }

  isLoggedIn(): boolean {
    return this.getUserRole() !== null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}
