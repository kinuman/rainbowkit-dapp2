import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'HyperLocal',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [polygon],
  ssr: true,
});

// Validate projectId is set
if (process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID === 'YOUR_PROJECT_ID' || !process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.warn('⚠️ Warning: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not configured. Please set it in .env.local');
}
