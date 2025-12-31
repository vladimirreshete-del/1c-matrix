
import React, { useState } from 'react';
import { TeamMember, UserRole, Task, TaskStatus, TaskImportance } from '../types';
import { IMPORTANCE_CONFIG } from '../constants';
import { UserPlus, Link, Copy, Check, Trash2, Edit2, X, ChevronRight, Briefcase, Share2 } from 'lucide-react';

interface Props {
  team: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  onUpdateTeam?: (team: TeamMember[]) => void;
  isAdmin?: boolean;
  adminId?: string;
  allTasks?: Task[];
}

const TeamView: React.FC<Props> = ({ team, onAddMember, onUpdateTeam, isAdmin, adminId, allTasks = [] }) => {
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [viewingMemberTasks, setViewingMemberTasks] = useState<TeamMember | null>(null);
  const [isShowingInvite, setIsShowingInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const tg = (window as any).Telegram?.WebApp;
  const botUsername = tg?.initDataUnsafe?.bot_inline_mode ? 'matrix_1c_bot' : 'super_crmka_bot'; // Имя бота
  const inviteLink = `https://t.me/share/url?url=https://t.me/super_crmka_bot/app?startapp=${adminId}&text=Присоединяйся к моей команде в 1C Matrix!`;
  const directLink = `https://t.me/super_crmka_bot/app?startapp=${adminId}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(directLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(inviteLink);
    } else {
      window.open(inviteLink, '_blank');
    }
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Удалить сотрудника из команды? Данные о его задачах сохранятся.') && onUpdateTeam) {
      onUpdateTeam(team.filter(m => m.id !== id));
    }
  };

  const handleUpdateMember = () => {
    if (editingMember && onUpdateTeam) {
      const updated = team.map(m => m.id === editingMember.id ? editingMember : m);
      onUpdateTeam(updated);
      setEditingMember(null);
    }
  };

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Команда</h2>
          <p className="text-[10px] text-slate-600 font-bold">{team.length} участников</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsShowingInvite(true)} 
            className="bg-blue-600/10 text-blue-500 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border border-blue-500/20 active:scale-95 transition-all"
          >
            <UserPlus size={16} /> Добавить
          </button>
        )}
      </div>

      {/* Team List */}
      <div className="grid grid-cols-1 gap-3">
        {team.map(member => (
          <div 
            key={member.id} 
            className="bg-slate-800/20 p-4 rounded-[1.8rem] border border-white/5 flex items-center gap-4 group hover:bg-slate-800/40 transition-all cursor-pointer"
            onClick={() => setViewingMemberTasks(member)}
          >
            <div className="relative">
              <img src={member.avatar} className="w-12 h-12 rounded-2xl ring-2 ring-white/5 object-cover" />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0F172A] ${member.systemRole === UserRole.ADMIN ? 'bg-amber-500' : 'bg-blue-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-sm truncate">{member.name}</h4>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">
                {member.systemRole === UserRole.ADMIN ? 'Администратор' : 'Исполнитель'}
              </p>
            </div>
            <div className="flex gap-1">
              {isAdmin && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingMember(member); }}
                  className="p-2 text-slate-500 hover:text-blue-500 active:scale-90 transition-all"
                ><Edit2 size={16} /></button>
              )}
              {isAdmin && member.id !== adminId && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteMember(member.id); }}
                  className="p-2 text-slate-500 hover:text-red-500 active:scale-90 transition-all"
                ><Trash2 size={16} /></button>
              )}
              <ChevronRight size={16} className="text-slate-700 ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Invite Generator Modal */}
      {isShowingInvite && (
        <div className="fixed inset-0 z-[60] bg-[#0F172A]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-xs bg-slate-900 border border-blue-500/30 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setIsShowingInvite(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-600/20 rounded-3xl mx-auto flex items-center justify-center text-blue-500 mb-2">
                <Link size={32} />
              </div>
              <h2 className="text-lg font-black italic tracking-tighter uppercase">Приглашение</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                Отправьте эту ссылку сотруднику.<br/>Он автоматически добавится в Matrix.
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleShare}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Share2 size={16} /> ОТПРАВИТЬ В TG
              </button>
              
              <button 
                onClick={handleCopy}
                className={`w-full border py-4 rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
                  copied ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : 'border-white/10 text-slate-400 hover:bg-white/5'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />} 
                {copied ? 'СКОПИРОВАНО' : 'КОПИРОВАТЬ ССЫЛКУ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-[60] bg-[#0F172A]/90 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-xs bg-slate-900 border border-blue-500/30 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <h2 className="text-lg font-black italic tracking-tighter uppercase text-center text-white">Доступ</h2>
            
            <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[9px] text-slate-500 font-black uppercase ml-2">Имя сотрудника</label>
                 <input 
                    value={editingMember.name} 
                    onChange={e => setEditingMember({...editingMember, name: e.target.value})}
                    className="w-full bg-slate-800/50 p-4 rounded-2xl text-sm font-bold text-white outline-none border border-white/5 focus:border-blue-500/50" 
                 />
               </div>
               
               <div className="space-y-1">
                 <label className="text-[9px] text-slate-500 font-black uppercase ml-2">Роль в системе</label>
                 <select 
                    value={editingMember.systemRole}
                    onChange={e => setEditingMember({...editingMember, systemRole: e.target.value as UserRole})}
                    className="w-full bg-slate-800/50 p-4 rounded-2xl text-sm font-bold text-white outline-none border border-white/5 appearance-none"
                 >
                   <option value={UserRole.ADMIN}>Администратор (видит всё)</option>
                   <option value={UserRole.EXECUTOR}>Исполнитель (только свои)</option>
                 </select>
               </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button onClick={handleUpdateMember} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs shadow-lg active:scale-95 transition-all">СОХРАНИТЬ</button>
              <button onClick={() => setEditingMember(null)} className="w-full text-[10px] font-black text-slate-500 uppercase py-2 hover:text-white transition-colors">ОТМЕНА</button>
            </div>
          </div>
        </div>
      )}

      {/* Member Tasks Inspection */}
      {viewingMemberTasks && (
        <div className="fixed inset-0 z-50 bg-[#0F172A] flex flex-col animate-in slide-in-from-right duration-300">
          <header className="p-5 flex items-center justify-between border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <button onClick={() => setViewingMemberTasks(null)} className="p-2.5 bg-slate-800/50 rounded-2xl text-slate-400 hover:text-white transition-all"><X size={20} /></button>
              <div>
                <h2 className="text-sm font-black text-white">{viewingMemberTasks.name}</h2>
                <p className="text-[9px] text-blue-500 uppercase font-black tracking-widest">Список задач</p>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            {allTasks.filter(t => t.assignedTo === viewingMemberTasks.id).length > 0 ? (
              allTasks.filter(t => t.assignedTo === viewingMemberTasks.id).map(task => {
                const importance = IMPORTANCE_CONFIG[task.importance || TaskImportance.ORDINARY];
                return (
                  <div key={task.id} className="bg-slate-800/20 border border-white/5 p-5 rounded-[1.8rem] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-600 italic">#{task.number}</span>
                      <div className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${importance.color}`}>
                        {importance.label}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-200 leading-tight">{task.title}</p>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[9px] font-black uppercase text-slate-500">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Статус: {task.status}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10 py-20">
                <Briefcase size={64} className="mb-4" />
                <p className="text-xs font-black uppercase tracking-[0.2em]">Задач пока нет</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamView;
