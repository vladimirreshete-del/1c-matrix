
export enum UserRole {
  ADMIN = 'ADMIN',
  EXECUTOR = 'EXECUTOR',
  NONE = 'NONE'
}

export enum TaskStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum TaskImportance {
  ORDINARY = 'ORDINARY',
  URGENT = 'URGENT',
  KEY = 'KEY'
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string; // Display role name (e.g. "Developer")
  systemRole: UserRole; // Internal role (ADMIN/EXECUTOR)
  avatar: string;
  email: string;
  telegramId?: string;
}

export interface Task {
  id: string;
  number: number;
  title: string;
  companyName: string; // New field
  description: string;
  status: TaskStatus;
  importance: TaskImportance;
  assignedTo: string; // Member ID
  dueDate: string;
  createdAt: string;
  comments: Comment[];
}

export interface AppState {
  role: UserRole;
  teamId: string | null;
  user: {
    id: string;
    name: string;
  } | null;
}
