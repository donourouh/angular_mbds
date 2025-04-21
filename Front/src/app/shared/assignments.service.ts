import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { forkJoin, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  uri = `${environment.apiUrl}/assignments`;

  assignments:Assignment[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Token utilisé:', token);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAssignmentsPagines(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.uri}?page=${page}&limit=${limit}`, { headers: this.getHeaders() });
  }

  getAssignment(_id:string):Observable<Assignment|undefined> {
    console.log("Service:getAssignment appelée avec id = " + _id);
    let URI = this.uri + '/' + _id;

    return this.http.get<Assignment>(URI, { headers: this.getHeaders() });
  }

  addAssignment(assignment:Assignment):Observable<string> {
    console.log('URL de l\'API:', this.uri);
    console.log('Données envoyées:', assignment);
    const headers = this.getHeaders();
    console.log('Headers:', headers);
    
    if (!this.authService.isLoggedIn()) {
      console.error('Utilisateur non connecté');
      throw new Error('Utilisateur non connecté');
    }
    
    return this.http.post<string>(this.uri, assignment, { headers })
      .pipe(
        tap(response => console.log('Réponse du serveur:', response)),
        catchError(error => {
          console.error('Erreur détaillée:', error);
          if (error.status === 401) {
            this.authService.logout();
          }
          throw error;
        })
      );
  }

  updateAssignment(assignment:Assignment):Observable<string> {
    console.log('Mise à jour - URL:', this.uri);
    console.log('Données envoyées:', assignment);
    const headers = this.getHeaders();
    
    if (!this.authService.isLoggedIn()) {
      console.error('Utilisateur non connecté');
      throw new Error('Utilisateur non connecté');
    }
    
    return this.http.put<string>(this.uri, assignment, { headers })
      .pipe(
        tap(response => console.log('Réponse du serveur:', response)),
        catchError(error => {
          console.error('Erreur détaillée:', error);
          if (error.status === 401) {
            this.authService.logout();
          }
          throw error;
        })
      );
  }

  deleteAssignment(assignment:Assignment):Observable<string> {
    if (!this.authService.isLoggedIn()) {
      console.error('Utilisateur non connecté');
      throw new Error('Utilisateur non connecté');
    }
    
    return this.http.delete<string>(this.uri + '/' + assignment._id, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            this.authService.logout();
          }
          throw error;
        })
      );
  }
}
