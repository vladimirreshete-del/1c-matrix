
import React from 'react';
import { Task, TeamMember, TaskStatus } from '../types';
import { Briefcase, Users, CheckCircle, ArrowUpRight, TrendingUp } from 'lucide-react';

interface Props {
  tasks: Task[];
  team: TeamMember[];
}

const Dashboard: React.FC<Props> = ({ tasks, team }) => {
  const completed = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const active = tasks.filter(t => t.status !== TaskStatus.DONE).length;

  return (
    <div className="p-5 space-y-6">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white premium-shadow relative overflow-hidden group">
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-indigo-400/20 blur-[40px] rounded-full" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-blue-200" />
            <p className="text-blue-100 text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Ваша рабочая экосистема</p>
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter mb-8 leading-none">MATRIX<br/>CLOUD</h2>
          
          <div className="flex gap-10 items-end">
             <div className="space-y-1">
               <div className="text-4xl font-black tracking-tighter leading-none">{tasks.length}</div>
               <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Всего задач</div>
             </div>
             <div className="w-[1px] h-8 bg-white/20" />
             <div className="space-y-1">
               <div className="text-4xl font-black tracking-tighter leading-none text-blue-200">{completed}</div>
               <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Завершено</div>
             </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-6 rounded-[2.2rem]">
           <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-4 border border-blue-500/10">
             <Users size={20} />
           </div>
           <div className="text-2xl font-black text-white tracking-tighter">{team.length}</div>
           <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Команда</div>
        </div>
        <div className="glass-card p-6 rounded-[2.2rem]">
           <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/10">
             <CheckCircle size={20} />
           </div>
           <div className="text-2xl font-black text-white tracking-tighter">{active}</div>
           <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">В работе</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="glass-card p-6 rounded-[2.2rem]">
        <div className="flex justify-between items-center mb-5">
          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Эффективность</h3>
            <p className="text-[14px] text-white font-bold tracking-tighter">Месячный KPI</p>
          </div>
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
            <ArrowUpRight size={18} />
          </div>
        </div>
        
        <div className="h-2.5 w-full bg-slate-800/50 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-1000" 
            style={{ width: `${tasks.length > 0 ? (completed / tasks.length) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            {tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0}% успеха
          </p>
          <span className="text-[9px] text-blue-400 font-black">+{completed} готово</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
