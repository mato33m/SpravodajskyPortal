import  { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ArticleService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/article`);
  }

  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/article/${id}`);
  }

  getMyArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/article/mine`);
  }

  getArticleForEdit(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/article/edit/${id}`);
  }

  createArticle(article: Partial<Article>): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/article`, article);
  }

  updateArticle(id: number, article: Partial<Article>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/article/${id}`, article);
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/article/${id}`);
  }

  getPublishedArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/article/public`);
  }

  searchPublishedArticles(q: string): Observable<Article[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<Article[]>(`${this.baseUrl}/article/public/search`, { params });
  }

  getPublishedArticlesByTag(tagName: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/article/public/tag/${encodeURIComponent(tagName)}`);
  }
}
