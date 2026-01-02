
import React, { useState } from 'react';
import { TeamMember, UserRole, Task, TaskStatus } from '../types';
import { STATUS_CONFIG, IMPORTANCE_CONFIG } from '../constants';
import { UserPlus, ChevronRight, Briefcase, ChevronLeft, MessageSquare, Send } from 'lucide-react';

interface Props {
  team: TeamMember[];
  onUpdateTeam: (team: TeamMember[]) => void;
  isAdmin: boolean;
  adminId: string;
  allTasks: Task[];
}

const TeamView: React.FC<Props> = ({ team, onUpdateTeam, isAdmin, adminId, allTasks }) => {
  const [viewingMemberTasks, setViewingMemberTasks] = useState<TeamMember | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isShowingInvite, setIsShowingInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const directLink = `https://t.me/super_crmka_bot/app?startapp=${adminId}`;

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Команда</h2>
          <p className="text-xs font-bold text-white">{team.length} сотрудников</p>
        </div>
        {isAdmin && (
          <button onClick={() => setIsShowingInvite(true)} className="p-3 bg-blue-600/10 text-blue-500 rounded-xl border border-blue-500/20 active:scale-95 transition-all">
            <UserPlus size={18} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {team.map(member => (
          <div key={member.id} onClick={() => setViewingMemberTasks(member)} className="bg-slate-800/30 p-4 rounded-2xl border border-white/5 flex items-center gap-4 active:scale-[0.98] transition-all">
            <img src={member.avatar} className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10" alt="" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-white truncate">{member.name}</h4>
              <p className="text-[8px] text-slate-500 font-black uppercase">{member.systemRole === UserRole.ADMIN ? 'Владелец' : 'Исполнитель'}</p>
            </div>
            <ChevronRight size={16} className="text-slate-700" />
          </div>
        ))}
      </div>

      {/* Список задач сотрудника */}
      {viewingMemberTasks && (
        <div className="fixed inset-0 z-[110] bg-[#020617] flex flex-col pt-safe overflow-hidden">
          <header className="p-4 border-b border-white/5 bg-[#020617] shrink-0">
            <div className="flex items-center justify-between mb-4">
               <button onClick={() => setViewingMemberTasks(null)} className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <ChevronLeft size={18} /> Назад
              </button>
              <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest italic">Профиль сотрудника</span>
            </div>
            
            <div className="flex items-center gap-4 px-2 pb-2">
              <img src={viewingMemberTasks.avatar} className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-2xl" alt="" />
              <div className="min-w-0">
                <h3 className="text-xl font-black text-white truncate leading-none mb-1">{viewingMemberTasks.name}</h3>
                <p className="text-[9px] font-black uppercase text-blue-500 tracking-[0.2em]">{viewingMemberTasks.role}</p>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar pb-40">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Текущие задачи</h4>
              <span className="bg-blue-600/20 text-blue-400 text-[8px] font-black px-2 py-0.5 rounded-md">
                {allTasks.filter(t => t.assignedTo === viewingMemberTasks.id).length}
              </span>
            </div>

            {allTasks.filter(t => t.assignedTo === viewingMemberTasks.id).length > 0 ? (
              allTasks.filter(t => t.assignedTo === viewingMemberTasks.id).map(task => {
                const status = STATUS_CONFIG[task.status];
                return (
                  <div 
                    key={task.id} 
                    onClick={() => setSelectedTask(task)}
                    className="bg-slate-800/30 border border-white/5 p-5 rounded-[1.5rem] space-y-3 active:scale-[0.98] transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-600 italic">#{task.number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-200 leading-snug">{task.title}</h4>
                    {/* Описание теперь без line-clamp, отображается полностью */}
                    <p className="text-[11px] text-slate-500 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                      {task.description || 'Без описания'}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                       <MessageSquare size={10} className="text-slate-600" />
                       <span className="text-[8px] font-black text-slate-600 uppercase">Нажмите для деталей и чата</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-64 flex flex-col items-center justify-center opacity-10">
                <Briefcase size={64} className="mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Задач нет</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Оверлей деталей задачи (при клике из списка сотрудника) */}
      {selectedTask && (
        <div className="fixed inset-0 z-[120] bg-[#020617] flex flex-col pt-safe overflow-hidden fade-in">
          <header className="p-4 border-b border-white/5 flex items-center bg-[#020617] relative shrink-0">
            <button onClick={() => setSelectedTask(null)} className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest z-10">
              <ChevronLeft size={18} /> К списку
            </button>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black uppercase text-slate-600 italic">Задача #{selectedTask.number}</span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-40">
            <div className="space-y-4">
              <div className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500">{selectedTask.companyName || 'Matrix Project'}</div>
              <h2 className="text-xl font-black text-white leading-tight">{selectedTask.title}</h2>
              <div className="p-4 bg-slate-800/30 rounded-2xl text-xs text-slate-300 leading-relaxed border border-white/5">
                <div className="text-[8px] font-black uppercase text-slate-500 mb-2">Описание</div>
                {selectedTask.description || 'Описание отсутствует'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Статус</label>
                <div className="w-full bg-slate-800/50 p-3 rounded-xl text-[10px] font-bold text-white border border-white/5">
                   {STATUS_CONFIG[selectedTask.status].label}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Важность</label>
                <div className="w-full bg-slate-800/20 p-3 rounded-xl text-[10px] font-bold text-slate-400 border border-white/5">
                  {IMPORTANCE_CONFIG[selectedTask.importance]?.label}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <MessageSquare size={14} className="text-blue-500" /> Обсуждение
              </h3>
              <div className="space-y-4">
                {selectedTask.comments?.map(c => (
                  <div key={c.id} className="flex flex-col items-start">
                    <div className="max-w-[85%] p-3 rounded-2xl text-xs bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none">
                      <p className="text-[7px] font-black uppercase opacity-60 mb-1">{c.userName}</p>
                      {c.text}
                      <p className="text-[6px] text-right mt-1 opacity-40">{c.createdAt}</p>
                    </div>
                  </div>
                ))}
                {(!selectedTask.comments || selectedTask.comments.length === 0) && (
                  <p className="text-[10px] text-slate-600 italic text-center py-4">История сообщений пуста</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Оверлей приглашения */}
      {isShowingInvite && (
        <div className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-md flex items-center justify-center p-8">
          <div className="bg-slate-900 w-full p-8 rounded-[2.5rem] border border-blue-500/20 space-y-6 text-center shadow-2xl">
            <h3 className="font-black uppercase italic tracking-widest text-white">Пригласить</h3>
            <p className="text-[10px] text-slate-500 uppercase font-black leading-relaxed">Ссылка для регистрации сотрудника</p>
            <div className="p-4 bg-black/40 rounded-2xl break-all text-[10px] font-mono text-blue-400 border border-white/5 select-all">
              {directLink}
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { navigator.clipboard.writeText(directLink); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} 
                className="bg-blue-600 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                {copied ? 'Скопировано!' : 'Копировать ссылку'}
              </button>
              <button onClick={() => setIsShowingInvite(false)} className="p-2 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamView;
