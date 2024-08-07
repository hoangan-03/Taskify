import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
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
  Project,
  User,
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
  assigneeControl = new FormControl('', [Validators.required]);
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
    const selectedProjectName = this.projectControl.value;
    const selectedProject = this.projectGroups.find(
      (project) => project.title === selectedProjectName
    );
    const projectId = selectedProject ? selectedProject.projectId : null;

    const selectedAssignerName = this.assignerControl.value;
    const selectedAssigner = this.Users.find(
      (user) => user.fullName === selectedAssignerName
    );
    const assignerId = selectedAssigner ? selectedAssigner.userId : null;

    const selectedAssigneeName = this.assigneeControl.value;
    const selectedAssignee = this.Users.find(
      (user) => user.fullName === selectedAssigneeName
    );
    const assigneeId = selectedAssignee ? selectedAssignee.userId : null;
    const formData = {
      title: this.taskNameControl.value,
      description: this.taskDescriptionControl.value ?? '',
      createdAt: new Date().toISOString(),
      assigner: assignerId ?? 'John Wick',
      assignee: assigneeId ?? 'John Wick',
      deadline: this.deadlineControl.value
        ? new Date(this.deadlineControl.value).toISOString()
        : null,
      type: this.categoryControl.value,
      userid: '1',
      projectid: projectId,
      taskTags: this.tags().map((tag) => ({
        Name: tag,
        Color: getRandomColor(),
      })),
    };
    try {
      const response = await lastValueFrom(
        this.http.post(`${this.baseUrl}/api/tasks`, formData)
      );
      this.closeModal();
      console.log('Form submitted:', formData);
      console.log('Sselecteddd anm', selectedProjectName);
    } catch (error) {
      console.error('Error submitting form', formData);
    }
  }
  openModal() {
    this.showModal = true;
  }
  closeModal() {
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
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  projectGroups: Project[] = [];
  Users: User[] = [];

  selectTask(task: Task): void {
    this.selectedTask =
      this.selectedTask && this.selectedTask.id == task.id ? null : task;
    console.log('Selected task:', this.selectedTask);
  }
  ngOnInit(): void {
    this.fetchTasks();
    this.fetchProjectGroups();
    this.fetchUsers();
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
          this.cdr.detectChanges();
        } else {
          console.error('Unexpected response format', response);
        }
      },
      (error) => {
        console.error('Error fetching tasks', error);
      }
    );
  }

  fetchProjectGroups(): void {
    this.taskService.getProjects().subscribe(
      (response: any) => {
        if (response && response.$values && Array.isArray(response.$values)) {
          this.projectGroups = response.$values.map((project: any) => ({
            projectId: project.projectId,
            title: project.title,
          }));
          console.log('Fetched project groups:', this.projectGroups);
          this.cdr.detectChanges();
        } else {
          console.error('Unexpected response format', response);
        }
      },
      (error) => {
        console.error('Error fetching project groups', error);
      }
    );
  }
  fetchUsers(): void {
    this.taskService.getUsers().subscribe(
      (response: any) => {
        if (response && response.$values && Array.isArray(response.$values)) {
          this.Users = response.$values.map((user: any) => ({
            userId: user.userId,
            fullName: user.fullName,
          }));
          console.log('Fetched users', this.Users);
          this.cdr.detectChanges();
        } else {
          console.error('Unexpected response format', response);
        }
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
}
