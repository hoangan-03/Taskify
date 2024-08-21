import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
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
  Event,
  Color,
} from '../models/task.model';

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
  constructor(
    private http: HttpClient,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
  ) { }
  events: Event[] = [];
  weeks: { start: Date, end: Date }[] = [];
  currentWeekIndex: number = 0;
  fetchEvents(): void {
    this.taskService.getEvents().subscribe(
      (response: any) => {
        if (response && response.$values && Array.isArray(response.$values)) {
          this.events = response.$values.map((event: any) => ({
            ...event,
          }));
          console.log('Events', this.events);
          this.cdr.detectChanges();
        } else {
          console.error('Unexpected response format', response);
        }
      },
      (error) => {
        console.error('Error fetching Events', error);
      }
    );
  }

  getRowSpan(task: any): number {
    const startHour = this.convertTo24HourFormat(task.startTime);
    const endHour = this.convertTo24HourFormat(task.endTime);
    return endHour - startHour;
  }

  convertTo24HourFormat(time: string): number {
    let [hours, minutes] = time.split(':').map(Number);
    return hours;
  }

  generateWeeks(): void {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');
    let current = startDate;
    while (current <= endDate) {
      const weekStart = new Date(current);
      const weekEnd = new Date(current);
      weekEnd.setDate(weekEnd.getDate() + 6);
      this.weeks.push({ start: weekStart, end: weekEnd });
      current.setDate(current.getDate() + 7);
    }
  }

  previousWeek(): void {
    if (this.currentWeekIndex > 0) {
      this.currentWeekIndex--;
      this.saveCurrentWeekIndex();
    }
  }

  nextWeek(): void {
    if (this.currentWeekIndex < this.weeks.length - 1) {
      this.currentWeekIndex++;
      this.saveCurrentWeekIndex();
    }
  }

  isDateInCurrentWeek(date: Date): boolean {
    const currentWeek = this.weeks[this.currentWeekIndex];
    return date >= currentWeek.start && date <= currentWeek.end;
  }

  getDateObject(dateString: string): Date {
    return new Date(dateString);
  }

  getDayNameFromDate(date: Date): string {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysOfWeek[date.getDay()];
  }
  getColorClasses(color: Color | undefined): string {
    if (color === undefined) {
      return 'tw-border-gray-600 tw-bg-gray-100';
    } else {
      return `tw-border-${Color[color]}-600 tw-bg-${Color[color]}-100`;
    }
  }
  days = [
    { day: 1, name: 'Mon' },
    { day: 2, name: 'Tue' },
    { day: 3, name: 'Wed' },
    { day: 4, name: 'Thu' },
    { day: 5, name: 'Fri' },
    { day: 6, name: 'Sat' },
    { day: 7, name: 'Sun' }
  ];

  hours: string[] = [
    '00:00:00',
    '01:00:00',
    '02:00:00',
    '03:00:00',
    '04:00:00',
    '05:00:00',
    '06:00:00',
    '07:00:00',
    '08:00:00',
    '09:00:00',
    '10:00:00',
    '11:00:00',
    '12:00:00',
    '13:00:00',
    '14:00:00',
    '15:00:00',
    '16:00:00',
    '17:00:00',
    '18:00:00',
    '19:00:00',
    '20:00:00',
    '21:00:00',
    '22:00:00',
    '23:00:00',
  ];
  saveCurrentWeekIndex(): void {
    localStorage.setItem('currentWeekIndex', this.currentWeekIndex.toString());
  }

  loadCurrentWeekIndex(): void {
    const storedIndex = localStorage.getItem('currentWeekIndex');
    if (storedIndex !== null) {
      this.currentWeekIndex = parseInt(storedIndex, 10);
    }
  }

  ngOnInit(): void {
    this.fetchEvents();
    this.generateWeeks();
    this.loadCurrentWeekIndex();
  }
}
