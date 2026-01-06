import { useState } from 'react';
import { useAppStore, useWalletStore } from '../lib/store';
import { MapPin, Clock, PlusCircle, Sun, Moon, CheckCircle2, MessageSquare } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Sidebar() {
  const { tasks, addTask, currentLocation } = useAppStore();
  const { address } = useWalletStore();
  const { theme, setTheme } = useTheme();

  const [newTitle, setNewTitle] = useState('');
  const [newReward, setNewReward] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddTask = () => {
    if (!newTitle || !newReward) return;

    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      description: newDescription || '新しく追加されたおねがいです。',
      reward: newReward,
      location: currentLocation || { lat: 35.6812, lng: 139.7671 },
      status: 'open' as const,
      author: address || '0xUnknown',
      timestamp: Date.now(),
    };

    addTask(newTask);
    setNewTitle('');
    setNewReward('');
    setNewDescription('');
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            HyperLocal 掲示板
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
            地域のみんなで助け合う
          </p>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:scale-110 transition-all"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-3xl p-6 border border-green-100 dark:border-green-900/30 mb-6">
          <h3 className="text-lg font-black text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
            <PlusCircle size={24} />
            おねがいを投稿
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="タイトル（例：荷物運びを手伝って）"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-900/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 dark:text-white font-bold"
            />
            <textarea
              placeholder="詳細内容を入力してください"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-900/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 dark:text-white font-bold h-20 resize-none"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="お礼 (JPYC)"
                value={newReward}
                onChange={(e) => setNewReward(e.target.value)}
                className="flex-1 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-900/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 dark:text-white font-bold"
              />
              <button
                onClick={handleAddTask}
                className="bg-green-600 hover:bg-green-700 text-white font-black px-6 py-3 rounded-2xl shadow-lg transition-all active:scale-95 whitespace-nowrap"
              >
                投稿
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="font-black text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2">
            <MessageSquare size={20} className="text-green-600" />
            近くの投稿
          </h3>
          <span className="text-sm font-black text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
            {tasks.length}件
          </span>
        </div>

        <div className="space-y-4">
          {tasks.length === 0 && (
            <div className="text-center py-10 text-gray-400 font-bold text-sm">
              近くに投稿はありません
            </div>
          )}
          {tasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-black text-gray-900 dark:text-white text-lg">
                  {task.title}
                </h4>
                <span className="text-green-600 dark:text-green-400 text-xl font-black">
                  {task.reward} <span className="text-xs">JPYC</span>
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-bold leading-relaxed">
                {task.description}
              </p>
              <div className="flex items-center gap-4 text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{new Date(task.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <CheckCircle2 size={14} />
                  <span>あんしん決済</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-black py-3 rounded-2xl hover:bg-green-600 hover:text-white transition-all">
                詳細を見る
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
