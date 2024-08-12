import { TaskState } from './../models/task.model';
import { CommonModule, DatePipe } from '@angular/common';
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
  Task,
  AttachmentType,
  CommentState,
  Comment,
  Project,
  User,
} from '../models/task.model';

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
  providers: [provideNativeDateAdapter(), DatePipe],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  userList: any[] = [];
  constructor(
    private http: HttpClient,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) { }
  readonly announcer = inject(LiveAnnouncer);
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
    'Audit',
    'Administrative',
    'Marketing',
    'Sales',
    'Inventory',
    'Procurement',
    'Quality Assurance',
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
    'Inspection',
  ];
  readonly categories: string[] = [
    'Daily',
    'Development',
    'Maintenance',
    'Individual',
  ];
  trackByTag(index: number, tag: string): string {
    return tag;
  }
  trackByCategory(index: number, category: string): string {
    return `${index}-${category}`;
  }
  readonly filteredTags = computed(() => {
    const currentTag = this.currentTag().toLowerCase();
    return currentTag
      ? this.allTags.filter((tag) => tag.toLowerCase().includes(currentTag))
      : this.allTags.slice();
  });
  fileControl = new FormControl('', [Validators.required]);
  fileNameControl = new FormControl('', [Validators.required]);
  selectedFiles: { name: string; type: number }[] = [];
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
  isInfoBoxVisible: boolean = false;
  isInfoBox2Visible: boolean = false;
  isInfoBox3Visible: boolean = false;
  isInfoBox4Visible: boolean = false;
  isInfoBox5Visible: boolean = false;
  isInfoBox6Visible: boolean = false;
  AttachmentType = AttachmentType;
  CommentState = CommentState;
  TaskState = TaskState;
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  projectGroups: Project[] = [];
  Users: User[] = [];
  Comments: Comment[] = [];
  newCommentText: string = '';

  ngOnInit(): void {
    this.fetchTasks();
    this.fetchProjectGroups();
    this.fetchUsers();
    this.fetchComments();
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.update((tags) => [...tags, value]);
    }
    this.currentTag.set('');
  }
  remove(tag: string): void {
    this.tags.update((tags) => {
      const index = tags.indexOf(tag);
      if (index < 0) {
        return tags;
      }
      tags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
      return [...tags];
    });
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.update((tags) => [...tags, event.option.viewValue]);
    this.currentTag.set('');
    event.option.deselect();
  }
  controlFiles: File[] = [];

  // Update the method to handle file selection
  onFileControlled(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.controlFiles = Array.from(input.files);
    }
  }
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const attachmentType = this.getAttachmentType(file.name);
        this.selectedFiles.push({
          name: file.name,
          type: attachmentType !== undefined ? attachmentType : -1,
        });
      }
      this.fileNameControl.setValue(
        this.selectedFiles.map((file) => file.name).join(', ')
      );
    }
  }
  getAttachmentType(fileName: string): AttachmentType | undefined {
    const extension = fileName.split('.').pop()?.toUpperCase();
    if (extension) {
      return AttachmentType[extension as keyof typeof AttachmentType];
    }
    return undefined;
  }
  uploadAttachment(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<{ url: string }>(`${this.baseUrl}/api/attachments`, formData)
      .toPromise()
      .then((response) => {
        // Log the entire response to check if it contains the Url field
        console.log('Server response:', response);

        if (response && response.url) {
          return response.url;
        } else {
          console.error('No Url field in the response:', response);
          return '';
        }
      })
      .catch((error) => {
        console.error('Error uploading file:', file.name, error);
        throw error;
      });
  }
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

    try {
      const attachmentUrls = await Promise.all(
        this.controlFiles.map((file) => this.uploadAttachment(file))
      );
      const formData = {
        title: this.taskNameControl.value,
        description: this.taskDescriptionControl.value ?? '',
        createdAt: new Date().toISOString(),
        assigner: assignerId ?? 'John Wick',
        assignee: assigneeId ?? 'John Wick',
        deadline: this.deadlineControl.value
          ? new Date(this.deadlineControl.value).toISOString()
          : null,
        state: 0,
        type: this.categoryControl.value,
        userid: '1',
        projectid: projectId,
        taskTags: this.tags().map((tag) => ({
          Name: tag,
          Color: getRandomColor(),
        })),
        attachments: attachmentUrls.map((url, index) => ({
          Name: this.selectedFiles[index].name,
          FileType: this.selectedFiles[index].type,
          Url: url,
        })),
      };
      this.http.post(`${this.baseUrl}/api/tasks`, formData).subscribe({
        next: (response) => {
          this.closeModal();
          console.log('Form submitted:', formData.attachments);
          console.log('Control Files:', this.controlFiles);
          this.fetchTasks();
        },
        error: (error) => {
          console.error('Error submitting form', formData.attachments);
          console.log('Control Files:', this.controlFiles);
          console.error('Error:', error);
        },
      });
    } catch (error) {
      console.error('Error uploading attachments:', error);
    }
  }
  downloadAttachment(attachment: any) {
    this.http.get(`${this.baseUrl}/api/attachments/${attachment.attachmentId}`, { observe: 'response', responseType: 'blob' })
      .subscribe({
        next: (response) => {
          const blob = response.body;
          if (blob) {
            const fileName = attachment.name;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          } else {
            console.error('Error: Blob is null');
          }
        },
        error: (error) => {
          console.error('Error downloading attachment:', error);
        }
      });
  }
  openModal() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
    this.cdr.detectChanges();
  }
  sortTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => {
      if (a.state === 2) return -1;
      if (b.state === 2) return 1;
      if (a.state === 1) return 1;
      if (b.state === 1) return -1;
      return 0;
    });
  }
  toggleCommentState(comment: any) {
    comment.state =
      comment.state === this.CommentState.checkedd
        ? this.CommentState.uncheckedd
        : this.CommentState.checkedd;

    this.updateCommentStateInDatabase(comment);
  }
  toggleTaskState(task: any, variable: any) {
    if (variable === 0) {
      task.state =
        task.state !== this.TaskState.prioritized
          ? this.TaskState.prioritized
          : this.TaskState.inprogress;
    } else {
      task.state =
        task.state !== this.TaskState.completed
          ? this.TaskState.completed
          : this.TaskState.inprogress;
    }
    this.updateTaskState(task);
  }
  updateCommentStateInDatabase(comment: any) {
    const updateCommentDto = {
      commentId: comment.commentId,
      state: comment.state,
    };
    this.http
      .put(
        `${this.baseUrl}/api/comments/${comment.commentId}`,
        updateCommentDto
      )
      .subscribe(
        () => {
          console.log('Comment state updated');
          this.fetchComments();
        },
        (error) => {
          console.error('Error updating comment state', error);
        }
      );
  }
  updateTaskState(task: any) {
    const updateTaskDto = {
      id: task.id,
      state: task.state,
    };
    this.http
      .put(`${this.baseUrl}/api/tasks/${task.id}`, updateTaskDto)
      .subscribe(
        () => {
          console.log('Task state updated');
          this.fetchTasks();
        },
        (error) => {
          console.error('Error updating comment state', error);
        }
      );
  }
  selectTask(task: Task): void {
    this.selectedTask =
      this.selectedTask && this.selectedTask.id == task.id ? null : task;
    console.log('Selected task:', this.selectedTask);
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
  fetchComments(): void {
    this.taskService.getComments().subscribe(
      (response: any) => {
        if (response && response.$values && Array.isArray(response.$values)) {
          this.Comments = response.$values.map((comment: any) => ({
            ...comment,
          }));
          console.log('Fetched Comments', this.Comments);
          this.cdr.detectChanges();
        } else {
          console.error('Unexpected response format', response);
        }
      },
      (error) => {
        console.error('Error fetching Comments', error);
      }
    );
  }
  deleteTask(id: number): void {
    if (id) {
      this.http.delete(`${this.baseUrl}/api/tasks/${id}`).subscribe(
        () => {
          console.log('Deleted task:', id);
          if (this.selectedTask && this.selectedTask.id === id) {
            this.selectedTask = null;
          }
          this.fetchTasks();
        },
        (error) => {
          console.error('Error deleting task:', error);
        }
      );
    }
  }
  addComment() {
    if (this.selectedTask && this.newCommentText.trim()) {
      const newComment: Partial<Comment> = {
        commentText: this.newCommentText,
        state: 1,
        timeline: new Date().toISOString(),
        taskId: this.selectedTask.id,
        userId: '1',
      };
      this.http
        .post<Comment>(`${this.baseUrl}/api/comments`, newComment)
        .subscribe(
          (response) => {
            this.selectedTask?.comments.push(response);
            this.newCommentText = '';
            this.fetchComments();
          },
          (error) => {
            console.error('Error adding comment:', error);
          }
        );
    }
  }
}
