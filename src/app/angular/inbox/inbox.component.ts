import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  
})
export class InboxComponent implements AfterViewInit {
  baseUrl = 'http://localhost:5187';
  private socket: any;

  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('sendButton') sendButton!: ElementRef;
  @ViewChild('messages') messages!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.socket = io(this.baseUrl);

    this.renderer.listen(this.sendButton.nativeElement, 'click', () => {
      const message = this.messageInput.nativeElement.value;
      if (message.trim()) {
        this.socket.emit('chat message', message);
        this.messageInput.nativeElement.value = '';
      }
    });

    this.socket.on('chat message', (msg: string) => {
      const messageElement = this.renderer.createElement('div');
      const text = this.renderer.createText(msg);
      this.renderer.appendChild(messageElement, text);
      this.renderer.appendChild(this.messages.nativeElement, messageElement);
      this.messages.nativeElement.scrollTop = this.messages.nativeElement.scrollHeight;
    });
  }
}