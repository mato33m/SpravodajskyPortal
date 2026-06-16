import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserComment } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CommentService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getComments(): Observable<UserComment[]> {
    return this.http.get<UserComment[]>(`${this.baseUrl}/comment`);
  }

  getComment(id: number): Observable<UserComment> {
    return this.http.get<UserComment>(`${this.baseUrl}/comment/${id}`);
  }

  createComment(comment: Partial<UserComment>): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/comment`, comment);
  }

  updateComment(id: number, comment: Partial<UserComment>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/comment/${id}`, comment);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comment/${id}`);
  }
}
