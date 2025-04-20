// src/app/shared/services/matieres.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Matiere } from './models/matiere.model';

@Injectable({
  providedIn: 'root'
})
export class MatieresService {
  uri = 'http://localhost:8010/api/matieres';

  constructor(private http: HttpClient) { }

  getMatieres(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>(this.uri);
  }

  addMatiere(matiere: Matiere): Observable<Matiere> {
    return this.http.post<Matiere>(this.uri, matiere);
  }

  updateMatiere(matiere: Matiere): Observable<Matiere> {
    return this.http.put<Matiere>(`${this.uri}/${matiere._id}`, matiere);
  }

  deleteMatiere(id: string): Observable<any> {
    return this.http.delete(`${this.uri}/${id}`);
  }
}