import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private baseUrl = 'http://localhost:5187';
  private apiUrl = this.baseUrl + '/chathub';
  private hubConnection: signalR.HubConnection;
  private messageReceived = new Subject<{ user: string, message: string }>();
  private connectionEstablished = new Subject<boolean>();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl)
      .build();

    this.hubConnection.on('ReceiveMessage', (user: string, message: string) => {
      this.messageReceived.next({ user, message });
    });

    this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
        this.connectionEstablished.next(true);
      })
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  sendMessage(user: string, message: string) {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection.invoke('SendMessage', user, message).catch(err => console.error(err));
    } else {
      console.error('Cannot send message. Connection is not established.');
    }
  }

  getMessage(): Observable<{ user: string, message: string }> {
    return this.messageReceived.asObservable();
  }

  isConnectionEstablished(): Observable<boolean> {
    return this.connectionEstablished.asObservable();
  }
}