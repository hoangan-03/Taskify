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
  UNKNOWN,
}

export enum CommentState {
  checkedd,
  uncheckedd,
}
export enum TaskState {
  inprogress,
  completed,
  prioritized,
}
export enum Color {
  blue,
  green,
  red,
  purple,
  yellow,
  gray,
  pink,
}

export interface User {
  userId: number;
  fullName: string;
  email?: string;
  password?: string;
  createAt?: string;
  tasks?: Task[];
  comments?: Comment[];
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
  timeline: string;
  userId?: string;
  user?: User;
  userName?: string;
  taskId?: number;
  task?: Task;
}

export interface Attachment {
  attachmentId: number;
  name: string;
  fileType: AttachmentType;
  uploadedAt: string;
  taskId?: number;
  url: string;
  task?: Task;
}

export interface Project {
  projectId: number;
  title: string;
  description?: string;
  createAt: string;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  deadline: string;
  state: TaskState;
  type: string[];
  projectId?: string;
  project?: Project;
  userId?: string;
  user?: User;
  taskTags: TaskTag[];
  comments: Comment[];
  attachments: Attachment[];
  projectName: string;
  order: number;
}

export interface TaskTag {
  name?: string;
  color?: string;
}

export interface Event {
  eventId: number;
  eventName?: string;
  description?: string;
  date: string; 
  startTime: string;
  endTime: string; 
  location?: string;
  taskId?: number;
  task?: Task;
  creatorId?: number;
  creator?: User;
  eventUsers: { $values: EventUser[] };
  color?: Color;
}

export interface EventUser {
  eventId: number;
  userId: number;
  fullName: string;
  user?: User;
  event?: Event;
}
export interface Message {
  messageId?: number;
  messageText: string;
  timeline: string;
  senderId: number;
  receiverId: number;
  sender?: User;
  receiver?: User;
}