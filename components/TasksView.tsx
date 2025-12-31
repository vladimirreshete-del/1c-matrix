
import React, { useState } from 'react';
import { Task, TeamMember, TaskStatus, TaskImportance, UserRole, Comment } from '../types';
import { STATUS_CONFIG, IMPORTANCE_CONFIG } from '../constants';
import { Plus, Search, Calendar, Send, X, MessageSquare, User, Check, Building2 } from 'lucide-react';

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
  
  // Поля для новой задачи
  const [newTitle, setNewTitle] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<TaskStatus>(TaskStatus.NEW);
  const [newImportance, setNewImportance] = useState<TaskImportance>(TaskImportance.ORDINARY);
  const [newAssignedTo, setNewAssignedTo] = useState(team[0]?.id || executorId);

  // Поля для комментариев
  const [commentText, setCommentText] = useState('');

  const visibleTasks = tasks.filter(t => isAdmin || t.assignedTo === executorId);

  const filteredTasks = visibleTasks.filter(t => {
    if (activeFilter === TaskStatus.DONE) {
      return t.status === TaskStatus.DONE || t.status === TaskStatus.REVIEW;
    }
    return t.status === activeFilter;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    const newTask: Task = {
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
    };

    onAddTask(newTask);
    resetForm();
  };

  const resetForm = () => {
    setIsAdding(false);
    setNewTitle('');
    setNewCompanyName('');
    setNewDescription('');
    setNewStatus(TaskStatus.NEW);
    setNewImportance(TaskImportance.ORDINARY);
    setNewAssignedTo(team[0]?.id || executorId);
  };

  const handleAddComment = (task: Task) => {
    if (!commentText.trim()) return;
    const currentMember = team.find(m => m.id === executorId);
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: executorId,
      userName: currentMember?.name || 'Пользователь',
      text: commentText,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedTask = {
      ...task,
      comments: [...(task.comments || []), newComment]
    };
    onUpdateTask(updatedTask);
    setEditingTask(updatedTask);
    setCommentText('');
  };

  const updateTaskField = (field: keyof Task, value: any) => {
    if (!editingTask) return;
    const updated = { ...editingTask, [field]: value };
    setEditingTask(updated);
    onUpdateTask(updated);
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Tabs Menu */}
      <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-white/5">
        {[
          { id: TaskStatus.NEW, label: 'Новые' },
          { id: TaskStatus.IN_PROGRESS, label: 'В работе' },
          { id: TaskStatus.DONE, label: 'Готово' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as TaskStatus)}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${
              activeFilter === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
          <input placeholder="Найти задачу..." className="w-full bg-slate-800/30 border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 text-xs outline-none focus:border-blue-500/30 transition-all" />
        </div>
        {isAdmin && (
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-white">
            <Plus size={20} />
          </button>
        )}
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? filteredTasks.map(task => {
          const status = STATUS_CONFIG[task.status];
          const importance = IMPORTANCE_CONFIG[task.importance || TaskImportance.ORDINARY];
          const member = team.find(m => m.id === task.assignedTo);
          return (
            <div 
              key={task.id} 
              onClick={() => setEditingTask(task)}
              className="bg-slate-800/20 border border-white/5 p-5 rounded-[2rem] active:scale-[0.98] transition-all cursor-pointer hover:bg-slate-800/30 group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-600 italic">#{task.number}</span>
                  <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-1 ${importance.color}`}>
                    {importance.label}
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${status.color}`}>
                  {status.label}
                </div>
              </div>
              
              <div className="mb-4">
                {task.companyName && (
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-tighter mb-1 flex items-center gap-1">
                    <Building2 size={10} /> {task.companyName}
                  </div>
                )}
                <h4 className="text-white text-sm font-bold line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">{task.title}</h4>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 font-black uppercase tracking-tighter">
                  <div className="w-5 h-5 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <User size={12} />
                  </div>
                  {member?.name || 'БЕЗ ОТВЕТСТВЕННОГО'}
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <Calendar size={12} className="text-slate-700" />
                  {task.dueDate}
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="text-center py-20 opacity-10">
            <Plus size={48} className="mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Пусто</p>
          </div>
        )}
      </div>

      {/* Create Task Form Overlay */}
      {isAdding && (
        <div className="fixed inset-0 z-[70] bg-[#0F172A] flex flex-col animate-in slide-in-from-bottom duration-300">
          <header className="p-5 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#0F172A]/80 backdrop-blur-xl z-10">
            <div className="flex items-center gap-4">
              <button onClick={resetForm} className="p-2.5 bg-slate-800/50 rounded-2xl text-slate-400"><X size={20}/></button>
              <h2 className="text-xs font-black italic uppercase tracking-widest text-white">НОВАЯ ЗАДАЧА</h2>
            </div>
            <button 
              onClick={handleCreateTask}
              className="text-[9px] font-black text-blue-500 uppercase px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center gap-2"
            >
              <Check size={14}/> СОЗДАТЬ
            </button>
          </header>

          <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar pb-32">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Название компании</label>
                <input 
                  value={newCompanyName} 
                  onChange={e => setNewCompanyName(e.target.value)}
                  className="w-full bg-slate-800/30 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500/50"
                  placeholder="Название организации..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Заголовок задачи</label>
                <input 
                  autoFocus
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-transparent text-xl font-black text-white outline-none focus:text-blue-400 transition-colors"
                  placeholder="Что нужно сделать?"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Описание</label>
                <textarea 
                  value={newDescription} 
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full bg-slate-800/20 border border-white/5 rounded-2xl p-5 text-sm font-medium text-slate-300 min-h-[120px] outline-none focus:border-blue-500/30 transition-all"
                  placeholder="Опишите детали задачи..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Статус</label>
                <select 
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as TaskStatus)}
                  className="w-full bg-slate-800/30 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none appearance-none"
                >
                  <option value={TaskStatus.NEW}>Новая</option>
                  <option value={TaskStatus.IN_PROGRESS}>В работе</option>
                  <option value={TaskStatus.DONE}>Готово</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Важность</label>
                <select 
                  value={newImportance}
                  onChange={e => setNewImportance(e.target.value as TaskImportance)}
                  className="w-full bg-slate-800/30 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none appearance-none"
                >
                  <option value={TaskImportance.ORDINARY}>Обычная</option>
                  <option value={TaskImportance.URGENT}>Срочная</option>
                  <option value={TaskImportance.KEY}>Ключевая</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Ответственный</label>
              <select 
                value={newAssignedTo}
                onChange={e => setNewAssignedTo(e.target.value)}
                className="w-full bg-slate-800/30 border border-white/5 p-4 rounded-2xl text-sm font-bold text-white outline-none appearance-none"
              >
                {team.map(m => <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Task Details / Edit / Chat Overlay */}
      {editingTask && (
        <div className="fixed inset-0 z-[70] bg-[#0F172A] flex flex-col animate-in fade-in duration-200">
          <header className="p-5 flex items-center justify-between border-b border-white/5 sticky top-0 bg-[#0F172A]/80 backdrop-blur-xl z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setEditingTask(null)} className="p-2.5 bg-slate-800/50 rounded-2xl text-slate-400"><X size={20}/></button>
              <h2 className="text-xs font-black italic uppercase tracking-widest text-white">Задача #{editingTask.number}</h2>
            </div>
            {isAdmin && (
               <button 
                 onClick={() => { if(confirm('Удалить?')) { onUpdateTask({ ...editingTask, status: 'DELETED' as any }); setEditingTask(null); } }}
                 className="text-[9px] font-black text-red-500 uppercase px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20"
               >УДАЛИТЬ</button>
            )}
          </header>

          <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
            {/* Company, Title & Description */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Название компании</label>
                <input 
                  value={editingTask.companyName} 
                  onChange={e => updateTaskField('companyName', e.target.value)}
                  className="w-full bg-slate-800/30 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500/50"
                  placeholder="Организация..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Заголовок</label>
                <input 
                  disabled={!isAdmin}
                  value={editingTask.title} 
                  onChange={e => updateTaskField('title', e.target.value)}
                  className="w-full bg-transparent text-xl font-black text-white outline-none focus:text-blue-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Описание</label>
                <textarea 
                  value={editingTask.description} 
                  onChange={e => updateTaskField('description', e.target.value)}
                  className="w-full bg-slate-800/20 border border-white/5 rounded-2xl p-5 text-sm font-medium text-slate-300 min-h-[120px] outline-none focus:border-blue-500/30 transition-all"
                  placeholder="Опишите детали задачи..."
                />
              </div>
            </div>

            {/* Config: Status & Importance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Статус</label>
                <select 
                  value={editingTask.status}
                  onChange={e => updateTaskField('status', e.target.value)}
                  className="w-full bg-slate-800/30 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none appearance-none"
                >
                  <option value={TaskStatus.NEW}>Новая</option>
                  <option value={TaskStatus.IN_PROGRESS}>В работе</option>
                  <option value={TaskStatus.DONE}>Готово</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Важность</label>
                <select 
                  value={editingTask.importance}
                  onChange={e => updateTaskField('importance', e.target.value)}
                  className="w-full bg-slate-800/30 border border-white/5 rounded-xl p-4 text-xs font-bold text-white outline-none appearance-none"
                >
                  <option value={TaskImportance.ORDINARY}>Обычная</option>
                  <option value={TaskImportance.URGENT}>Срочная</option>
                  <option value={TaskImportance.KEY}>Ключевая</option>
                </select>
              </div>
            </div>

            {/* Assignee Selection (Admin only) */}
            {isAdmin && (
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-2">Ответственный</label>
                <select 
                  value={editingTask.assignedTo}
                  onChange={e => updateTaskField('assignedTo', e.target.value)}
                  className="w-full bg-slate-800/30 border border-white/5 p-4 rounded-2xl text-sm font-bold text-white outline-none appearance-none"
                >
                  {team.map(m => <option key={m.id} value={m.id} className="bg-slate-900">{m.name}</option>)}
                </select>
              </div>
            )}

            {/* Chat / Comments */}
            <div className="space-y-6 pt-8 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-500" /> Комментарии
                </h3>
                <span className="text-[9px] font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded-lg">
                  {editingTask.comments?.length || 0}
                </span>
              </div>
              
              <div className="space-y-4">
                {editingTask.comments?.map(c => (
                  <div key={c.id} className={`flex flex-col ${c.userId === executorId ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium ${
                      c.userId === executorId 
                      ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-600/10' 
                      : 'bg-slate-800/60 text-slate-200 rounded-bl-none border border-white/5'
                    }`}>
                      <p className="font-black text-[8px] mb-2 opacity-60 uppercase tracking-tighter">{c.userName}</p>
                      <p className="leading-relaxed">{c.text}</p>
                      <p className="text-[7px] mt-2 opacity-40 text-right font-black uppercase">{c.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="sticky bottom-4 flex gap-2 bg-[#0F172A] border border-white/10 p-2 rounded-3xl shadow-2xl">
                <input 
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Ваш комментарий..."
                  className="flex-1 bg-transparent border-none outline-none text-xs px-3 font-medium text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment(editingTask)}
                />
                <button 
                  onClick={() => handleAddComment(editingTask)}
                  className="bg-blue-600 p-3 rounded-2xl text-white active:scale-90 transition-all shadow-lg"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
