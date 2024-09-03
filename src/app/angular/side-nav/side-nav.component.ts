import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TaskService } from './../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  isSlideOut = true;
  activeRoute: string = '';
  user: any;
  isLoggedIn: boolean = false;

  constructor(public router: Router, private taskService: TaskService) {
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        const userId = user.id; // Access the id property
        this.taskService.getUserById(userId).subscribe(
          (data) => {
            this.user = data;
            this.isLoggedIn = true;
          },
          (error) => {
            console.error('Error fetching user info', error);
          }
        );
      }
    } 
  }

  toggleSlideOut(): void {
    this.isSlideOut = !this.isSlideOut;
  }

  onInbox() {
    this.activeRoute = '/angular/inbox';
    this.router.navigate([this.activeRoute]);
  }

  onTodo() {
    this.activeRoute = '/angular/todo';
    this.router.navigate([this.activeRoute]);
  }

  onCalendar() {
    this.activeRoute = '/angular/calendar';
    this.router.navigate([this.activeRoute]);
  }
  onDownloaded() {
    this.activeRoute = '/angular/downloaded';
    this.router.navigate([this.activeRoute]);
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    this.router.navigate(['/auth']);
    this.isLoggedIn = false;
  }
}