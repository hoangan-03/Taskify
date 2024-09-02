import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalRService } from '../services/signalr.service';
import { TaskService } from '../services/task.service';
import { User, Message } from '../models/task.model';

@Component({
  selector: 'app-inbox',
  standalone: true,
  templateUrl: './inbox.component.html',
  imports: [CommonModule]
})
export class InboxComponent implements OnInit {
  @ViewChild('messageInput') messageInput!: ElementRef;
  messages: Message[] = [];
  users: User[] = [];
  currentUser: User | null = null;
  selectedUser: User | null = null;
  connectionEstablished: boolean = false;

  constructor(private signalRService: SignalRService, private taskService: TaskService) { }
  fetchUsers(): void {
    this.taskService.getUsers().subscribe(
      (response: any) => {
        if (response && response.$values && Array.isArray(response.$values)) {
          this.users = response.$values.map((user: any) => ({
            userId: user.userId,
            fullName: user.fullName,
          }));
        } else {
          console.error('Unexpected response format', response);
        }
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
  fetchMessages(userId: number): void {
    this.taskService.getMessagesBetweenUsers(this.currentUser!.userId, userId).subscribe(
      (response: any) => {
        if (response && response.$values && Array.isArray(response.$values)) {
          this.messages = response.$values.map((message: any) => ({
            messageId: message.messageId,
            messageText: message.messageText,
            senderId: message.senderId,
            receiverId: message.receiverId,
            timeline: new Date(message.timeline),
          }));
        } else {
          console.error('Unexpected response format', response);
        }
      },
      (error) => {
        console.error('Error fetching messages', error);
      }
    );
  }
  selectUser(user: User) {
    this.selectedUser = user;
    this.fetchMessages(user.userId);
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
  ngOnInit() {
    this.fetchUsers();
    if (typeof localStorage !== 'undefined') {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        const userId = user.id; 
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
        messageText: data.message,
        senderId: this.currentUser!.userId, 
        receiverId: this.selectedUser!.userId, 
        timeLine: new Date().toISOString(), 
      };
      this.messages.push(newMessage);
    });

    this.signalRService.isConnectionEstablished().subscribe((established: boolean) => {
      this.connectionEstablished = established;
    });
  }

  ngOnDestroy() {
    this.signalRService.stopConnection();
  }
}