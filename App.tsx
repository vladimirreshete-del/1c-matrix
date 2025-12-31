
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const loadingTimeoutRef = useRef<number | null>(null);

  // Безопасное получение данных Telegram
  const tg = (window as any).Telegram?.WebApp;
  const userData = tg?.initDataUnsafe?.user;
  const userId = userData?.id?.toString() || 'user_dev';
  const userName = userData ? `${userData.first_name} ${userData.last_name || ''}`.trim() : 'Пользователь';
  const userAvatar = userData?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff`;
  const startParam = tg?.initDataUnsafe?.start_param;

  const loadData = useCallback(async (targetId: string, currentRole: UserRole) => {
    if (!targetId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // Таймаут на запрос к API, чтобы не ждать вечно
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const data = await api.getData(targetId);
      clearTimeout(timeoutId);

      let currentTasks = Array.isArray(data.tasks) ? data.tasks : [];
      let currentTeam = Array.isArray(data.team) ? data.team : [];

      const currentUserProfile: TeamMember = {
        id: userId,
        name: userName,
        role: currentRole === UserRole.ADMIN ? 'Владелец' : 'Участник',
        systemRole: currentRole,
        email: userData?.username ? `@${userData.username}` : 'id' + userId,
        avatar: userAvatar
      };

      if (currentRole === UserRole.EXECUTOR) {
        const isAlreadyInTeam = currentTeam.some((m: TeamMember) => m.id === userId);
        if (!isAlreadyInTeam) {
          currentTeam = [...currentTeam, currentUserProfile];
          await api.saveData(targetId, { tasks: currentTasks, team: currentTeam });
        }
      } else if (currentRole === UserRole.ADMIN) {
        const adminIndex = currentTeam.findIndex((m: TeamMember) => m.id === userId || m.systemRole === UserRole.ADMIN);
        if (adminIndex === -1) {
          currentTeam = [currentUserProfile, ...currentTeam];
        } else {
          currentTeam[adminIndex] = { ...currentTeam[adminIndex], ...currentUserProfile };
        }
        await api.saveData(targetId, { tasks: currentTasks, team: currentTeam });
      }

      setTasks(currentTasks);
      setTeam(currentTeam);
    } catch (err) {
      console.error("Data Load Error:", err);
      // Если это первый запуск или ошибка сети, всё равно пускаем в приложение
    } finally {
      setIsLoading(false);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    }
  }, [userId, userName, userAvatar, userData?.username]);

  useEffect(() => {
    // ПРЕДОХРАНИТЕЛЬ: Если через 5 секунд приложение всё еще грузится - выключаем лоадер принудительно
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (isLoading) {
        console.warn("Loading safety timeout triggered");
        setIsLoading(false);
      }
    }, 5000);

    const initApp = async () => {
      try {
        if (startParam) {
          setRole(UserRole.EXECUTOR);
          setTeamId(startParam);
          localStorage.setItem('1c_matrix_role', UserRole.EXECUTOR);
          localStorage.setItem('1c_matrix_team_id', startParam);
          await loadData(startParam, UserRole.EXECUTOR);
        } else {
          const savedRole = localStorage.getItem('1c_matrix_role') as UserRole;
          const savedTeamId = localStorage.getItem('1c_matrix_team_id');
          
          if (savedRole && savedRole !== UserRole.NONE && savedTeamId) {
            setRole(savedRole);
            setTeamId(savedTeamId);
            await loadData(savedTeamId, savedRole);
          } else {
            setIsLoading(false);
          }
        }
      } catch (e) {
        console.error("Init Error", e);
        setIsLoading(false);
      }
    };

    initApp();
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, [startParam, loadData]);

  const handleSelectRole = (selectedRole: UserRole, code?: string) => {
    const finalTeamId = selectedRole === UserRole.ADMIN ? userId : (code || '');
    if (!finalTeamId && selectedRole === UserRole.EXECUTOR) {
      alert('Необходим код приглашения');
      return;
    }
    setRole(selectedRole);
    setTeamId(finalTeamId);
    localStorage.setItem('1c_matrix_role', selectedRole);
    localStorage.setItem('1c_matrix_team_id', finalTeamId);
    loadData(finalTeamId, selectedRole);
  };

  const syncData = (newTasks: Task[], newTeam: TeamMember[]) => {
    const targetId = role === UserRole.ADMIN ? userId : teamId;
    if (targetId) {
      const activeTasks = newTasks.filter(t => (t as any).status !== 'DELETED');
      api.saveData(targetId, { tasks: activeTasks, team: newTeam });
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-[100]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(37,99,235,0.3)]"></div>
        <div className="text-center animate-pulse">
          <h1 className="text-white font-black italic text-2xl tracking-tighter">1C MATRIX</h1>
          <p className="text-[10px] font-bold text-blue-500/80 uppercase tracking-[0.4em] mt-2">Initializing System...</p>
        </div>
      </div>
    );
  }

  if (role === UserRole.NONE) {
    return <LoginScreen onSelect={handleSelectRole} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#020617] text-slate-200 relative overflow-hidden">
      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-[#020617]/90 backdrop-blur-md z-30 pt-safe">
        <div className="flex items-center gap-3">
          <img 
            src={userAvatar} 
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10" 
            onError={(e) => { (e.target as any).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`; }}
            alt="User" 
          />
          <div className="min-w-0">
            <h1 className="text-xs font-black tracking-tighter text-white uppercase leading-none">1C MATRIX</h1>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1 truncate max-w-[140px]">
              {role === UserRole.ADMIN ? userName : `ID: ${teamId}`}
            </p>
          </div>
        </div>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="text-[8px] font-black text-slate-500 border border-slate-800 px-3 py-2 rounded-xl active:bg-white/5 transition-all uppercase tracking-tighter"
        >Выйти</button>
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

      <nav className="p-4 bg-[#020617]/95 backdrop-blur-3xl border-t border-white/5 flex justify-around items-center z-30 pb-safe">
        {NAVIGATION.map((nav) => (
          <button
            key={nav.id}
            onClick={() => setActiveTab(nav.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              activeTab === nav.id ? 'text-blue-500 scale-110' : 'text-slate-600'
            }`}
          >
            <div className={`p-2.5 rounded-2xl transition-all ${activeTab === nav.id ? 'bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : ''}`}>
              {nav.icon}
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.1em]">{nav.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
