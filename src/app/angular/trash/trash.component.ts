import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.scss'
})
export class TrashComponent {
  isSlideOut = true;
  constructor(private router: Router){}

  toggleSlideOut(): void {
    this.isSlideOut = !this.isSlideOut;
  }
  onInbox(){
    this.router.navigate(['/angular/inbox']);
  }
  onTodo(){
    this.router.navigate(['/angular/todo']);
  }
  onCalendar(){
    this.router.navigate(['/angular/calendar']);
  }
  onTrash(){
    this.router.navigate(['/angular/trash']);
  }
}
