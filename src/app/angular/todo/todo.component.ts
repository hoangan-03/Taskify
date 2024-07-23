import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JsonPipe } from '@angular/common';
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
interface Tag {
  name: string;
  color: string;
}
enum AttachmentType {
  PDF = 'PDF',
  DOCX = 'DOCX',
  XLSX = 'XLSX',
  PPTX = 'PPTX',
  PNG = 'PNG',
  JPG = 'JPG',
  GIF = 'GIF',
  DOC = 'DOC',
  XLS = 'XLS',
  PPT = 'PPT',
  XML = 'XML',
  MD = 'MD',
}
enum CommentState {
  checked = 'checked',
  unchecked = 'unchecked',
}
interface Comment {
  commenter: string;
  state: CommentState;
  comment: string;
  timeline: string;
}
interface Attachment {
  name: string;
  type: AttachmentType;
  date: string;
}
interface Task {
  id: number;
  title: string;
  project: string;
  description: string;
  created_time: string; //  ISO format
  due_time: string; // 'HH:mm' format
  assigner: string;
  type: string;
  tag: Tag;
  attachments: Attachment[];
  comments: Comment[];
}

interface Project {
  value: string;
  viewValue: string;
}

interface projectGroup {
  disabled?: boolean;
  name: string;
  project: Project[];
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
  constructor(private http: HttpClient) {}


  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentCategories = model('');
  readonly categories = signal(['Daily']);
  readonly allCate: string[] = [
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

  readonly filteredCates = computed(() => {
    const currentCategory = this.currentCategories().toLowerCase();
    return currentCategory
      ? this.allCate.filter((fruit) =>
          fruit.toLowerCase().includes(currentCategory)
        )
      : this.allCate.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.categories.update((cates) => [...cates, value]);
    }
    this.currentCategories.set('');
  }

  remove(category: string): void {
    this.categories.update((cates) => {
      const index = cates.indexOf(category);
      if (index < 0) {
        return cates;
      }

      cates.splice(index, 1);
      this.announcer.announce(`Removed ${category}`);
      return [...cates];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.update((cates) => [...cates, event.option.viewValue]);
    this.currentCategories.set('');
    event.option.deselect();
  }
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');
  readonly disabled = model(false);
  private readonly _formBuilder = inject(FormBuilder);

  readonly toppings = this._formBuilder.group({
    pepperoni: false,
    extracheese: false,
    mushroom: false,
  });
  taskNameControl = new FormControl('', [Validators.required]);
  taskDescriptionControl = new FormControl('', [Validators.required]);
  assignerControl = new FormControl('', [Validators.required]);
  deadlineControl = new FormControl('', [Validators.required]);
  projectControl = new FormControl('');

  showModal: boolean = false;
  baseUrl = "http://localhost:5187";

  async submitForm() {
    const formData = {
      id: 6969,
      title: this.taskNameControl.value,
      description: this.taskDescriptionControl.value,
      createdAt: new Date(), 
      assigner: this.assignerControl.value,
      deadline: this.deadlineControl.value ? new Date(this.deadlineControl.value).toISOString() : null,
      type: this.currentCategories,
      userid: 1,
      projectid: this.projectControl.value === "coding" ? 1 : 2,
    };

    try {
      const response = await lastValueFrom(this.http.post(`${this.baseUrl}/api/tasks`, formData));
      console.log('Form submitted successfully', response);
      this.showModal = false;
    } catch (error) {
      console.error('Error submitting form', error);
    }
  }
  openModal() {
    this.showModal = true;
  }

  isInfoBoxVisible: boolean = false;
  isInfoBox2Visible: boolean = false;
  isInfoBox3Visible: boolean = false;
  isInfoBox4Visible: boolean = false;
  isInfoBox5Visible: boolean = false;
  isInfoBox6Visible: boolean = false;
  AttachmentType = AttachmentType;
  CommentState = CommentState;

  projectGroups: projectGroup[] = [
    {
      name: 'Grass',
      project: [
        { value: 'bulbasaur-0', viewValue: 'Bulbasaur' },
        { value: 'oddish-1', viewValue: 'Oddish' },
        { value: 'bellsprout-2', viewValue: 'Bellsprout' },
      ],
    },
    {
      name: 'Water',
      project: [
        { value: 'squirtle-3', viewValue: 'Squirtle' },
        { value: 'psyduck-4', viewValue: 'Psyduck' },
        { value: 'horsea-5', viewValue: 'Horsea' },
      ],
    },
    {
      name: 'Fire',
      disabled: true,
      project: [
        { value: 'charmander-6', viewValue: 'Charmander' },
        { value: 'vulpix-7', viewValue: 'Vulpix' },
        { value: 'flareon-8', viewValue: 'Flareon' },
      ],
    },
    {
      name: 'Psychic',
      project: [
        { value: 'mew-9', viewValue: 'Mew' },
        { value: 'mewtwo-10', viewValue: 'Mewtwo' },
      ],
    },
  ];
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
  tasks: Task[] = [
    {
      id: 1,
      title: 'Code Review',
      project: 'Project FPT Software',
      description:
        'Contrary to popular belief, Lorem Ipsum is not simply random text.It has roots in a piece of classical Latin literature from 45 BC,',
      created_time: '14:00 2023-04-01',
      due_time: '14:00 2023-08-01',
      assigner: 'John Doe',
      type: 'Daily Task',
      tag: { name: 'Dev', color: '#ff0000' },
      attachments: [
        { name: 'file1.pdf', type: AttachmentType.PDF, date: '2024-01-06' },
        { name: 'file2.docx', type: AttachmentType.DOCX, date: '2024-01-06' },
      ],
      comments: [
        {
          commenter: 'John Appricot',
          state: CommentState.checked,
          comment:
            'Duis venenatis nulla sed vehicula iaculis. Sed feugiat nulla sapien, id gravida metus ultricies eget. Morbi eget tortor sem. Phasellus eu turpis nec est rutrum feugiat in sed erat. Praesent.',
          timeline: '14:07:00 20/11/2023',
        },
      ],
    },
    {
      id: 2,
      title: 'Meeting with DR. Stranger',
      project: 'Project FPT Software',
      description:
        'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, ',
      created_time: '14:00 2023-07-01',
      due_time: '14:00 2023-12-01',
      assigner: 'John Aleted Scott',
      type: 'Important Task',
      tag: { name: 'Meeting', color: '#800080' },
      attachments: [
        { name: 'file3.pdf', type: AttachmentType.PDF, date: '2024-01-06' },
        { name: 'file32.pptx', type: AttachmentType.PPTX, date: '2024-01-06' },
        { name: 'file4.xlsx', type: AttachmentType.XLSX, date: '2024-01-06' },
      ],
      comments: [
        {
          commenter: 'Steven Atlantis Johnson',
          state: CommentState.unchecked,
          comment:
            'Pellentesque vitae nibh tortor. Maecenas vitae egestas est. Fusce pretium iaculis ante, ultricies ornare velit cursus non. Nam tempor lobortis dapibus. Cras tristique sapien ut est bibendum vulputate. Sed eu',
          timeline: '17:07:00 30/11/2023',
        },
      ],
    },
  ];

  selectedTask: any = null;

  selectTask(task: Task): void {
    this.selectedTask =
      this.selectedTask && this.selectedTask.id == task.id ? null : task;
  }
}
