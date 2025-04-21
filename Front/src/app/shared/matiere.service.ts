// src/app/shared/services/matieres.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matiere } from './models/matiere.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatieresService {
  uri = `${environment.apiUrl}/matieres`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getMatieres(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(this.uri, { headers: this.getHeaders() });
  }

  addMatiere(matiere: Matiere): Observable<Matiere> {
    return this.http.post<Matiere>(this.uri, matiere, { headers: this.getHeaders() });
  }

  updateMatiere(matiere: Matiere): Observable<Matiere> {
    return this.http.put<Matiere>(`${this.uri}/${matiere._id}`, matiere, { headers: this.getHeaders() });
  }

  deleteMatiere(id: string): Observable<any> {
    return this.http.delete(`${this.uri}/${id}`, { headers: this.getHeaders() });
  }
}