
import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Star
} from 'lucide-react';
import { TaskImportance } from './types';

export const NAVIGATION = [
  { id: 'dashboard', label: 'Главная', icon: <LayoutDashboard size={22} /> },
  { id: 'tasks', label: 'Задачи', icon: <CheckSquare size={22} /> },
  { id: 'team', label: 'Команда', icon: <Users size={22} /> },
];

export const STATUS_CONFIG = {
  NEW: { label: 'Новая', color: 'bg-blue-500/10 text-blue-400', icon: <PlusCircle size={14} /> },
  IN_PROGRESS: { label: 'В работе', color: 'bg-amber-500/10 text-amber-400', icon: <Clock size={14} /> },
  DONE: { label: 'Готово', color: 'bg-emerald-500/10 text-emerald-400', icon: <CheckCircle2 size={14} /> },
  REVIEW: { label: 'Готово', color: 'bg-emerald-500/10 text-emerald-400', icon: <CheckCircle2 size={14} /> }
};

export const IMPORTANCE_CONFIG = {
  [TaskImportance.ORDINARY]: { label: 'Обычная', color: 'bg-slate-500/10 text-slate-400', icon: <AlertCircle size={12} /> },
  [TaskImportance.URGENT]: { label: 'Срочная', color: 'bg-orange-500/10 text-orange-400', icon: <Zap size={12} /> },
  [TaskImportance.KEY]: { label: 'Ключевая', color: 'bg-red-500/10 text-red-400', icon: <Star size={12} /> }
};
