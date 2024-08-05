import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { randomInt } from 'crypto';
import { lastValueFrom } from 'rxjs';
import { TaskService } from '../services/task.service'; // Adjust the import path as needed
import {
  Task,
  AttachmentType,
  CommentState,
  Comment,
} from '../models/task.model'; // Adjust the import path as needed

// interface Comment {
//   commenter: string;
//   state: CommentState;
//   comment: string;
//   timeline: string;
// }
// interface Attachment {
//   name: string;
//   type: AttachmentType;
//   date: string;
// }
interface Project {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  userList: any[] = [];
  constructor(
    private http: HttpClient,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentTag = model('');
  readonly tags = signal(['Daily']);
  readonly allTags: string[] = [
    'Daily',
    'Weekly',
    'Monthly',
    'Quarterly',
    'Annual',
    'Urgent',
    'High Priority',
    'Medium Priority',
    'Low Priority',
    'Routine',
    'Ad-hoc',
    'Maintenance',
    'Project-Based',
    'Critical',
    'Optional',
    'Mandatory',
    'Short-term',
    'Long-term',
    'Recurrent',
    'One-time',
    'Follow-up',
    'Scheduled',
    'Unscheduled',
    'Team',
    'Individual',
    'Client-related',
    'Internal',
    'Training',
    'Development',
    'Research',
    'Testing',
    'Deployment',
    'Review',
    'Approval',
    'Documentation',
    'Reporting',
    'Planning',
    'Evaluation',
    'Support',
    'Operational',
    'Strategic',
    'Emergency',
    'Preventive',
    'Corrective',
    'Improvement',
    'Monitoring',
    'Supervisory',
    'Logistics',
    'Compliance',
    'Audit',
    'Financial',
    'Administrative',
    'Marketing',
    'Sales',
    'Customer Service',
    'Inventory',
    'Procurement',
    'Quality Assurance',
    'Risk Management',
    'Change Management',
    'Human Resources',
    'IT',
    'Legal',
    'Health and Safety',
    'Environmental',
    'Networking',
    'Configuration',
    'Security',
    'Backup',
    'Recovery',
    'Installation',
    'Upgrade',
    'Migration',
    'Integration',
    'Troubleshooting',
    'Optimization',
    'Calibration',
    'Inspection',
    'Calibration',
    'Outreach',
    'Public Relations',
    'Event Planning',
  ];
  trackByTag(index: number, fruit: string): string {
    return fruit;
  }
  readonly filteredTags = computed(() => {
    const currentFruit = this.currentTag().toLowerCase();
    return currentFruit
      ? this.allTags.filter((fruit) =>
          fruit.toLowerCase().includes(currentFruit)
        )
      : this.allTags.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.update((tags) => [...tags, value]);
    }
    this.currentTag.set('');
  }
  remove(fruit: string): void {
    this.tags.update((tags) => {
      const index = tags.indexOf(fruit);
      if (index < 0) {
        return tags;
      }

      tags.splice(index, 1);
      this.announcer.announce(`Removed ${fruit}`);
      return [...tags];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.update((tags) => [...tags, event.option.viewValue]);
    this.currentTag.set('');
    event.option.deselect();
  }

  trackByCategory(index: number, cate: string): string {
    return `${index}-${cate}`;
  }

  readonly categories: string[] = [
    'Daily',
    'Development',
    'Maintenance',
    'Individual',
  ];

  taskNameControl = new FormControl('', [Validators.required]);
  taskDescriptionControl = new FormControl('', [Validators.required]);
  assignerControl = new FormControl('', [Validators.required]);
  deadlineControl = new FormControl('', [Validators.required]);
  projectControl = new FormControl('');
  categoryControl = new FormControl('', [Validators.required]);
  tagControl = new FormControl('', [Validators.required]);
  showModal: boolean = false;
  baseUrl = 'http://localhost:5187';

  async submitForm() {
    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    const formData = {
      title: this.taskNameControl.value,
      description: this.taskDescriptionControl.value,
      createdAt: new Date().toISOString(), // Convert to ISO 8601 string
      assigner: this.assignerControl.value,
      deadline: this.deadlineControl.value
        ? new Date(this.deadlineControl.value).toISOString() // Convert to ISO 8601 string
        : null,
      type: this.categoryControl.value,
      userid: '1',
      projectid: this.projectControl.value === 'coding' ? '1' : '12',
      taskTags: this.tags().map((tag) => ({
        Name: tag,
        Color: getRandomColor(),
      })),
    };
    try {
      const response = await lastValueFrom(
        this.http.post(`${this.baseUrl}/api/tasks`, formData)
      );
      console.log('Form submitted successfully', response);
      console.log('Formdataa', formData);
      this.showModal = false;
    } catch (error) {
      console.error('Error submitting form', error);
      console.log('Formdataa', formData);
    }
  }
  openModal() {
    this.showModal = true;
  }
  handleClose() {
    this.showModal = false;
  }

  isInfoBoxVisible: boolean = false;
  isInfoBox2Visible: boolean = false;
  isInfoBox3Visible: boolean = false;
  isInfoBox4Visible: boolean = false;
  isInfoBox5Visible: boolean = false;
  isInfoBox6Visible: boolean = false;
  AttachmentType = AttachmentType;
  CommentState = CommentState;
  taskControl = new FormControl();
  taskGroups = [
    {
      name: 'FPT Software',
      tasks: [
        { value: 'coding', viewValue: 'Coding' },
        { value: 'requirement', viewValue: 'Requirement' },
        { value: 'debugging', viewValue: 'Debugging' },
      ],
    },
    {
      name: 'Trip Plan Vung Tau',
      tasks: [
        { value: 'planning', viewValue: 'Planning' },
        { value: 'settingup', viewValue: 'Setting up' },
      ],
    },
  ];
  tasks: Task[] = [];
  selectedTask: Task | null = null;

  selectTask(task: Task): void {
    this.selectedTask =
      this.selectedTask && this.selectedTask.id == task.id ? null : task;
    console.log('Selected task:', this.selectedTask);
  }
  ngOnInit(): void {
    this.fetchTasks();
    this.selectedTask = null;
    console.log('selected:', this.selectedTask);
  }

  fetchTasks(): void {
    this.taskService.getTasks().subscribe(
      (response: any) => {
        if (response && response.$values) {
          this.tasks = response.$values.map((task: any) => {
            return {
              ...task,
              taskTags: task.taskTags.$values,
              comments: task.comments.$values,
              attachments: task.attachments.$values,
            };
          });
          console.log('Fetched tasks:', this.tasks);
          this.cdr.detectChanges(); // Trigger change detection
        } else {
          console.error('Unexpected response format', response);
        }
      },
      (error) => {
        console.error('Error fetching tasks', error);
      }
    );
  }

  // tasks: Task[] = [
  //   {
  //     id: 1,
  //     title: 'Code Review',
  //     project: 'Project FPT Software',
  //     description:
  //       'Contrary to popular belief, Lorem Ipsum is not simply random text.It has roots in a piece of classical Latin literature from 45 BC,',
  //     created_time: '14:00 2023-04-01',
  //     due_time: '14:00 2023-08-01',
  //     assigner: 'John Doe',
  //     type: 'Daily Task',
  //     tag: { name: 'Dev', color: '#ff0000' },
  //     attachments: [
  //       { name: 'file1.pdf', type: AttachmentType.PDF, date: '2024-01-06' },
  //       { name: 'file2.docx', type: AttachmentType.DOCX, date: '2024-01-06' },
  //     ],
  //     comments: [
  //       {
  //         commenter: 'John Appricot',
  //         state: CommentState.checked,
  //         comment:
  //           'Duis venenatis nulla sed vehicula iaculis. Sed feugiat nulla sapien, id gravida metus ultricies eget. Morbi eget tortor sem. Phasellus eu turpis nec est rutrum feugiat in sed erat. Praesent.',
  //         timeline: '14:07:00 20/11/2023',
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     title: 'Meeting with DR. Stranger',
  //     project: 'Project FPT Software',
  //     description:
  //       'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, ',
  //     created_time: '14:00 2023-07-01',
  //     due_time: '14:00 2023-12-01',
  //     assigner: 'John Aleted Scott',
  //     type: 'Important Task',
  //     tag: { name: 'Meeting', color: '#800080' },
  //     attachments: [
  //       { name: 'file3.pdf', type: AttachmentType.PDF, date: '2024-01-06' },
  //       { name: 'file32.pptx', type: AttachmentType.PPTX, date: '2024-01-06' },
  //       { name: 'file4.xlsx', type: AttachmentType.XLSX, date: '2024-01-06' },
  //     ],
  //     comments: [
  //       {
  //         commenter: 'Steven Atlantis Johnson',
  //         state: CommentState.unchecked,
  //         comment:
  //           'Pellentesque vitae nibh tortor. Maecenas vitae egestas est. Fusce pretium iaculis ante, ultricies ornare velit cursus non. Nam tempor lobortis dapibus. Cras tristique sapien ut est bibendum vulputate. Sed eu',
  //         timeline: '17:07:00 30/11/2023',
  //       },
  //     ],
  //   },
  // ];
}
