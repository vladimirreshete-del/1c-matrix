
import React, { useState } from 'react';
import { TeamMember } from '../types';
import { UserPlus, Mail, ShieldCheck, MoreVertical, Link, Copy, Check } from 'lucide-react';

interface Props {
  team: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  isAdmin?: boolean;
  adminId?: string;
}

const TeamView: React.FC<Props> = ({ team, onAddMember, isAdmin, adminId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Сотрудник');
  const [copied, setCopied] = useState(false);

  // Ссылка: t.me/botname/app?startapp=ID
  const inviteLink = `https://t.me/super_crmka_bot/app?startapp=${adminId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddMember({
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
      email: `${name.toLowerCase().replace(' ', '.')}@1c.ru`,
      avatar: `https://picsum.photos/seed/${name}/100/100`
    });
    setIsAdding(false);
    setName('');
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Invite Link Section */}
      {isAdmin && (
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 text-blue-500/10 group-hover:scale-110 transition-transform duration-700">
             <Link size={80} />
          </div>
          <div className="relative z-10">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Ваша ссылка доступа</h3>
            <p className="text-xs text-slate-300 mb-4 pr-12">Отправьте эту ссылку сотрудникам, чтобы они вошли сразу в вашу команду Matrix.</p>
            <div className="flex items-center gap-2 bg-slate-900/80 p-2 rounded-xl border border-white/5">
              <input 
                readOnly 
                value={inviteLink} 
                className="flex-1 bg-transparent border-none text-[10px] text-blue-300 outline-none truncate"
              />
              <button 
                onClick={handleCopyLink}
                className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-500 active:scale-90 transition-all"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Команда ({team.length})</h2>
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1 hover:text-blue-400"
          >
            <UserPlus size={14} />
            Добавить
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-slate-800 border border-blue-500/20 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-top-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 font-bold uppercase">ФИО сотрудника</label>
              <input 
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 p-3 rounded-xl text-xs outline-none"
                placeholder="Алексей Иванов..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 font-bold uppercase">Специализация</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 p-3 rounded-xl text-xs outline-none"
              >
                <option>Разработчик</option>
                <option>Менеджер</option>
                <option>Дизайнер</option>
                <option>Аналитик</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 text-slate-500 font-bold text-[10px]">ОТМЕНА</button>
              <button type="submit" className="flex-1 bg-blue-600 text-white font-black text-[10px] py-3 rounded-xl">СОХРАНИТЬ</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {team.map(member => (
          <div key={member.id} className="bg-slate-800/20 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group">
            <img src={member.avatar} className="w-10 h-10 rounded-xl ring-2 ring-white/5 shadow-xl group-hover:scale-110 transition-transform" alt="" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-sm truncate">{member.name}</h4>
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">{member.role}</p>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg text-slate-600">
              <Mail size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamView;
