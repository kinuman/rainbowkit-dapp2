import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { useEffect } from 'react';
import { useWalletStore } from '../lib/store';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { setWallet, disconnect } = useWalletStore();
  
  // JPYC Contract on Polygon
  const JPYC_ADDRESS = '0x6AE7Dfc73E0dDE900d309A9FfC03c8d8617d5274';
  
  const { data: balanceData } = useBalance({
    address: address,
    token: JPYC_ADDRESS as `0x${string}`,
  });

  useEffect(() => {
    if (isConnected && address) {
      setWallet(address, balanceData?.formatted || '0');
    } else {
      disconnect();
    }
  }, [isConnected, address, balanceData, setWallet, disconnect]);

  return (
    <div className="flex items-center gap-3">
      <ConnectButton 
        showBalance={false}
        accountStatus="address"
        chainStatus="icon"
      />
      {isConnected && balanceData && (
        <div className="hidden sm:flex flex-col items-end bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5">
          <p className="text-[10px] uppercase tracking-wider opacity-70 leading-none">JPYC Balance</p>
          <p className="text-sm font-bold leading-tight">{balanceData.formatted} {balanceData.symbol}</p>
        </div>
      )}
    </div>
  );
}
