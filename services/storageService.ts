
import { Task, TeamMember } from '../types';

const KEYS = {
  TASKS: '1c_matrix_tasks',
  TEAM: '1c_matrix_team'
};

const INITIAL_TEAM: TeamMember[] = [
  { id: '1', name: 'Алексей Иванов', role: 'Руководитель', email: 'alex@1c.ru', avatar: 'https://picsum.photos/seed/alex/100/100' },
  { id: '2', name: 'Мария Петрова', role: 'Разработчик', email: 'maria@1c.ru', avatar: 'https://picsum.photos/seed/maria/100/100' },
];

const INITIAL_TASKS: Task[] = [
  { 
    id: 't1', 
    title: 'Настройка окружения Render', 
    description: 'Подготовить конфигурационные файлы для деплоя бэкенда.',
    status: 'IN_PROGRESS' as any,
    priority: 'HIGH' as any,
    assignedTo: '2',
    dueDate: '2023-12-31',
    createdAt: new Date().toISOString()
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
