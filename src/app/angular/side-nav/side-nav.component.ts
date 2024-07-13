import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {
  isSlideOut = true;
  activeRoute: string = ''; 

  constructor(private router: Router){
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  toggleSlideOut(): void {
    this.isSlideOut = !this.isSlideOut;
  }

  // Update navigation methods to set activeRoute
  onInbox(){
    this.activeRoute = '/angular/inbox';
    this.router.navigate([this.activeRoute]);
  }
  onTodo(){
    this.activeRoute = '/angular/todo';
    this.router.navigate([this.activeRoute]);
  }
  onCalendar(){
    this.activeRoute = '/angular/calendar';
    this.router.navigate([this.activeRoute]);
  }
  onTrash(){
    this.activeRoute = '/angular/trash';
    this.router.navigate([this.activeRoute]);
  }
}