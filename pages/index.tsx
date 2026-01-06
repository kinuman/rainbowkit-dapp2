import Head from 'next/head';
import { useEffect } from 'react';
import WalletConnect from '../components/WalletConnect';
import dynamic from 'next/dynamic';

const MapPanel = dynamic(() => import('../components/MapPanel'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 dark:bg-gray-950 animate-pulse" />
});
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { useAppStore } from '../lib/store';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const { tasks, setTasks } = useAppStore();

  useEffect(() => {
    // 初回のみサンプルデータをセット（永続化されている場合はスキップ）
    if (tasks.length === 0) {
      const sampleTasks = [
        {
          id: '1',
          title: 'コーヒーの買い出し代行',
          description: 'ハッカソン会場1Fのカフェでラテを買ってきてほしいです。',
          reward: '300',
          location: { lat: 35.6812, lng: 139.7671 },
          status: 'open' as const,
          author: '0x123...',
          timestamp: Date.now(),
        },
        {
          id: '2',
          title: '技術相談（React/Web3）',
          description: 'スマートコントラクトの接続で詰まっています。15分ほど相談に乗ってください。',
          reward: '500',
          location: { lat: 35.6842, lng: 139.7651 },
          status: 'open' as const,
          author: '0x456...',
          timestamp: Date.now() - 3600000,
        }
      ];
      setTasks(sampleTasks);
    }
  }, [setTasks, tasks.length]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300 font-sans selection:bg-green-100 selection:text-green-900">
      <Head>
        <title>HyperLocal | みんなで助け合う場所</title>
        <meta name="description" content="全世代にやさしいマイクロタスクプラットフォーム" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '24px',
            background: '#FFF',
            color: '#16a34a',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '16px 24px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
          }
        }}
      />

      {/* Header Area - Universal Style */}
      <header className="bg-white dark:bg-gray-900 p-4 shadow-sm z-30 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 pl-2">
          <div className="bg-green-600 p-2 rounded-2xl shadow-lg shadow-green-200 dark:shadow-none">
            <span className="text-2xl">🌲</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none text-gray-900 dark:text-white">HyperLocal</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Polygon Mainnet</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 pr-2">
          <WalletConnect />
        </div>
      </header>

      {/* Main Content Area - New Responsive Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Desktop Sidebar (Left) - Hidden on Mobile */}
        <aside className="w-[400px] hidden lg:block z-20 shadow-2xl relative h-full">
          <Sidebar />
        </aside>

        {/* Map Area - Rounded Window on Mobile */}
        <main className="flex-1 relative z-10 lg:m-4 m-0 rounded-none lg:rounded-[32px] overflow-hidden shadow-2xl border-0 lg:border border-gray-100 dark:border-gray-800">
          <MapPanel />

          {/* Spatial Info Overlay */}
          <div className="absolute top-6 left-6 z-20 pointer-events-none">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-[24px] shadow-lg border border-gray-100 dark:border-gray-700">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">現在の場所</p>
              <p className="text-base font-black text-gray-900 dark:text-white">ハッカソン会場周辺</p>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNav />
      </div>

      <style jsx global>{`
        body {
          overscroll-behavior-y: none;
        }
        .dark {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
}
