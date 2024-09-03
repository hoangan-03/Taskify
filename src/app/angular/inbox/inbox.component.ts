import { Component, ViewChild, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
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
export class InboxComponent implements OnInit, OnDestroy {
  @ViewChild('messageInput') messageInput!: ElementRef;
  messages: Message[] = [];
  users: User[] = [];
  currentUser: User | null = null;
  selectedUser: User | null = null;
  connectionEstablished: boolean = false;

  constructor(private signalRService: SignalRService, private taskService: TaskService) { }

  ngOnInit(): void {
    this.initializeCurrentUserAndUsers();
    this.signalRService.isConnectionEstablished().subscribe((established: boolean) => {
      this.connectionEstablished = established;
    });
  }

  initializeCurrentUserAndUsers(): void {
    if (typeof localStorage !== 'undefined') {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        const userId = user.id;
        this.taskService.getUserById(userId).subscribe(
          (data: User) => {
            this.currentUser = data;
            this.fetchUsers(); 
          },
          (error) => {
            console.error('Error fetching user info', error);
          }
        );
      }
    }
  }

  fetchUsers(): void {
    this.taskService.getUsers().subscribe(
      (response: any) => {
        if (response && response.$values && Array.isArray(response.$values)) {
          this.users = response.$values
            .map((user: any) => ({
              userId: user.userId,
              fullName: user.fullName,
            }))
            .filter((user: User) => user.userId !== this.currentUser?.userId); // Filter out the current user
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
            timeline: message.timeline,
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
    if (!this.connectionEstablished) {
      this.signalRService.startConnection().then(() => {
        this.signalRService.getMessage().subscribe((data: { user: string, message: string, senderId: number, receiverId: number }) => {
          if (this.currentUser && this.selectedUser) {
            if ((data.senderId === this.currentUser.userId && data.receiverId === this.selectedUser.userId) ||
                (data.senderId === this.selectedUser.userId && data.receiverId === this.currentUser.userId)) {
              const newMessage: Message = {
                messageText: data.message,
                senderId: data.senderId,
                receiverId: data.receiverId,
                timeline: new Date().toISOString(),
              };
              this.messages.push(newMessage);
            }
          }
        });
        this.signalRService.isConnectionEstablished().subscribe((established: boolean) => {
          this.connectionEstablished = established;
        });
      }).catch(err => console.error('Error while starting connection: ' + err));
    }
  }

  sendMessage(text: string) {
    if (text.trim() && this.connectionEstablished && this.currentUser && this.currentUser.fullName && this.selectedUser) {
      const message = {
        messageText: text,
        senderId: this.currentUser.userId,
        receiverId: this.selectedUser.userId
      };
      this.taskService.addMessage(message).subscribe(
        (newMessage: Message) => {
          this.signalRService.sendMessage(this.currentUser!.fullName, text, this.currentUser!.userId, this.selectedUser!.userId);
          this.messageInput.nativeElement.value = '';
        },
        (error) => {
          console.error('Error sending message', error);
        }
      );
    } else if (!this.connectionEstablished) {
      console.error('Cannot send message. Connection is not established.');
    } else if (!this.currentUser || !this.currentUser.fullName) {
      console.error('Username is not set.');
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: any) {
    this.signalRService.stopConnection();
  }

  ngOnDestroy() {
    this.signalRService.stopConnection();
  }
}