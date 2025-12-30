
import React, { useState } from 'react';
import { Task, TeamMember, TaskStatus, TaskPriority } from '../types';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';
// Fix: Added CheckSquare to lucide-react imports
import { Plus, Search, Calendar, User, MoreHorizontal, CheckSquare } from 'lucide-react';

interface Props {
  tasks: Task[];
  team: TeamMember[];
  onAddTask: (task: Task) => void;
  isAdmin: boolean;
  executorId: string;
}

const TasksView: React.FC<Props> = ({ tasks, team, onAddTask, isAdmin, executorId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(team[0]?.id || '');

  // If executor, maybe filter tasks? (Let's show all for now, but usually executors only see theirs)
  const displayTasks = isAdmin ? tasks : tasks; 

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

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            placeholder="Поиск по матрице..."
            className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-500/50 transition-all backdrop-blur-sm"
          />
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-500 p-3.5 rounded-2xl transition-all active:scale-90 shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-slate-800/80 border border-blue-500/30 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-black text-white italic tracking-tighter">НОВАЯ ЗАДАЧА</h3>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Что нужно сделать?"
              className="w-full bg-slate-900/50 border border-white/5 p-4 rounded-xl text-sm outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Исполнитель</label>
              <select 
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 p-4 rounded-xl text-sm outline-none"
              >
                {team.map(m => <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="flex-1 text-slate-400 font-bold text-xs p-4 rounded-xl hover:bg-white/5 transition-colors"
              >
                ОТМЕНА
              </button>
              <button 
                type="submit"
                className="flex-1 bg-blue-600 text-white font-black text-xs p-4 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"
              >
                СОЗДАТЬ
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {displayTasks.map(task => {
          const status = STATUS_CONFIG[task.status];
          const member = team.find(m => m.id === task.assignedTo);
          
          return (
            <div key={task.id} className="bg-slate-800/40 border border-white/5 p-5 rounded-3xl group hover:border-blue-500/30 transition-all backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 ${status.color}`}>
                  {status.icon}
                  {status.label}
                </div>
                <button className="text-slate-600 hover:text-white transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              
              <h4 className="text-white font-bold mb-4 leading-snug group-hover:text-blue-100 transition-colors">
                {task.title}
              </h4>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                    <User size={12} className="text-blue-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold truncate max-w-[80px]">
                    {member?.name || 'Не назначен'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar size={12} />
                  <span className="text-[10px] font-bold">{task.dueDate}</span>
                </div>
              </div>
            </div>
          );
        })}
        {displayTasks.length === 0 && (
          <div className="text-center py-20 opacity-20">
             <CheckSquare size={48} className="mx-auto mb-4" />
             <p className="text-sm font-bold uppercase tracking-widest">Задач пока нет</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksView;
