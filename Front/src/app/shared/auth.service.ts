import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roleKey = 'userRole';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    console.log('Tentative de connexion à:', `${environment.apiUrl}/login`);
    return this.http.post<any>(`${environment.apiUrl}/login`, { login: username, password })
      .pipe(
        tap(res => console.log('Réponse du serveur:', res)),
        map(res => {
          if (res && res.token) {
            console.log('Token reçu, sauvegarde...');
            localStorage.setItem(this.tokenKey, res.token);
            localStorage.setItem(this.roleKey, res.role);
            return true;
          }
          console.log('Pas de token dans la réponse');
          return false;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Erreur de connexion:', error);
          if (error.error instanceof ErrorEvent) {
            // Erreur côté client
            console.error('Erreur côté client:', error.error.message);
          } else {
            // Erreur côté serveur
            console.error(
              `Code d'erreur ${error.status}, ` +
              `Message: ${error.error.message}`);
          }
          return of(false);
        })
      );
  }

  logout(): void {
    console.log('Déconnexion...');
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.tokenKey);
    window.location.href = '/login';
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Token récupéré:', token ? 'présent' : 'absent');
    return token;
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getRoleConnecte(): string {
    return this.getUserRole() || '';
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const role = this.getUserRole();
    const isLogged = token !== null && role !== null;
    console.log('État de connexion:', isLogged);
    return isLogged;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}
