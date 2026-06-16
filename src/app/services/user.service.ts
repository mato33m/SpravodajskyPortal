import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/user`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/${id}`);
  }

  createUser(user: Partial<User>): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/user`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/user/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/${id}`);
  }
}
