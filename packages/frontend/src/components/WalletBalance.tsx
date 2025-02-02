import { useAccount, useBalance } from "wagmi";

export const WalletBalance = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  if (!address || !balance) return null;

  return (
    <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 mb-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">Wallet Balance</div>
      <div className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <span className="text-orange-500">
          {parseFloat(balance.formatted).toFixed(4)}
        </span>
        <span>{balance.symbol}</span>
      </div>
    </div>
  );
}; 