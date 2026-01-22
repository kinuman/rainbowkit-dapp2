import { ethers } from 'ethers';

const JPYC_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

// Fixed typo in default address (o -> 0)
const DEFAULT_JPYC_CONTRACT = '0x6AE7Dfc73E0dDE900d309A9FfC03c8d8617d5274';

export async function connectWallet() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMaskがインストールされていません');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    return { provider, signer, address };
  } catch (error: any) {
    throw new Error(`ウォレット接続失敗: ${error.message}`);
  }
}

export async function getJPYCBalance(address: string) {
  if (typeof window === 'undefined' || !window.ethereum || !address) {
    return '0';
  }

  try {
    if (!ethers.isAddress(address)) {
      console.warn('Invalid address format:', address);
      return '0';
    }

    let contractAddress = process.env.NEXT_PUBLIC_JPYC_CONTRACT || DEFAULT_JPYC_CONTRACT;
    
    if (!ethers.isAddress(contractAddress)) {
      console.warn('Invalid contract address, using default');
      contractAddress = DEFAULT_JPYC_CONTRACT;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, JPYC_ABI, provider);
    
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    
    return ethers.formatUnits(balance, decimals);
  } catch (error: any) {
    console.error('Failed to get JPYC balance:', error.message || error);
    return '0';
  }
}

export async function transferJPYC(toAddress: string, amount: string) {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMaskがインストールされていません');
  }

  try {
    // Validate inputs
    if (!toAddress || !amount) {
      throw new Error('宛先アドレスと金額を指定してください');
    }

    if (parseFloat(amount) <= 0) {
      throw new Error('金額は0より大きい値を指定してください');
    }

    let contractAddress = process.env.NEXT_PUBLIC_JPYC_CONTRACT || DEFAULT_JPYC_CONTRACT;
    
    if (!ethers.isAddress(contractAddress)) {
      console.warn('Invalid contract address, using default');
      contractAddress = DEFAULT_JPYC_CONTRACT;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, JPYC_ABI, signer);
    
    const decimals = await contract.decimals();
    const amountInWei = ethers.parseUnits(amount, decimals);
    
    const normalizedToAddress = ethers.getAddress(toAddress);
    const tx = await contract.transfer(normalizedToAddress, amountInWei);
    await tx.wait();
    
    return tx.hash;
  } catch (error: any) {
    throw new Error(`送金失敗: ${error.message}`);
  }
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
