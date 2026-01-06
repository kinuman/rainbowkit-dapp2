import Head from 'next/head';
import TransferForm from '../components/TransferForm';
import BottomNav from '../components/BottomNav';
import WalletConnect from '../components/WalletConnect';
import { Coins } from 'lucide-react';

export default function Pay() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 font-sans">
            <Head>
                <title>お礼を払う | HyperLocal</title>
            </Head>

            <header className="bg-white dark:bg-gray-900 p-4 shadow-sm sticky top-0 z-30 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <h1 className="text-xl font-black text-gray-900 dark:text-white">HyperLocal</h1>
                <WalletConnect />
            </header>

            <main className="p-4 max-w-md mx-auto">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 mb-6 border border-blue-100 dark:border-blue-900/30">
                    <h4 className="text-blue-800 dark:text-blue-400 text-lg font-black mb-2 flex items-center gap-2">
                        <Coins size={24} />
                        お礼を払う
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300 font-bold leading-relaxed">
                        助けてくれた人にお礼を送りましょう。
                    </p>
                </div>
                <TransferForm />
            </main>

            <BottomNav />
        </div>
    );
}
