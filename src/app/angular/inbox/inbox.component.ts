import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalRService } from '../services/signalr.service';
import { TaskService } from '../services/task.service';
import { User } from '../models/task.model';

interface Message {
  user: string;
  text: string;
  timestamp: Date;
}

@Component({
  selector: 'app-inbox',
  standalone: true,
  templateUrl: './inbox.component.html',
  imports: [CommonModule]
})
export class InboxComponent implements OnInit {
  @ViewChild('messageInput') messageInput!: ElementRef;
  messages: Message[] = [];
  currentUser: User | null = null; 
  connectionEstablished: boolean = false;

  constructor(private signalRService: SignalRService, private taskService: TaskService) {}

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        const userId = user.id; // Access the id property
        this.taskService.getUserById(userId).subscribe(
          (data: User) => {
            this.currentUser = data;
          },
          (error) => {
            console.error('Error fetching user info', error);
          }
        );
      }
    } 

    this.signalRService.getMessage().subscribe((data: { user: string, message: string }) => {
      const newMessage: Message = {
        user: this.currentUser?.fullName || 'Anonymous',
        text: data.message,
        timestamp: new Date()
      };
      this.messages.push(newMessage);
    });

    this.signalRService.isConnectionEstablished().subscribe((established: boolean) => {
      this.connectionEstablished = established;
    });
  }

  sendMessage(text: string) {
    if (text.trim() && this.connectionEstablished && this.currentUser && this.currentUser.fullName) {
      this.signalRService.sendMessage(this.currentUser.fullName, text);
      this.messageInput.nativeElement.value = '';
    } else if (!this.connectionEstablished) {
      console.error('Cannot send message. Connection is not established.');
    } else if (!this.currentUser || !this.currentUser.fullName) {
      console.error('Username is not set.');
    }
  }
}