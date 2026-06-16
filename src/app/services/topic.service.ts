import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TopicService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.baseUrl}/topic`);
  }

  getTopic(id: string): Observable<Topic> {
    return this.http.get<Topic>(`${this.baseUrl}/topic/${id}`);
  }

  createTopic(topic: Partial<Topic>): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/topic`, topic);
  }

  updateTopic(id: string, topic: Partial<Topic>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/topic/${id}`, topic);
  }

  deleteTopic(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/topic/${id}`);
  }
}
