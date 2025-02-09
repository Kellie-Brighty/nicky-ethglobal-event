interface Window {
  starknet?: {
    account: any;
    isConnected: boolean;
    enable: () => Promise<string[]>;
    // Add other starknet properties as needed
  };
} 