import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-info-icon',
  standalone: true, // Make it standalone
  templateUrl: './info-icon.component.html',
  styleUrls: ['./info-icon.component.css'],
  imports: [CommonModule]
})
export class InfoIconComponent {
  @Input() infoText: string = '';
  @Input() title: string = '';
  @Input() type: string = 'Required';
  isInfoBoxVisible: boolean = false;
}