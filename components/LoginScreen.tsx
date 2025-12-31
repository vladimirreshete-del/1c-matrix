
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, Users, ArrowRight, Link, LayoutGrid } from 'lucide-react';

interface Props {
  onSelect: (role: UserRole, teamId?: string) => void;
}

const LoginScreen: React.FC<Props> = ({ onSelect }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [showInviteInput, setShowInviteInput] = useState(false);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 flex flex-col justify-between items-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full"></div>

      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-sm z-10">
        <div className="mb-14 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-float">
            <LayoutGrid size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-3 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            1C MATRIX
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-4 bg-blue-500/30"></div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">System Engine v4.0</p>
            <div className="h-[1px] w-4 bg-blue-500/30"></div>
          </div>
        </div>

        {!showInviteInput ? (
          <div className="w-full space-y-4">
            <button 
              onClick={() => onSelect(UserRole.ADMIN)}
              className="w-full glass-card p-6 rounded-[2rem] flex items-center gap-5 transition-all hover:bg-slate-800/60 active:scale-[0.97] group border-l-4 border-l-blue-500"
            >
              <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-400">
                <Shield size={22} />
              </div>
              <div className="text-left flex-1">
                <div className="text-xs font-black uppercase tracking-widest text-white/90">Создать Matrix</div>
                <div className="text-[9px] text-slate-500 font-bold mt-0.5">Режим Администратора</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={14} className="text-blue-400" />
              </div>
            </button>

            <button 
              onClick={() => setShowInviteInput(true)}
              className="w-full glass-card p-6 rounded-[2rem] flex items-center gap-5 transition-all hover:bg-slate-800/60 active:scale-[0.97] group border-l-4 border-l-slate-600"
            >
              <div className="bg-slate-700/30 p-3 rounded-2xl text-slate-400">
                <Users size={22} />
              </div>
              <div className="text-left flex-1">
                <div className="text-xs font-black uppercase tracking-widest text-white/90">Войти по коду</div>
                <div className="text-[9px] text-slate-500 font-bold mt-0.5">Режим Исполнителя</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={14} className="text-slate-400" />
              </div>
            </button>
          </div>
        ) : (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="glass-card p-2 rounded-[1.5rem] flex items-center group focus-within:border-blue-500/50 transition-all">
              <div className="w-10 h-10 flex items-center justify-center text-blue-500">
                <Link size={18} />
              </div>
              <input 
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Вставьте код приглашения..."
                className="bg-transparent border-none outline-none text-xs w-full py-4 font-bold placeholder:text-slate-600"
                autoFocus
              />
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => onSelect(UserRole.EXECUTOR, inviteCode)}
                className="w-full bg-blue-600 hover:bg-blue-500 p-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-30"
                disabled={!inviteCode}
              >
                Присоединиться к Matrix
              </button>
              <button 
                onClick={() => setShowInviteInput(false)}
                className="w-full text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] py-2 hover:text-white transition-colors"
              >
                Вернуться назад
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 py-6 text-[9px] text-slate-700 font-black uppercase tracking-[0.5em] z-10">
        Enterprise Edition 2025
      </div>
    </div>
  );
};

export default LoginScreen;
