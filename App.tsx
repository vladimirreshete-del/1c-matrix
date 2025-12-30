
import React, { useState, useEffect } from 'react';
import { Task, TeamMember, UserRole } from './types';
import { NAVIGATION } from './constants';
import { api } from './services/api';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import TeamView from './components/TeamView';
import LoginScreen from './components/LoginScreen';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Attempt to get Telegram User ID
  const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
  const userId = tgUser?.id?.toString() || 'dev_user_123';

  useEffect(() => {
    // Load local auth state
    const savedRole = localStorage.getItem('1c_matrix_role') as UserRole;
    const savedTeamId = localStorage.getItem('1c_matrix_team_id');
    
    if (savedRole && savedRole !== UserRole.NONE) {
      setRole(savedRole);
      setTeamId(savedTeamId || userId);
      loadData(savedRole === UserRole.ADMIN ? userId : (savedTeamId || ''));
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadData = async (targetId: string) => {
    if (!targetId) return;
    setIsLoading(true);
    const data = await api.getData(targetId);
    setTasks(data.tasks);
    setTeam(data.team);
    setIsLoading(false);
  };

  const handleSelectRole = (selectedRole: UserRole, code?: string) => {
    const finalTeamId = selectedRole === UserRole.ADMIN ? userId : code || '';
    setRole(selectedRole);
    setTeamId(finalTeamId);
    localStorage.setItem('1c_matrix_role', selectedRole);
    localStorage.setItem('1c_matrix_team_id', finalTeamId);
    loadData(finalTeamId);
  };

  const syncData = (newTasks: Task[], newTeam: TeamMember[]) => {
    if (role === UserRole.ADMIN) {
      api.saveData(userId, { tasks: newTasks, team: newTeam });
    }
  };

  const handleAddTask = (task: Task) => {
    const updated = [task, ...tasks];
    setTasks(updated);
    syncData(updated, team);
  };

  const handleAddMember = (member: TeamMember) => {
    const updated = [...team, member];
    setTeam(updated);
    syncData(tasks, updated);
  };

  if (role === UserRole.NONE) {
    return <LoginScreen onSelect={handleSelectRole} />;
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#0F172A] text-slate-200 shadow-2xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="p-5 flex items-center justify-between z-10 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md">
        <div>
          <h1 className="text-xl font-black tracking-tighter text-white">1C MATRIX</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            {role === UserRole.ADMIN ? `Админ: ${userId}` : `Команда: ${teamId}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {role === UserRole.ADMIN && (
             <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-500/20">
               ID: {userId}
             </div>
          )}
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="text-slate-500 hover:text-white transition-colors"
          >
            Выйти
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto z-10 custom-scrollbar">
        {activeTab === 'dashboard' && <Dashboard tasks={tasks} team={team} />}
        {activeTab === 'tasks' && (
          <TasksView 
            tasks={tasks} 
            team={team} 
            onAddTask={handleAddTask} 
            isAdmin={role === UserRole.ADMIN}
            executorId={userId}
          />
        )}
        {activeTab === 'team' && (
          <TeamView 
            team={team} 
            onAddMember={handleAddMember} 
            isAdmin={role === UserRole.ADMIN} 
          />
        )}
      </main>

      {/* Modern Navigation */}
      <nav className="p-4 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center z-20">
        {NAVIGATION.map((nav) => (
          <button
            key={nav.id}
            onClick={() => setActiveTab(nav.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === nav.id ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {nav.icon}
            <span className="text-[10px] font-black uppercase tracking-tighter">{nav.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
