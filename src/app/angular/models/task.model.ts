export enum AttachmentType {
  PDF,
  DOCX,
  XLSX,
  PPTX,
  PNG,
  JPG,
  GIF,
  DOC,
  XLS,
  PPT,
  XML,
  MD,
}

export enum CommentState {
  checked,
  unchecked,
}

export interface User {
  userId: string;
  fullName?: string;
  email: string;
  password: string;
  createAt: string; // ISO 8601 string
  tasks: Task[];
  comments: Comment[];
}

export interface Tag {
  tagId: number;
  tagName: string;
  color: string;
  taskTags: TaskTag[];
}

export interface Comment {
  commentId: number;
  state: CommentState;
  commentText: string;
  timeline: string; // ISO 8601 string
  userId?: string;
  user?: User;
  taskId?: number;
  task?: Task;
}

export interface Attachment {
  attachmentId: number;
  name: string;
  type: AttachmentType;
  taskId?: number;
  task?: Task;
}

export interface Project {
  projectId: string;
  title: string;
  description?: string;
  createAt: string; // ISO 8601 string
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  createdAt: string; // ISO 8601 string
  deadline: string; // ISO 8601 string
  type: string[];
  projectId?: string;
  project?: Project;
  userId?: string;
  user?: User;
  taskTags: TaskTag[];
  comments: Comment[];
  attachments: Attachment[];
  projectName: string;
}

export interface TaskTag {
  taskId: number;
  task?: Task;
  tagId: number;
  tag?: Tag;
  name?: string;
  color?: string;
}