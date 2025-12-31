
// Добавлены недостающие типы для корректной типизации начальных данных
import { Task, TeamMember, UserRole, TaskStatus, TaskImportance } from '../types';

const KEYS = {
  TASKS: '1c_matrix_tasks',
  TEAM: '1c_matrix_team'
};

// Добавлено обязательное поле systemRole для участников команды
const INITIAL_TEAM: TeamMember[] = [
  { id: '1', name: 'Алексей Иванов', role: 'Руководитель', systemRole: UserRole.ADMIN, email: 'alex@1c.ru', avatar: 'https://picsum.photos/seed/alex/100/100' },
  { id: '2', name: 'Мария Петрова', role: 'Разработчик', systemRole: UserRole.EXECUTOR, email: 'maria@1c.ru', avatar: 'https://picsum.photos/seed/maria/100/100' },
];

// Исправлены поля задачи: добавлена важность (вместо priority), номер и пустой список комментариев
const INITIAL_TASKS: Task[] = [
  { 
    id: 't1', 
    number: 1,
    title: 'Настройка окружения Render', 
    companyName: 'ПАО Газпром',
    description: 'Подготовить конфигурационные файлы для деплоя бэкенда.',
    status: TaskStatus.IN_PROGRESS,
    importance: TaskImportance.KEY,
    assignedTo: '2',
    dueDate: '2023-12-31',
    createdAt: new Date().toISOString(),
    comments: []
  }
];

export const storageService = {
  getTasks: (): Task[] => {
    const data = localStorage.getItem(KEYS.TASKS);
    return data ? JSON.parse(data) : INITIAL_TASKS;
  },
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },
  getTeam: (): TeamMember[] => {
    const data = localStorage.getItem(KEYS.TEAM);
    return data ? JSON.parse(data) : INITIAL_TEAM;
  },
  saveTeam: (members: TeamMember[]) => {
    localStorage.setItem(KEYS.TEAM, JSON.stringify(members));
  }
};
