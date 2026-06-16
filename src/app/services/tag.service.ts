import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TagsService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}/tag`);
  }

  getTag(id: string): Observable<Tag> {
    return this.http.get<Tag>(`${this.baseUrl}/tag/${id}`);
  }

  createTag(tag: Partial<Tag>): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/tag`, tag);
  }

  updateTag(id: string, tag: Partial<Tag>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/tag/${id}`, tag);
  }

  deleteTag(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tag/${id}`);
  }
}
