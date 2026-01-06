import { useState } from 'react';
import { transferJPYC } from '../lib/web3';
import { useWalletStore, useTransactionStore } from '../lib/store';
import { Send, User } from 'lucide-react';
import { ethers } from 'ethers';

// ニックネームとアドレスの対応リスト
const RECIPIENTS = [
  { name: 'Alice', address: '0xacacfe5eb42745e2cd32f0fc17118622e9521606' },
  { name: 'Bob', address: '0x6AE7Dfc73E0dDE900d309A9FfC03c8d8617d5274' },
  { name: 'Charlie', address: '0x41c86776962366883267789062D1789062D17890' },
];

export default function TransferForm() {
  const [selectedRecipient, setSelectedRecipient] = useState(RECIPIENTS[0].address);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { isConnected, address } = useWalletStore();
  const { addTransaction } = useTransactionStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      setMessage('ウォレットを接続してください');
      return;
    }

    if (!selectedRecipient || !amount) {
      setMessage('すべての項目を入力してください');
      return;
    }

    // アドレスの正規化（チェックサムエラー対策）
    let normalizedAddress = selectedRecipient;
    try {
      normalizedAddress = ethers.getAddress(selectedRecipient);
    } catch (err) {
      setMessage('エラー: 無効なアドレス形式です');
      return;
    }

    try {
      setIsLoading(true);
      setMessage('');

      const txHash = await transferJPYC(normalizedAddress, amount);
      
      addTransaction({
        id: Date.now().toString(),
        hash: txHash || '',
        from: address,
        to: normalizedAddress,
        amount,
        status: 'pending',
        timestamp: Date.now(),
      });

      setMessage(`送金完了！ハッシュ: ${txHash}`);
      setAmount('');
    } catch (err: any) {
      let errorMsg = err.message;
      if (errorMsg.includes('bad address checksum')) {
        errorMsg = 'アドレスの形式（チェックサム）が正しくありません。システム側で修正を試みます。';
      }
      setMessage(`エラー: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6">
      <h3 className="text-lg font-black text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <Send size={20} className="text-green-600" />
        JPYC決済・送金
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            宛先（ニックネーム）
          </label>
          <div className="relative">
            <select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all text-sm font-bold appearance-none dark:text-white"
            >
              {RECIPIENTS.map((r) => (
                <option key={r.address} value={r.address}>
                  {r.name} ({r.address.substring(0, 6)}...{r.address.substring(38)})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
            金額 (JPYC)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all text-sm font-bold dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !isConnected}
          className="w-full bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-black text-sm shadow-lg shadow-green-600/20"
        >
          {isLoading ? '処理中...' : 'JPYCで支払う'}
        </button>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-2xl text-xs font-bold break-all ${
          message.startsWith('エラー') 
            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30'
            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
