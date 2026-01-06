import Link from 'next/link';
import { useRouter } from 'next/router';
import { MapPin, Coins, History } from 'lucide-react';

export default function BottomNav() {
    const router = useRouter();

    const isActive = (path: string) => router.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-around px-6 z-50">
            <Link href="/" className={`flex flex-col items-center gap-1 transition-all ${isActive('/') ? 'text-green-600 scale-110' : 'text-gray-400'}`}>
                <MapPin size={28} />
                <span className="text-[10px] font-black">おねがい</span>
            </Link>
            <Link href="/pay" className={`flex flex-col items-center gap-1 transition-all ${isActive('/pay') ? 'text-green-600 scale-110' : 'text-gray-400'}`}>
                <Coins size={28} />
                <span className="text-[10px] font-black">払う</span>
            </Link>
            <Link href="/history" className={`flex flex-col items-center gap-1 transition-all ${isActive('/history') ? 'text-green-600 scale-110' : 'text-gray-400'}`}>
                <History size={28} />
                <span className="text-[10px] font-black">履歴</span>
            </Link>
        </div>
    );
}
