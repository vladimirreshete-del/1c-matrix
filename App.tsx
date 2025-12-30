
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

  const tg = (window as any).Telegram?.WebApp;
  const userId = tg?.initDataUnsafe?.user?.id?.toString() || 'dev_user_123';
  const startParam = tg?.initDataUnsafe?.start_param; // Код из ссылки t.me/bot/app?startapp=CODE

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      tg.headerColor = '#0F172A';
      tg.backgroundColor = '#0F172A';
    }

    const savedRole = localStorage.getItem('1c_matrix_role') as UserRole;
    const savedTeamId = localStorage.getItem('1c_matrix_team_id');
    
    // Если есть параметр в ссылке, приоритет ему (вход для исполнителя)
    if (startParam) {
      handleSelectRole(UserRole.EXECUTOR, startParam);
    } else if (savedRole && savedRole !== UserRole.NONE) {
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
    try {
      const data = await api.getData(targetId);
      setTasks(data.tasks || []);
      setTeam(data.team || []);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setIsLoading(false);
    }
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

  const handleUpdateTask = (updatedTask: Task) => {
    const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
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
      <div className="h-screen bg-[#0F172A] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 font-bold animate-pulse">MATRIX 1C LOADING...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#0F172A] text-slate-200 shadow-2xl relative overflow-hidden">
      <header className="p-4 flex items-center justify-between z-10 border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md">
        <div>
          <h1 className="text-lg font-black tracking-tighter text-white">1C MATRIX</h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            {role === UserRole.ADMIN ? `ID: ${userId}` : `Team ID: ${teamId}`}
          </p>
        </div>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="text-[9px] font-bold text-slate-500 border border-slate-800 px-2 py-1 rounded hover:text-red-400 transition-colors"
        >
          ВЫЙТИ
        </button>
      </header>

      <main className="flex-1 overflow-y-auto z-10 custom-scrollbar">
        {activeTab === 'dashboard' && <Dashboard tasks={tasks} team={team} />}
        {activeTab === 'tasks' && (
          <TasksView 
            tasks={tasks} 
            team={team} 
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            isAdmin={role === UserRole.ADMIN}
            executorId={userId}
          />
        )}
        {activeTab === 'team' && (
          <TeamView 
            team={team} 
            onAddMember={handleAddMember} 
            isAdmin={role === UserRole.ADMIN}
            adminId={userId}
          />
        )}
      </main>

      <nav className="p-3 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center z-20">
        {NAVIGATION.map((nav) => (
          <button
            key={nav.id}
            onClick={() => setActiveTab(nav.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === nav.id ? 'text-blue-500 scale-105' : 'text-slate-500'
            }`}
          >
            {nav.icon}
            <span className="text-[9px] font-black uppercase tracking-tighter">{nav.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
