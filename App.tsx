
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
      const data = await api.getData(targetId);
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
        if (!currentTeam.some(m => m.id === userId)) {
          currentTeam = [...currentTeam, currentUserProfile];
          await api.saveData(targetId, { tasks: currentTasks, team: currentTeam });
        }
      } else if (currentRole === UserRole.ADMIN) {
        const adminIndex = currentTeam.findIndex(m => m.id === userId || m.systemRole === UserRole.ADMIN);
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
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userName, userAvatar, userData?.username]);

  useEffect(() => {
    const initApp = async () => {
      if (startParam) {
        setRole(UserRole.EXECUTOR);
        setTeamId(startParam);
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
    };
    initApp();
  }, [startParam, loadData]);

  if (isLoading) {
    return (
      <div className="app-container flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (role === UserRole.NONE) {
    return <div className="app-container"><LoginScreen onSelect={(r, c) => {
      const tid = r === UserRole.ADMIN ? userId : (c || '');
      setRole(r); setTeamId(tid);
      localStorage.setItem('1c_matrix_role', r);
      localStorage.setItem('1c_matrix_team_id', tid);
      loadData(tid, r);
    }} /></div>;
  }

  return (
    <div className="app-container">
      <header className="p-4 flex items-center justify-between border-b border-white/5 bg-[#020617] shrink-0 pt-safe">
        <div className="flex items-center gap-3">
          <img src={userAvatar} className="w-8 h-8 rounded-lg object-cover" alt="User" />
          <div className="min-w-0">
            <h1 className="text-[10px] font-black text-white uppercase leading-none">1C MATRIX</h1>
            <p className="text-[8px] text-slate-500 font-bold uppercase truncate max-w-[120px]">
              {role === UserRole.ADMIN ? userName : `ID: ${teamId}`}
            </p>
          </div>
        </div>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="text-[8px] font-black text-slate-500 border border-slate-800 px-3 py-1.5 rounded-lg"
        >ВЫЙТИ</button>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'dashboard' && <Dashboard tasks={tasks} team={team} />}
        {activeTab === 'tasks' && (
          <TasksView 
            tasks={tasks} team={team} 
            onAddTask={t => { const u = [t, ...tasks]; setTasks(u); api.saveData(teamId!, {tasks:u, team}); }}
            onUpdateTask={t => { const u = tasks.map(x => x.id === t.id ? t : x).filter(x => (x as any).status !== 'DELETED'); setTasks(u); api.saveData(teamId!, {tasks:u, team}); }}
            isAdmin={role === UserRole.ADMIN} executorId={userId}
          />
        )}
        {activeTab === 'team' && (
          <TeamView 
            team={team} 
            onUpdateTeam={t => { setTeam(t); api.saveData(teamId!, {tasks, team:t}); }}
            isAdmin={role === UserRole.ADMIN} adminId={userId} allTasks={tasks}
          />
        )}
      </main>

      <nav className="p-4 bg-[#020617] border-t border-white/5 flex justify-around items-center shrink-0 pb-safe">
        {NAVIGATION.map((nav) => (
          <button
            key={nav.id}
            onClick={() => setActiveTab(nav.id)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === nav.id ? 'text-blue-500' : 'text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === nav.id ? 'bg-blue-500/10' : ''}`}>{nav.icon}</div>
            <span className="text-[8px] font-black uppercase tracking-widest">{nav.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
