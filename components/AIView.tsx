
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { geminiService } from '../services/geminiService';
import { Sparkles, Brain, Loader2, RefreshCw, Wand2, CheckCircle, AlertCircle } from 'lucide-react';

interface Props {
  tasks: Task[];
  teamCount: number;
  onUpdateTask?: (task: Task) => void;
}

const AIView: React.FC<Props> = ({ tasks, teamCount, onUpdateTask }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  
  // Task Optimizer state
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<{ title: string, description: string } | null>(null);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const fetchInsight = async () => {
    setLoadingInsight(true);
    try {
      const res = await geminiService.suggestTeamSynergy(tasks, teamCount);
      setInsight(res);
    } catch (err) {
      setInsight('Не удалось связаться с Matrix AI. Попробуйте позже.');
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleOptimizeTask = async () => {
    const taskToOptimize = tasks.find(t => t.id === selectedTaskId);
    if (!taskToOptimize) return;

    setOptimizing(true);
    setOptimizedResult(null);
    setUpdateStatus('idle');
    try {
      const result = await geminiService.optimizeTaskDescription(taskToOptimize.title, taskToOptimize.description);
      setOptimizedResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizing(false);
    }
  };

  const handleApplyOptimization = () => {
    const originalTask = tasks.find(t => t.id === selectedTaskId);
    if (!originalTask || !optimizedResult || !onUpdateTask) return;

    const updatedTask: Task = {
      ...originalTask,
      title: optimizedResult.title,
      description: optimizedResult.description
    };

    onUpdateTask(updatedTask);
    setUpdateStatus('success');
    setTimeout(() => {
      setOptimizedResult(null);
      setSelectedTaskId('');
      setUpdateStatus('idle');
    }, 2000);
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  return (
    <div className="p-4 space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-indigo-900 rounded-3xl p-8 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(67,56,202,1)_0%,rgba(0,0,0,0)_50%)]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-indigo-500/30 p-4 rounded-2xl mb-4 backdrop-blur-sm ring-1 ring-white/20">
            <Sparkles size={40} className="text-indigo-200" />
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter">MATRIX AI</h2>
          <p className="text-indigo-200 text-xs mt-2 uppercase font-bold tracking-widest">Neural Business Assistant</p>
        </div>
      </div>

      {/* Efficiency Analysis Section */}
      <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-900 font-bold">
            <Brain size={18} />
            <span>Анализ эффективности</span>
          </div>
          <button 
            disabled={loadingInsight}
            onClick={fetchInsight}
            className="text-indigo-600 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loadingInsight ? 'animate-spin' : ''} />
          </button>
        </div>

        {loadingInsight ? (
          <div className="flex flex-col items-center justify-center text-gray-400 space-y-2 py-8">
            <Loader2 className="animate-spin" />
            <span className="text-xs font-medium">Синхронизация нейросети...</span>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-700 leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50 rounded-r-lg">
              {insight}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Риск выгорания</p>
                <p className="text-lg font-black text-green-600 tracking-tighter uppercase">Низкий</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Загрузка</p>
                <p className="text-lg font-black text-blue-600 tracking-tighter uppercase">Оптимально</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Optimizer Section */}
      <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm flex flex-col">
        <div className="flex items-center gap-2 text-indigo-900 font-bold mb-4">
          <Wand2 size={18} className="text-sbis-accent" />
          <span>Умный Оптимизатор Задач</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Выберите задачу для улучшения</label>
            <select 
              value={selectedTaskId}
              onChange={(e) => {
                setSelectedTaskId(e.target.value);
                setOptimizedResult(null);
                setUpdateStatus('idle');
              }}
              className="w-full bg-gray-50 border border-sbis-border p-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">-- Выберите задачу --</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </div>

          {selectedTaskId && !optimizedResult && (
            <button
              onClick={handleOptimizeTask}
              disabled={optimizing}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {optimizing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {optimizing ? 'Нейросеть думает...' : 'Улучшить с Matrix AI'}
            </button>
          )}

          {optimizedResult && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-400">Результат оптимизации</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                    <Sparkles size={12} />
                    AI-Powered
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-900">Новый заголовок:</h4>
                  <p className="text-sm font-semibold text-gray-800">{optimizedResult.title}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-900">Описание:</h4>
                  <div className="text-xs text-gray-600 whitespace-pre-wrap bg-white/50 p-2 rounded border border-indigo-50 mt-1">
                    {optimizedResult.description}
                  </div>
                </div>
              </div>

              {updateStatus === 'success' ? (
                <div className="bg-green-100 text-green-700 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm animate-bounce">
                  <CheckCircle size={18} />
                  Задача успешно обновлена!
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setOptimizedResult(null)}
                    className="flex-1 bg-gray-100 text-gray-500 p-3 rounded-xl font-bold text-sm hover:bg-gray-200"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleApplyOptimization}
                    className="flex-[2] bg-sbis-accent text-white p-3 rounded-xl font-bold text-sm hover:bg-orange-600 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <CheckCircle size={18} />
                    Применить изменения
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feature Badges */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Дополнительные AI-функции</h3>
        {[
          { icon: <AlertCircle size={16} />, title: "Прогноз дедлайнов", desc: "Анализ вероятности задержек (в разработке)" },
          { icon: <Sparkles size={16} />, title: "Генератор отчетов", desc: "Автоматизация еженедельных дайджестов" }
        ].map((feat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 opacity-50 cursor-not-allowed group">
            <div className="bg-gray-100 p-2 rounded-lg text-gray-400 group-hover:scale-110 transition-transform">
              {feat.icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-700">{feat.title}</h4>
              <p className="text-[10px] text-gray-400 font-medium">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIView;
