import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  isSlideOut = true;
  constructor(private router: Router){}

  toggleSlideOut(): void {
    this.isSlideOut = !this.isSlideOut;
  }
  onDash(){
    this.router.navigate(['/budget-planner/dashboard']);
  }
  onProfile(){
    this.router.navigate(['/budget-planner/profile']);
  }
  onHistory(){
    this.router.navigate(['/budget-planner/history']);
  }
  onLogout(){
    this.router.navigate(['/budget-planner/login']);
  }
}
