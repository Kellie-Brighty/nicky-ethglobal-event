import { useAccount, useBalance } from "@starknet-react/core";

export const WalletBalance = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  if (!address) {
    return (
      <div className="mb-6 p-4 rounded-lg bg-dark-secondary border border-neon-blue/10">
        <h2 className="text-lg font-semibold mb-2 text-light-gray">Wallet</h2>
        <p className="text-sm text-neon-blue/60">Please connect your wallet</p>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 rounded-lg bg-dark-secondary border border-neon-blue/10">
      <h2 className="text-lg font-semibold mb-2 text-light-gray">
        Wallet Balance
      </h2>
      <div className="flex items-center justify-between">
        <span className="text-neon-blue font-mono">
          {balance?.formatted || "0"} ETH
        </span>
        <button className="text-sm text-neon-green hover:text-neon-blue transition-colors">
          Add Funds
        </button>
      </div>
    </div>
  );
};
