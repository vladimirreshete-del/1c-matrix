
import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  PlusCircle,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const NAVIGATION = [
  { id: 'dashboard', label: 'Главная', icon: <LayoutDashboard size={22} /> },
  { id: 'tasks', label: 'Задачи', icon: <CheckSquare size={22} /> },
  { id: 'team', label: 'Команда', icon: <Users size={22} /> },
];

export const STATUS_CONFIG = {
  NEW: { label: 'Новая', color: 'bg-blue-500/10 text-blue-400', icon: <PlusCircle size={14} /> },
  IN_PROGRESS: { label: 'В работе', color: 'bg-amber-500/10 text-amber-400', icon: <Clock size={14} /> },
  REVIEW: { label: 'Контроль', color: 'bg-purple-500/10 text-purple-400', icon: <AlertCircle size={14} /> },
  DONE: { label: 'Готово', color: 'bg-emerald-500/10 text-emerald-400', icon: <CheckCircle2 size={14} /> },
};

export const PRIORITY_CONFIG = {
  LOW: { label: 'Низкий', color: 'text-slate-400' },
  MEDIUM: { label: 'Средний', color: 'text-blue-400' },
  HIGH: { label: 'Высокий', color: 'text-orange-400' },
  CRITICAL: { label: 'Критичный', color: 'text-red-500 font-bold' },
};
