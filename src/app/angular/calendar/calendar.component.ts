import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TaskState } from './../models/task.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, inject, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { FormFieldComponent } from '../../components/form-field/app-form-field.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { computed, signal } from '@angular/core';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { InfoIconComponent } from '../../info-icon/info-icon.component';
import { HttpClient } from '@angular/common/http';
import { TaskService } from '../services/task.service';
import {

  AttachmentType,
  CommentState,
  Comment,
  Project,
  User,
} from '../models/task.model';

interface Task {
  name: string;
  startTime: string;
  endTime: string;
  day: number;
  colorClass: string;
}
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
    JsonPipe,
    MatDatepickerModule,
    MatCardModule,
    MatRadioModule,
    MatInputModule,
    FormFieldComponent,
    MatChipsModule,
    MatAutocompleteModule,
    InfoIconComponent,
    DragDropModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})



export class CalendarComponent {
  tasks: Task[] = [
    { name: 'User flow design', startTime: '2:00 AM', endTime: '3:00 AM', day: 1, colorClass: 'tw-bg-red-100 tw-border-red-600' },
    { name: 'Meeting with John', startTime: '4:00 AM', endTime: '6:00 AM', day: 2, colorClass: 'tw-bg-green-100 tw-border-green-600' },
    { name: 'Meeting with Alex', startTime: '1:00 AM', endTime: '2:00 AM', day: 3, colorClass: 'tw-bg-green-100 tw-border-green-600' },
    // Add more tasks
  ];

  getRowSpan(startTime: string, endTime: string): number {
    const startHour = this.convertToHour(startTime);
    const endHour = this.convertToHour(endTime);
    return (endHour - startHour) / 1; // Each slot is 1 hour
  }

  convertToHour(time: string): number {
    const [hour, period] = time.split(' ');
    let [h, m] = hour.split(':');
    let hourIn24 = +h + (period === 'PM' && +h !== 12 ? 12 : 0);
    if (period === 'AM' && +h === 12) hourIn24 = 0; // Special case for 12 AM
    return hourIn24 + +m / 60;
  } days = [
    { day: 1, name: 'Mon' },
    { day: 2, name: 'Tue' },
    { day: 3, name: 'Wed' },
    { day: 4, name: 'Thu' },
    { day: 5, name: 'Fri' },
    { day: 6, name: 'Sat' },
    { day: 7, name: 'Sun' }
  ];

  hours: string[] = [
    '12:00 AM',
    '1:00 AM',
    '2:00 AM',
    '3:00 AM',
    '4:00 AM',
    '5:00 AM',
    '6:00 AM',
    '7:00 AM',
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
    '7:00 PM',
    '8:00 PM',
    '9:00 PM',
    '10:00 PM',
    '11:00 PM',
  ];

  ngOnInit(): void {
    // Initialization logic here
  }
}
