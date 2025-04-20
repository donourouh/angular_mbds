import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { forkJoin, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  uri = 'http://localhost:8010/api/assignments';

  assignments:Assignment[] = [];

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
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
    return this.http.post<string>(this.uri, assignment, { headers: this.getHeaders() });
  }

  updateAssignment(assignment:Assignment):Observable<string> {
    return this.http.put<string>(this.uri, assignment, { headers: this.getHeaders() });
  }

  deleteAssignment(assignment:Assignment):Observable<string> {
    return this.http.delete<string>(this.uri + '/' + assignment._id, { headers: this.getHeaders() });
  }
}
