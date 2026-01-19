
import React, { useState, useEffect, useCallback } from 'react';
import { Task, TeamMember, UserRole } from './types';
import { NAVIGATION } from './constants';
import { api } from './services/api';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import TeamView from './components/TeamView';
import LoginScreen from './components/LoginScreen';
import { LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.NONE);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const tg = (window as any).Telegram?.WebApp;
  const userData = tg?.initDataUnsafe?.user;
  const userId = userData?.id?.toString() || 'user_dev';
  const userName = userData ? `${userData.first_name} ${userData.last_name || ''}`.trim() : 'Пользователь';
  const userAvatar = userData?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff`;
  const startParam = tg?.initDataUnsafe?.start_param;

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="app-container flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (role === UserRole.NONE) {
    return (
      <div className="app-container">
        <LoginScreen onSelect={(r, c) => {
          const tid = r === UserRole.ADMIN ? userId : (c || '');
          setRole(r); setTeamId(tid);
          localStorage.setItem('1c_matrix_role', r);
          localStorage.setItem('1c_matrix_team_id', tid);
          loadData(tid, r);
        }} />
      </div>
    );
  }

  // Fix: Defining NavItem with explicit props
  const NavItem = ({ nav, active, onClick }: { nav: typeof NAVIGATION[0], active: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 transition-all p-3 rounded-2xl w-full group ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
          : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
      }`}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {nav.icon}
      </div>
      <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest">{nav.label}</span>
    </button>
  );

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      {isDesktop && (
        <aside className="w-64 bg-[#020617] border-r border-white/5 flex flex-col p-6 shrink-0 h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-4 mb-8">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
               <span className="text-white font-black italic">1C</span>
             </div>
             <div>
               <h1 className="text-xs font-black text-white uppercase tracking-tighter">Matrix Engine</h1>
               <p className="text-[8px] text-slate-500 font-bold uppercase">v4.0 Enterprise</p>
             </div>
          </div>

          {/* User Profile Section - Moved UP */}
          <div className="flex items-center gap-3 mb-8 p-3 bg-slate-800/20 rounded-2xl border border-white/5">
            <img src={userAvatar} className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10" alt="" />
            <div className="min-w-0">
              <p className="text-[10px] font-black text-white truncate uppercase">{userName}</p>
              <p className="text-[8px] text-slate-500 font-bold truncate uppercase">{role === UserRole.ADMIN ? 'Administrator' : 'Executor'}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {NAVIGATION.map(nav => (
              <NavItem 
                key={nav.id} 
                nav={nav} 
                active={activeTab === nav.id} 
                onClick={() => setActiveTab(nav.id)} 
              />
            ))}
          </nav>

          {/* Footer / Logout */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Выйти</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile Header / Desktop Top Bar */}
        <header className={`p-4 flex items-center justify-between border-b border-white/5 bg-[#020617]/80 backdrop-blur-md shrink-0 pt-safe ${isDesktop ? 'px-8 py-6' : ''}`}>
          <div className="flex items-center gap-3">
            {!isDesktop && (
              <>
                <img src={userAvatar} className="w-8 h-8 rounded-lg object-cover" alt="User" />
                <div className="min-w-0">
                  <h1 className="text-[10px] font-black text-white uppercase leading-none">1C MATRIX</h1>
                  <p className="text-[8px] text-slate-500 font-bold uppercase truncate max-w-[120px]">
                    {role === UserRole.ADMIN ? userName : `ID: ${teamId}`}
                  </p>
                </div>
              </>
            )}
            {isDesktop && (
              <div>
                <h2 className="text-lg font-black text-white tracking-tight uppercase italic">
                  {NAVIGATION.find(n => n.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">System Overview / Active Node</p>
              </div>
            )}
          </div>
          
          {!isDesktop && (
            <button 
              onClick={handleLogout}
              className="text-[8px] font-black text-slate-500 border border-slate-800 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
            >ВЫЙТИ</button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#010409]">
          <div className={`mx-auto w-full ${isDesktop ? 'max-w-7xl p-8' : ''}`}>
            {activeTab === 'dashboard' && <Dashboard tasks={tasks} team={team} />}
            {activeTab === 'tasks' && (
              <TasksView 
                tasks={tasks} team={team} 
                onAddTask={t => { const u = [t, ...tasks]; setTasks(u); api.saveData(teamId!, {tasks:u, team}); }}
                onUpdateTask={t => { 
                  const updatedTasks = t.status === ('DELETED' as any) 
                    ? tasks.filter(x => x.id !== t.id)
                    : tasks.map(x => x.id === t.id ? t : x);
                  setTasks(updatedTasks); 
                  api.saveData(teamId!, {tasks:updatedTasks, team}); 
                }}
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
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        {!isDesktop && (
          <nav className="p-3 bg-[#020617] border-t border-white/5 flex justify-around items-center shrink-0 pb-safe">
            {NAVIGATION.map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id)}
                className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${activeTab === nav.id ? 'text-blue-500' : 'text-slate-600'}`}
              >
                <div className={`p-2 rounded-xl transition-all ${activeTab === nav.id ? 'bg-blue-500/10 scale-110' : ''}`}>{nav.icon}</div>
                <span className="text-[7px] font-black uppercase tracking-widest">{nav.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};

export default App;
