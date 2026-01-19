
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
    <div className="p-4 lg:p-0 space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-14 text-white premium-shadow relative overflow-hidden group">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-indigo-400/20 blur-[40px] rounded-full" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-blue-200" />
            <p className="text-blue-100 text-[10px] lg:text-xs font-black uppercase tracking-[0.25em] opacity-80">
              Ваша рабочая экосистема / Node-01
            </p>
          </div>
          <h2 className="text-4xl lg:text-7xl font-black italic tracking-tighter mb-8 lg:mb-12 leading-none">
            MATRIX<br/>CLOUD
          </h2>
          
          <div className="flex gap-10 lg:gap-20 items-end">
             <div className="space-y-1">
               <div className="text-4xl lg:text-6xl font-black tracking-tighter leading-none">{tasks.length}</div>
               <div className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest opacity-60">Всего задач</div>
             </div>
             <div className="w-[1px] h-10 lg:h-14 bg-white/20" />
             <div className="space-y-1">
               <div className="text-4xl lg:text-6xl font-black tracking-tighter leading-none text-blue-200">{completed}</div>
               <div className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest opacity-60">Завершено</div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Stats */}
        <div className="space-y-6 lg:space-y-8">
            <div className="glass-card p-6 lg:p-8 rounded-[2.2rem] h-full">
               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/10">
                 <Users size={22} />
               </div>
               <div className="text-3xl lg:text-4xl font-black text-white tracking-tighter">{team.length}</div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Команда</div>
            </div>
            
            <div className="glass-card p-6 lg:p-8 rounded-[2.2rem] h-full">
               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 mb-6 border border-amber-500/10">
                 <Briefcase size={22} />
               </div>
               <div className="text-3xl lg:text-4xl font-black text-white tracking-tighter">{active}</div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">В работе</div>
            </div>
        </div>
        
        {/* Right Column (Span 2): Efficiency & Tabs */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
            
            {/* Efficiency Progress */}
            <div className="glass-card p-6 lg:p-8 rounded-[2.2rem]">
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                  <h3 className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic leading-none">Эффективность</h3>
                  <p className="text-base lg:text-lg text-white font-bold tracking-tighter">Месячный KPI</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                  <ArrowUpRight size={22} />
                </div>
              </div>
              
              <div className="h-4 lg:h-5 w-full bg-slate-800/50 rounded-full overflow-hidden mb-4 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-1000" 
                  style={{ width: `${tasks.length > 0 ? (completed / tasks.length) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0}% успеха
                </p>
                <span className="text-[10px] text-blue-400 font-black">+{completed} готово</span>
              </div>
            </div>

            {/* Quick Access Tabs - Moved here */}
            <div className="hidden lg:grid grid-cols-3 gap-6 lg:gap-8 flex-1">
                {[
                  { title: "Уведомления", value: "0", icon: <TrendingUp size={18} />, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { title: "Дедлайны", value: "0", icon: <TrendingUp size={18} />, color: "text-red-500", bg: "bg-red-500/10" },
                  { title: "Чат", value: "12", icon: <TrendingUp size={18} />, color: "text-emerald-500", bg: "bg-emerald-500/10" }
                ].map((item, i) => (
                  <div key={i} className="glass-card p-6 rounded-[2rem] flex flex-col justify-between border-b-2 border-b-transparent hover:border-b-blue-500 transition-all group h-full">
                     <div className="flex items-start justify-between w-full mb-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 truncate min-w-0 pr-2">{item.title}</p>
                        <div className={`${item.color} ${item.bg} p-2 rounded-xl`}>{item.icon}</div>
                     </div>
                     <p className="text-3xl font-black text-white">{item.value}</p>
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
