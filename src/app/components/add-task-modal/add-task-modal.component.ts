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
import { MatAutocomplete } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@Component({
  selector: 'app-add-task-modal',
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
    InfoIconComponent,
    MatAutocomplete,
    FormsModule,
    MatAutocompleteModule
    
  ],
  templateUrl: './add-task-modal.component.html',
})
export class AddTaskModalComponent {
  @Input() showModal: boolean = false;
  @Input() taskNameControl!: FormControl;
  @Input() taskDescriptionControl!: FormControl;
  @Input() assignerControl!: FormControl;
  @Input() assigneeControl!: FormControl;
  @Input() projectControl!: FormControl;
  @Input() deadlineControl!: FormControl;
  @Input() categoryControl!: FormControl;
  @Input() fileControl!: FormControl;
  @Input() selectedFiles: { name: string; type: number; }[] = [];
  @Input() projectGroups: any[] = [];
  @Input() Users: any[] = [];
  @Input() categories: string[] = [];
  @Input() tags: string[] = [];
  @Input() currentTag: string = '';
  @Input() separatorKeysCodes: number[] = [];
  @Input() filteredTags: string[] = [];

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();
  @Output() onFileSelected = new EventEmitter<Event>();
  @Output() onFileControlled = new EventEmitter<Event>();
  @Output() remove = new EventEmitter<string>();
  @Output() add = new EventEmitter<any>();
  @Output() selected = new EventEmitter<any>();
  trackByCategory(index: number, category: string): string {
    return category;
  }

  trackByTag(index: number, tag: string): string {
    return tag;
  }
}