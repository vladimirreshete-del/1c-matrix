
import React, { useState } from 'react';
import { Task, TeamMember, TaskStatus, TaskPriority } from '../types';
import { STATUS_CONFIG } from '../constants';
import { Plus, Search, Calendar, Clock, CheckCircle, ListTodo } from 'lucide-react';

interface Props {
  tasks: Task[];
  team: TeamMember[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  isAdmin: boolean;
  executorId: string;
}

const TasksView: React.FC<Props> = ({ tasks, team, onAddTask, onUpdateTask, isAdmin, executorId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(team[0]?.id || '');
  const [activeFilter, setActiveFilter] = useState<TaskStatus>(TaskStatus.NEW);

  // Фильтруем задачи, объединяя REVIEW и DONE в одну категорию "Готово" для интерфейса
  const filteredTasks = tasks.filter(t => {
    if (activeFilter === TaskStatus.DONE) {
      return t.status === TaskStatus.DONE || t.status === TaskStatus.REVIEW;
    }
    return t.status === activeFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAddTask({
      id: Math.random().toString(36).substr(2, 9),
      title,
      description: '',
      status: TaskStatus.NEW,
      priority: TaskPriority.MEDIUM,
      assignedTo: assignee,
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    });
    setIsAdding(false);
    setTitle('');
  };

  const handleNextStatus = (task: Task) => {
    let nextStatus = task.status;
    if (task.status === TaskStatus.NEW) nextStatus = TaskStatus.IN_PROGRESS;
    else if (task.status === TaskStatus.IN_PROGRESS) nextStatus = TaskStatus.DONE;
    else nextStatus = TaskStatus.NEW;
    onUpdateTask({ ...task, status: nextStatus });
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5 shadow-inner">
        {[
          { id: TaskStatus.NEW, label: 'Новые', icon: <Plus size={14}/> },
          { id: TaskStatus.IN_PROGRESS, label: 'В работе', icon: <Clock size={14}/> },
          { id: TaskStatus.DONE, label: 'Готово', icon: <CheckCircle size={14}/> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as TaskStatus)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
              activeFilter === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input placeholder="Поиск задач..." className="w-full bg-slate-800/40 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:border-blue-500/50" />
        </div>
        {isAdmin && (
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 p-3.5 rounded-2xl shadow-lg active:scale-95 transition-all">
            <Plus size={20} />
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-slate-800 border border-blue-500/30 rounded-3xl p-5 shadow-2xl animate-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Что нужно сделать?" className="w-full bg-slate-900/50 border border-white/5 p-4 rounded-2xl text-sm outline-none"
              autoFocus
            />
            <select 
              value={assignee} onChange={(e) => setAssignee(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 p-4 rounded-2xl text-sm outline-none"
            >
              {team.map(m => <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 text-slate-500 font-bold text-[10px] uppercase">Отмена</button>
              <button type="submit" className="flex-2 bg-blue-600 text-white font-black text-[10px] py-4 rounded-2xl uppercase">Создать</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {filteredTasks.map(task => {
          const status = STATUS_CONFIG[task.status];
          const member = team.find(m => m.id === task.assignedTo);
          return (
            <div 
              key={task.id} 
              onClick={() => handleNextStatus(task)}
              className="bg-slate-800/20 border border-white/5 p-5 rounded-[2rem] active:scale-[0.97] transition-all cursor-pointer hover:bg-slate-800/40"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-1.5 ${status.color}`}>
                  {status.icon} {status.label}
                </div>
              </div>
              <h4 className="text-white text-sm font-bold mb-4 leading-snug">{task.title}</h4>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">{member?.name || '---'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar size={12} />
                  <span className="text-[10px] font-bold">{task.dueDate}</span>
                </div>
              </div>
            </div>
          );
        })}
        {filteredTasks.length === 0 && (
          <div className="text-center py-16 opacity-10">
            <ListTodo size={48} className="mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Пусто</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksView;
