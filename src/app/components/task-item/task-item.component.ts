import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../app/angular/models/task.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-task-item',
  standalone: true,
  templateUrl: './task-item.component.html',
  imports: [
    CommonModule
  ],
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() selectedTask!: Task;
  @Output() selectTask = new EventEmitter<Task>();
  @Output() toggleTaskState = new EventEmitter<{ task: Task, state: number }>();
  @Output() openUpdateModal = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();

  addOneDay(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }
}