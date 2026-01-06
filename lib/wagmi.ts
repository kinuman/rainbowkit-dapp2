import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'HyperLocal',
  projectId: 'YOUR_PROJECT_ID', // In a real app, this would be an env var
  chains: [polygon],
  ssr: true,
});
