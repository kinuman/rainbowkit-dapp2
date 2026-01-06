import Head from 'next/head';
import TransactionHistory from '../components/TransactionHistory';
import BottomNav from '../components/BottomNav';
import WalletConnect from '../components/WalletConnect';

export default function HistoryPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 font-sans">
            <Head>
                <title>履歴 | HyperLocal</title>
            </Head>

            <header className="bg-white dark:bg-gray-900 p-4 shadow-sm sticky top-0 z-30 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-xl font-black text-gray-900 dark:text-white">HyperLocal</h1>
                <WalletConnect />
            </header>

            <main className="p-4 max-w-md mx-auto">
                <TransactionHistory />
            </main>

            <BottomNav />
        </div>
    );
}
