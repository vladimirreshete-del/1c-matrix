
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, Users, ArrowRight, Link } from 'lucide-react';

interface Props {
  onSelect: (role: UserRole, teamId?: string) => void;
}

const LoginScreen: React.FC<Props> = ({ onSelect }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [showInviteInput, setShowInviteInput] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-8 flex flex-col justify-center items-center">
      <div className="mb-12 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-12">
          <Shield size={40} className="-rotate-12" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter mb-2">1C MATRIX</h1>
        <p className="text-slate-400 text-sm font-medium">Система управления 4.0</p>
      </div>

      {!showInviteInput ? (
        <div className="w-full max-w-xs space-y-4 animate-in slide-in-from-bottom-8 duration-500">
          <button 
            onClick={() => onSelect(UserRole.ADMIN)}
            className="w-full bg-blue-600 hover:bg-blue-500 p-5 rounded-2xl flex items-center gap-4 transition-all group active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <div className="bg-white/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <div className="text-left">
              <div className="font-bold">Создать Matrix</div>
              <div className="text-[10px] opacity-60">Режим Администратора</div>
            </div>
            <ArrowRight size={18} className="ml-auto opacity-40 group-hover:opacity-100" />
          </button>

          <button 
            onClick={() => setShowInviteInput(true)}
            className="w-full bg-slate-800/50 hover:bg-slate-800 p-5 rounded-2xl flex items-center gap-4 transition-all group active:scale-95 border border-slate-700/50"
          >
            <div className="bg-white/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <div className="text-left">
              <div className="font-bold">Войти по коду</div>
              <div className="text-[10px] opacity-60">Режим Исполнителя</div>
            </div>
            <ArrowRight size={18} className="ml-auto opacity-40 group-hover:opacity-100" />
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xs space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-slate-800 p-2 rounded-2xl border border-blue-500/30 flex items-center">
            <Link size={20} className="mx-3 text-blue-400" />
            <input 
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Код приглашения..."
              className="bg-transparent border-none outline-none text-sm w-full py-3"
              autoFocus
            />
          </div>
          <button 
            onClick={() => onSelect(UserRole.EXECUTOR, inviteCode)}
            className="w-full bg-blue-600 p-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50"
            disabled={!inviteCode}
          >
            Присоединиться
          </button>
          <button 
            onClick={() => setShowInviteInput(false)}
            className="w-full text-slate-500 text-xs font-bold uppercase tracking-widest"
          >
            Назад
          </button>
        </div>
      )}

      <div className="mt-20 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
        Enterprise Edition 2025
      </div>
    </div>
  );
};

export default LoginScreen;
