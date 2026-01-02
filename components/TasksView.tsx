
import React, { useState, useRef, useEffect } from 'react';
import { Task, TeamMember, TaskStatus, TaskImportance, UserRole, Comment } from '../types';
import { STATUS_CONFIG, IMPORTANCE_CONFIG } from '../constants';
import { Plus, Calendar, Send, X, MessageSquare, ChevronLeft, UserCircle } from 'lucide-react';

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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeFilter, setActiveFilter] = useState<TaskStatus>(TaskStatus.NEW);
  const [commentText, setCommentText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Форма новой задачи
  const [newTitle, setNewTitle] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<TaskStatus>(TaskStatus.NEW);
  const [newImportance, setNewImportance] = useState<TaskImportance>(TaskImportance.ORDINARY);
  const [newAssignedTo, setNewAssignedTo] = useState(team[0]?.id || executorId);

  useEffect(() => {
    if (editingTask && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [editingTask?.comments]);

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;
    onAddTask({
      id: Math.random().toString(36).substr(2, 9),
      number: tasks.length + 1,
      title: newTitle,
      companyName: newCompanyName,
      description: newDescription,
      status: newStatus,
      importance: newImportance,
      assignedTo: newAssignedTo,
      dueDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      comments: []
    });
    setIsAdding(false);
    setNewTitle(''); setNewCompanyName(''); setNewDescription('');
  };

  const handleAddComment = (task: Task) => {
    if (!commentText.trim()) return;
    const currentMember = team.find(m => m.id === executorId);
    const updated = {
      ...task,
      comments: [...(task.comments || []), {
        id: Date.now().toString(),
        userId: executorId,
        userName: currentMember?.name || 'Пользователь',
        text: commentText,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]
    };
    onUpdateTask(updated);
    setEditingTask(updated);
    setCommentText('');
  };

  const visibleTasks = tasks.filter(t => isAdmin || t.assignedTo === executorId);
  const filteredTasks = visibleTasks.filter(t => activeFilter === TaskStatus.DONE ? (t.status === TaskStatus.DONE || t.status === TaskStatus.REVIEW) : t.status === activeFilter);

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 sticky top-0 z-20 backdrop-blur-md">
        {[TaskStatus.NEW, TaskStatus.IN_PROGRESS, TaskStatus.DONE].map(status => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              activeFilter === status ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'
            }`}
          >
            {status === TaskStatus.NEW ? 'Новые' : status === TaskStatus.IN_PROGRESS ? 'В работе' : 'Готово'}
          </button>
        ))}
      </div>

      {isAdmin && (
        <button 
          onClick={() => setIsAdding(true)} 
          className="w-full bg-blue-600/10 text-blue-500 border border-blue-500/20 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Создать задачу
        </button>
      )}

      <div className="space-y-3">
        {filteredTasks.map(task => {
          const status = STATUS_CONFIG[task.status];
          const member = team.find(m => m.id === task.assignedTo);
          return (
            <div 
              key={task.id} onClick={() => setEditingTask(task)}
              className="bg-slate-800/30 border border-white/5 p-4 rounded-2xl active:scale-[0.98] transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] font-black text-slate-600">#{task.number}</span>
                <div className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase ${status.color}`}>
                  {status.label}
                </div>
              </div>
              <h4 className="text-white text-sm font-bold mb-3">{task.title}</h4>
              <div className="flex items-center justify-between text-[8px] font-black uppercase text-slate-500 border-t border-white/5 pt-3">
                <span className="truncate max-w-[120px]">{member?.name || 'Без ответственного'}</span>
                <span className="flex items-center gap-1"><Calendar size={10} /> {task.dueDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col p-6 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setIsAdding(false)} className="p-2 bg-slate-800 rounded-xl"><X size={20}/></button>
            <h2 className="text-sm font-black uppercase italic tracking-widest text-slate-400 text-right">Новая задача</h2>
          </div>
          
          <div className="space-y-6 flex-1">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Компания</label>
              <input placeholder="Название компании" value={newCompanyName} onChange={e => setNewCompanyName(e.target.value)} className="w-full bg-slate-800/50 p-4 rounded-xl text-sm border border-white/5" />
            </div>
            
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Заголовок</label>
              <input placeholder="Название задачи" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-slate-800/50 p-4 rounded-xl text-sm border border-white/5 font-bold text-white" />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Описание</label>
              <textarea placeholder="Что нужно сделать?" value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full bg-slate-800/50 p-4 rounded-xl text-sm border border-white/5 min-h-[120px] text-slate-300" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Ответственный</label>
                <select 
                  value={newAssignedTo} 
                  onChange={e => setNewAssignedTo(e.target.value)}
                  className="w-full bg-slate-800/50 p-4 rounded-xl text-[10px] font-bold text-white border border-white/5 appearance-none"
                >
                  {team.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Важность</label>
                <select 
                  value={newImportance} 
                  onChange={e => setNewImportance(e.target.value as any)}
                  className="w-full bg-slate-800/50 p-4 rounded-xl text-[10px] font-bold text-white border border-white/5 appearance-none"
                >
                  <option value={TaskImportance.ORDINARY}>Обычная</option>
                  <option value={TaskImportance.URGENT}>Срочная</option>
                  <option value={TaskImportance.KEY}>Ключевая</option>
                </select>
              </div>
            </div>
          </div>
          
          <button onClick={handleCreateTask} className="mt-8 bg-blue-600 w-full p-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20">Создать задачу</button>
        </div>
      )}

      {editingTask && (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col pt-safe overflow-hidden">
          <header className="p-4 border-b border-white/5 flex items-center bg-[#020617] relative shrink-0">
            <button onClick={() => setEditingTask(null)} className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest z-10">
              <ChevronLeft size={18} /> Назад
            </button>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black uppercase text-slate-600 italic">Задача #{editingTask.number}</span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-40">
            <div className="space-y-4">
              <div className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500">{editingTask.companyName || 'Matrix Cloud'}</div>
              <h2 className="text-xl font-black text-white leading-tight">{editingTask.title}</h2>
              <div className="p-4 bg-slate-800/30 rounded-2xl text-xs text-slate-300 leading-relaxed border border-white/5">
                <div className="text-[8px] font-black uppercase text-slate-500 mb-2">Описание</div>
                {editingTask.description || 'Нет описания'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Статус</label>
                <select 
                  value={editingTask.status} 
                  onChange={e => onUpdateTask({...editingTask, status: e.target.value as any})}
                  className="w-full bg-slate-800/50 p-3 rounded-xl text-[10px] font-bold text-white border border-white/5"
                >
                  <option value={TaskStatus.NEW}>Новая</option>
                  <option value={TaskStatus.IN_PROGRESS}>В работе</option>
                  <option value={TaskStatus.DONE}>Готово</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Важность</label>
                <div className="w-full bg-slate-800/20 p-3 rounded-xl text-[10px] font-bold text-slate-400 border border-white/5">
                  {IMPORTANCE_CONFIG[editingTask.importance]?.label}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <MessageSquare size={14} className="text-blue-500" /> Обсуждение
              </h3>
              <div className="space-y-4">
                {editingTask.comments?.map(c => (
                  <div key={c.id} className={`flex flex-col ${c.userId === executorId ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${c.userId === executorId ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'}`}>
                      <p className="text-[7px] font-black uppercase opacity-60 mb-1">{c.userName}</p>
                      {c.text}
                      <p className="text-[6px] text-right mt-1 opacity-40">{c.createdAt}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#020617] border-t border-white/5 flex gap-2 shrink-0 pb-12">
            <input 
              placeholder="Написать ответ..." 
              value={commentText} onChange={e => setCommentText(e.target.value)}
              className="flex-1 bg-slate-800/50 p-4 rounded-xl text-xs outline-none border border-white/5" 
            />
            <button onClick={() => handleAddComment(editingTask)} className="bg-blue-600 p-4 rounded-xl text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all"><Send size={18}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
