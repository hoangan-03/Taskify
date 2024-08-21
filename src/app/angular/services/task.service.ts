import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, Project, User, Event } from '../models/task.model'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:5187/';
  private taskUrl = this.baseUrl + 'api/tasks';
  private projectUrl = this.baseUrl + 'api/projects';
  private userUrl = this.baseUrl + 'api/users';
  private commentUrl = this.baseUrl + 'api/comments';
  private eventUrl = this.baseUrl + 'api/events';
  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.taskUrl);
  }
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectUrl);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }
  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentUrl);
  }
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.eventUrl);
  }
}
