import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { Task, User } from '../../../app/angular/models/task.model';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../angular/services/task.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  templateUrl: './task-item.component.html',
  imports: [
    CommonModule
  ],
})
export class TaskItemComponent implements OnInit {
  @Input() task!: Task;
  @Input() currentUserId!: number;
  @Input() selectedTask!: Task;
  @Output() selectTask = new EventEmitter<Task>();
  @Output() toggleTaskState = new EventEmitter<{ task: Task, state: number }>();
  @Output() openUpdateModal = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();

  Users: User[] = [];

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchUsers();
    console.log("thisId",this.currentUserId);
  }
  
  fetchUsers(): void {
    this.taskService.getUsers().subscribe(
      (response: any) => {
        if (response && response.$values && Array.isArray(response.$values)) {
          this.Users = response.$values.map((user: any) => ({
            userId: user.userId,
            fullName: user.fullName,
          }));
          this.cdr.detectChanges();
        } else {
          console.error('Unexpected response format', response);
        }
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  getAssigneeNameById(id: number): string {
    const user = this.Users.find(user => user.userId === id);
    console.log("The user", user?.fullName);
    return user ? user.fullName : 'Loading...';
  }

  addOneDay(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }
}