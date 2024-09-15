import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { InfoIconComponent } from '../info-icon/info-icon.component';
@Component({
  selector: 'app-update-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatChipsModule,
    MatIconModule,
    InfoIconComponent
  ],
  templateUrl: './update-task-modal.component.html',
})
export class UpdateTaskModalComponent {
  @Input() showUpdateModal: boolean = false;
  @Input() updateTaskNameControl!: FormControl;
  @Input() updateTaskDescriptionControl!: FormControl;
  @Input() updateProjectControl!: FormControl;
  @Input() assignerUpdateControl!: FormControl;
  @Input() assigneeUpdateControl!: FormControl;
  @Input() updateDeadlineControl!: FormControl;
  @Input() updateCategoryControl!: FormControl;
  @Input() updateFileControl!: FormControl;
  @Input() selectedUpdateFiles: { name: string; type: number; }[] = [];
  @Input() projectGroups: any[] = [];
  @Input() Users: any[] = [];
  @Input() categories: string[] = [];

  @Output() closeUpdateModal = new EventEmitter<void>();
  @Output() submitUpdateForm = new EventEmitter<void>();
  @Output() onUpdateFileSelected = new EventEmitter<Event>();
  @Output() onUpdateFileControlled = new EventEmitter<Event>();

  trackByCategory(index: number, category: string): string {
    return category;
  }
}