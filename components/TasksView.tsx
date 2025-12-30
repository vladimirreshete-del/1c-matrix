
import React, { useState } from 'react';
import { Task, TeamMember, TaskStatus, TaskPriority } from '../types';
import { STATUS_CONFIG } from '../constants';
import { Plus, Search, Calendar, User, CheckSquare, Clock, CheckCircle } from 'lucide-react';

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
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'ALL'>(TaskStatus.NEW);

  const filteredTasks = tasks.filter(t => activeFilter === 'ALL' || t.status === activeFilter);

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

  const toggleStatus = (task: Task) => {
    let nextStatus = task.status;
    if (task.status === TaskStatus.NEW) nextStatus = TaskStatus.IN_PROGRESS;
    else if (task.status === TaskStatus.IN_PROGRESS) nextStatus = TaskStatus.DONE;
    else nextStatus = TaskStatus.NEW;

    onUpdateTask({ ...task, status: nextStatus });
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Tabs */}
      <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
        {[
          { id: TaskStatus.NEW, label: 'Новые', icon: <Plus size={12}/> },
          { id: TaskStatus.IN_PROGRESS, label: 'В работе', icon: <Clock size={12}/> },
          { id: TaskStatus.DONE, label: 'Готово', icon: <CheckCircle size={12}/> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
              activeFilter === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'
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
          <input 
            placeholder="Поиск..."
            className="w-full bg-slate-800/40 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 p-3 rounded-xl shadow-lg active:scale-90 transition-all"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-slate-800 border border-blue-500/20 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-top-2">
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="font-black text-[10px] text-blue-400 uppercase tracking-widest">Создание задачи</h3>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Что нужно сделать?"
              className="w-full bg-slate-900/50 border border-white/5 p-3 rounded-xl text-xs outline-none"
              autoFocus
            />
            <select 
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 p-3 rounded-xl text-xs outline-none"
            >
              {team.map(m => <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>)}
            </select>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 text-slate-500 font-bold text-[10px] py-3">ОТМЕНА</button>
              <button type="submit" className="flex-1 bg-blue-600 text-white font-black text-[10px] py-3 rounded-xl">СОЗДАТЬ</button>
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
              onClick={() => toggleStatus(task)}
              className="bg-slate-800/30 border border-white/5 p-4 rounded-2xl active:scale-[0.98] transition-all cursor-pointer group hover:bg-slate-800/50"
            >
              <div className="flex justify-between items-start mb-2">
                <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase flex items-center gap-1 ${status.color}`}>
                  {status.icon}
                  {status.label}
                </div>
                <div className="text-[8px] font-bold text-slate-600">Нажми, чтобы сменить статус</div>
              </div>
              
              <h4 className="text-white text-sm font-bold mb-3 leading-tight group-hover:text-blue-200 transition-colors">
                {task.title}
              </h4>
              
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <User size={10} className="text-blue-500" />
                  <span className="text-[9px] text-slate-400 font-bold uppercase">{member?.name || '---'}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Calendar size={10} />
                  <span className="text-[9px] font-bold">{task.dueDate}</span>
                </div>
              </div>
            </div>
          );
        })}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 opacity-20">
             <CheckSquare size={32} className="mx-auto mb-2" />
             <p className="text-[10px] font-black uppercase tracking-widest">Нет задач в этой категории</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksView;
