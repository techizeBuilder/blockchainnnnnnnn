import { useState, useEffect } from 'react';
import { toast } from "@/lib/toast";

export interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: string | null;
  isConnecting: boolean;
  error: string | null;
}

// Helper function to truncate address
export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper to format balance
export const formatBalance = (balance: string): string => {
  if (!balance) return '0';
  const balanceNum = parseFloat(balance);
  return balanceNum.toFixed(4);
};

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: null,
    chainId: null,
    isConnecting: false,
    error: null,
  });

  // Check if ethereum is available and stored connection
  useEffect(() => {
    const checkConnection = async () => {
      const savedAddress = localStorage.getItem('wallet_address');
      
      if (savedAddress && window.ethereum) {
        try {
          // Try to get accounts
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0 && accounts[0] === savedAddress) {
            // Get balance
            const balance = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest'],
            });
            
            // Get chain ID
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            
            // Convert balance from wei to ETH
            const ethBalance = (parseInt(balance, 16) / 1e18).toString();
            
            setWalletState({
              address: accounts[0],
              balance: ethBalance,
              chainId,
              isConnecting: false,
              error: null,
            });
          } else {
            // Clear saved address if not found
            localStorage.removeItem('wallet_address');
          }
        } catch (error) {
          console.error("Failed to reconnect wallet:", error);
          localStorage.removeItem('wallet_address');
        }
      }
    };
    
    checkConnection();
  }, []);

  // Set up event listeners for account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else if (accounts[0] !== walletState.address) {
          // Account changed
          connectWallet();
        }
      };
      
      const handleChainChanged = () => {
        // Chain changed, refresh page as recommended by MetaMask
        window.location.reload();
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        // Clean up listeners
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [walletState.address]);

  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      toast.error("Please install MetaMask to connect your wallet");
      setWalletState({
        ...walletState,
        error: "MetaMask not installed",
      });
      return false;
    }
    
    try {
      setWalletState({
        ...walletState,
        isConnecting: true,
        error: null,
      });
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });
      
      // Get chain ID
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Convert balance from wei to ETH
      const ethBalance = (parseInt(balance, 16) / 1e18).toString();
      
      // Save connected address
      localStorage.setItem('wallet_address', accounts[0]);
      
      setWalletState({
        address: accounts[0],
        balance: ethBalance,
        chainId,
        isConnecting: false,
        error: null,
      });
      
      toast.success("Wallet connected successfully");
      return true;
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      setWalletState({
        ...walletState,
        isConnecting: false,
        error: error.message || "Failed to connect wallet",
      });
      
      toast.error(error.message || "Failed to connect wallet");
      return false;
    }
  };

  const disconnectWallet = () => {
    // Remove saved address
    localStorage.removeItem('wallet_address');
    
    setWalletState({
      address: null,
      balance: null,
      chainId: null,
      isConnecting: false,
      error: null,
    });
    
    toast.success("Wallet disconnected");
    return true;
  };

  return {
    address: walletState.address,
    balance: walletState.balance,
    chainId: walletState.chainId,
    isConnecting: walletState.isConnecting,
    error: walletState.error,
    isConnected: !!walletState.address,
    connectWallet,
    disconnectWallet,
    truncateAddress,
    formatBalance,
  };
};

// Add type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener?: (eventName: string, handler: (...args: any[]) => void) => void;
    };
  }
}
