
import React from 'react';
import { Task, TeamMember, TaskStatus } from '../types';
import { Briefcase, Users, CheckCircle, ArrowUpRight } from 'lucide-react';

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
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black italic tracking-tighter mb-2">MATRIX CLOUD</h2>
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest opacity-80">Ваша рабочая экосистема</p>
          
          <div className="mt-8 flex gap-6">
             <div>
               <div className="text-3xl font-black">{tasks.length}</div>
               <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">Всего задач</div>
             </div>
             <div className="w-px h-10 bg-white/20 self-center" />
             <div>
               <div className="text-3xl font-black">{completed}</div>
               <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">Завершено</div>
             </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-sm">
           <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-4">
             <Users size={20} />
           </div>
           <div className="text-2xl font-black text-white">{team.length}</div>
           <div className="text-[10px] font-bold uppercase text-slate-500">Команда</div>
        </div>
        <div className="bg-slate-800/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-sm">
           <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-4">
             <CheckCircle size={20} />
           </div>
           <div className="text-2xl font-black text-white">{active}</div>
           <div className="text-[10px] font-bold uppercase text-slate-500">В работе</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-slate-800/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Эффективность</h3>
          <ArrowUpRight size={16} className="text-slate-600" />
        </div>
        <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" 
            style={{ width: `${tasks.length > 0 ? (completed / tasks.length) * 100 : 0}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 mt-3 font-bold">
          {tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0}% задач выполнено в срок
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
