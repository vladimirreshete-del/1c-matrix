
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
  const userData = tg?.initDataUnsafe?.user;
  const userId = userData?.id?.toString() || 'dev_user_123';
  const userName = userData ? `${userData.first_name} ${userData.last_name || ''}`.trim() : 'Администратор';
  const userAvatar = userData?.photo_url || `https://picsum.photos/seed/${userId}/100/100`;
  const startParam = tg?.initDataUnsafe?.start_param;

  useEffect(() => {
    if (startParam && role === UserRole.NONE) {
      handleSelectRole(UserRole.EXECUTOR, startParam);
    } else {
      const savedRole = localStorage.getItem('1c_matrix_role') as UserRole;
      const savedTeamId = localStorage.getItem('1c_matrix_team_id');
      
      if (savedRole && savedRole !== UserRole.NONE) {
        setRole(savedRole);
        setTeamId(savedTeamId || userId);
        loadData(savedRole === UserRole.ADMIN ? userId : (savedTeamId || ''), savedRole);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const loadData = async (targetId: string, currentRole: UserRole) => {
    if (!targetId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.getData(targetId);
      let currentTasks = data.tasks || [];
      let currentTeam = data.team || [];

      // Синхронизация профиля текущего пользователя
      const currentUserProfile: TeamMember = {
        id: userId,
        name: userName,
        role: currentRole === UserRole.ADMIN ? 'Владелец' : 'Участник',
        systemRole: currentRole,
        email: userData?.username ? `@${userData.username}` : 'tg-user',
        avatar: userAvatar
      };

      if (currentRole === UserRole.EXECUTOR) {
        const isAlreadyInTeam = currentTeam.some((m: TeamMember) => m.id === userId);
        if (!isAlreadyInTeam) {
          currentTeam = [...currentTeam, currentUserProfile];
          await api.saveData(targetId, { tasks: currentTasks, team: currentTeam });
        }
      } else if (currentRole === UserRole.ADMIN) {
        // Если это админ, обновляем его данные в списке команды (аватарку и имя из ТГ)
        const adminIndex = currentTeam.findIndex((m: TeamMember) => m.id === userId || m.systemRole === UserRole.ADMIN);
        if (adminIndex === -1) {
          currentTeam = [currentUserProfile, ...currentTeam.filter((m: any) => m.id !== '1')];
        } else {
          currentTeam[adminIndex] = { ...currentTeam[adminIndex], ...currentUserProfile };
        }
        await api.saveData(targetId, { tasks: currentTasks, team: currentTeam });
      }

      setTasks(currentTasks);
      setTeam(currentTeam);
    } catch (err) {
      console.error("Data load error", err);
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
    loadData(finalTeamId, selectedRole);
  };

  const syncData = (newTasks: Task[], newTeam: TeamMember[]) => {
    const targetId = role === UserRole.ADMIN ? userId : teamId;
    if (targetId) {
      const filteredTasks = newTasks.filter(t => (t as any).status !== 'DELETED');
      api.saveData(targetId, { tasks: filteredTasks, team: newTeam });
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updated = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    setTasks(updated);
    syncData(updated, team);
  };

  const handleAddTask = (task: Task) => {
    const updated = [task, ...tasks];
    setTasks(updated);
    syncData(updated, team);
  };

  const handleUpdateTeam = (newTeam: TeamMember[]) => {
    setTeam(newTeam);
    syncData(tasks, newTeam);
  };

  if (role === UserRole.NONE) {
    return <LoginScreen onSelect={handleSelectRole} />;
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-[#0F172A] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[10px] font-bold text-blue-500 uppercase tracking-widest">Загрузка Matrix...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#0F172A] text-slate-200 relative overflow-hidden">
      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <img src={userAvatar} className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10" alt="Avatar" />
          <div>
            <h1 className="text-xs font-black tracking-tighter text-white uppercase leading-none">1C MATRIX</h1>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              {role === UserRole.ADMIN ? `Владелец: ${userName}` : `Команда: ${teamId}`}
            </p>
          </div>
        </div>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="text-[9px] font-bold text-slate-500 border border-slate-800 px-2 py-1 rounded active:bg-white/5 transition-colors"
        >ВЫЙТИ</button>
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
            onAddMember={handleAddTask as any}
            onUpdateTeam={handleUpdateTeam}
            isAdmin={role === UserRole.ADMIN}
            adminId={userId}
            allTasks={tasks}
          />
        )}
      </main>

      <nav className="p-3 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center z-30 pb-safe">
        {NAVIGATION.map((nav) => (
          <button
            key={nav.id}
            onClick={() => setActiveTab(nav.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
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
