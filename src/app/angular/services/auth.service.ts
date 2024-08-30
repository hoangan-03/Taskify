import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5187/';
  private apiUrl = this.baseUrl + '/auth';
  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/register`, { email, password });
  }

  login(email: string, password: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/login`, { email, password });
  }

  googleLogin(tokenId: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/google-login`, { tokenId });
  }
}

export interface UserDTO {
  id: number;
  email: string;
  token: string;
}