
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

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  telegramId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string; // Member ID
  dueDate: string;
  createdAt: string;
}

export interface AppState {
  role: UserRole;
  teamId: string | null; // For executors, this is the Admin's ID
  user: {
    id: string;
    name: string;
  } | null;
}
