
import React, { useState } from 'react';
import { TeamMember, UserRole, Task, TaskStatus, TaskImportance } from '../types';
import { IMPORTANCE_CONFIG } from '../constants';
import { UserPlus, Link, Copy, Check, Trash2, Edit2, X, ChevronRight, Briefcase, Share2, ChevronLeft } from 'lucide-react';

interface Props {
  team: TeamMember[];
  onUpdateTeam: (team: TeamMember[]) => void;
  isAdmin: boolean;
  adminId: string;
  allTasks: Task[];
}

const TeamView: React.FC<Props> = ({ team, onUpdateTeam, isAdmin, adminId, allTasks }) => {
  const [viewingMemberTasks, setViewingMemberTasks] = useState<TeamMember | null>(null);
  const [isShowingInvite, setIsShowingInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const directLink = `https://t.me/your_bot_name/app?startapp=${adminId}`;

  return (
    <div className="p-4 space-y-6 pb-12">
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
            <img src={member.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-white truncate">{member.name}</h4>
              <p className="text-[8px] text-slate-500 font-black uppercase">{member.systemRole === UserRole.ADMIN ? 'Админ' : 'Исполнитель'}</p>
            </div>
            <ChevronRight size={16} className="text-slate-700" />
          </div>
        ))}
      </div>

      {/* Список задач сотрудника */}
      {viewingMemberTasks && (
        <div className="fixed inset-0 z-[110] bg-[#020617] flex flex-col pt-safe">
          <header className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#020617]">
            <button onClick={() => setViewingMemberTasks(null)} className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <ChevronLeft size={18} /> Назад
            </button>
            <span className="text-[10px] font-black text-white">{viewingMemberTasks.name}</span>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar pb-32">
            {allTasks.filter(t => t.assignedTo === viewingMemberTasks.id).length > 0 ? (
              allTasks.filter(t => t.assignedTo === viewingMemberTasks.id).map(task => (
                <div key={task.id} className="bg-slate-800/30 border border-white/5 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-slate-600 italic">#{task.number}</span>
                    <span className="text-[8px] font-black uppercase text-blue-500">{task.status}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">{task.title}</h4>
                  <p className="text-[10px] text-slate-500 italic line-clamp-2">{task.description}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <Briefcase size={64} className="mb-4" />
                <p className="text-xs font-black uppercase">Нет активных задач</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Приглашение */}
      {isShowingInvite && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="bg-slate-900 w-full p-8 rounded-[2rem] border border-blue-500/30 space-y-6">
            <h3 className="text-center font-black uppercase italic tracking-widest">Пригласить</h3>
            <div className="p-4 bg-black/40 rounded-xl break-all text-[10px] font-mono text-slate-400 border border-white/5 select-all">
              {directLink}
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { navigator.clipboard.writeText(directLink); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} 
                className="bg-blue-600 p-4 rounded-xl font-black text-[10px] uppercase tracking-widest"
              >
                {copied ? 'Скопировано!' : 'Копировать ссылку'}
              </button>
              <button onClick={() => setIsShowingInvite(false)} className="p-2 text-slate-500 text-[10px] font-black uppercase">Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamView;
