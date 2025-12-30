
import React, { useState } from 'react';
import { TeamMember } from '../types';
import { UserPlus, Mail, ShieldCheck, MoreVertical } from 'lucide-react';

interface Props {
  team: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  // Fix: Added isAdmin to Props interface to resolve type error in App.tsx
  isAdmin?: boolean;
}

const TeamView: React.FC<Props> = ({ team, onAddMember, isAdmin }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Сотрудник');

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
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-br from-sbis-primary to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">Ваша команда</h2>
          <p className="text-blue-100 text-sm mt-1">{team.length} участников активно</p>
          {/* Fix: Only show add button if isAdmin is true */}
          {isAdmin && (
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-4 bg-white text-sbis-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <UserPlus size={16} />
              Добавить
            </button>
          )}
        </div>
        <UsersCircle className="absolute -right-4 -bottom-4 opacity-20 text-white" />
      </div>

      {isAdding && (
        <div className="bg-white border border-sbis-border rounded-xl p-4 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-sbis-primary">Новый участник</h3>
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase">ФИО</label>
              <input 
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-sbis-border py-2 focus:outline-none focus:border-sbis-primary"
                placeholder="Иванов Иван..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Должность</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-50 p-2 rounded-lg text-sm"
              >
                <option>Сотрудник</option>
                <option>Менеджер</option>
                <option>Разработчик</option>
                <option>Дизайнер</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="text-sm text-gray-500 px-3">Отмена</button>
              <button type="submit" className="bg-sbis-primary text-white text-sm px-6 py-2 rounded-xl font-bold">Сохранить</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {team.map(member => (
          <div key={member.id} className="bg-white p-4 rounded-xl border border-sbis-border flex items-center gap-4 hover:shadow-md transition-shadow">
            <img src={member.avatar} className="w-12 h-12 rounded-full ring-2 ring-gray-50 shadow-sm" alt="" />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 truncate">{member.name}</h4>
              <p className="text-xs text-sbis-primary font-medium">{member.role}</p>
              <div className="flex items-center gap-2 mt-1">
                <Mail size={10} className="text-gray-400" />
                <span className="text-[10px] text-gray-400 truncate">{member.email}</span>
              </div>
            </div>
            <button className="text-gray-300 p-1">
              <MoreVertical size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsersCircle = ({ className }: { className?: string }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="20" strokeDasharray="20 10"/>
  </svg>
);

export default TeamView;
