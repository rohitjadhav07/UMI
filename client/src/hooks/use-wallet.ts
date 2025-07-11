import { useState, useEffect } from "react";
import { initializeWeb3, getCurrentAccount, getEthBalance, switchToCorrectNetwork } from '@/lib/web3';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  userId: number | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: "0",
    userId: null,
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already connected on mount
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (!window.ethereum) return;
      
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await updateWalletState(accounts[0]);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const updateWalletState = async (address: string) => {
    try {
      const balance = await getEthBalance(address);
      setWallet({
        isConnected: true,
        address,
        balance,
        userId: null, // Will be set after user registration/login
      });
      setError(null);
    } catch (error) {
      console.error('Error updating wallet state:', error);
      setError('Failed to get wallet balance');
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      updateWalletState(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    // Reload the page when network changes
    window.location.reload();
  };

  const connectWallet = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!window.ethereum) {
        throw new Error('Please install Rabby wallet or MetaMask to connect');
      }

      // Initialize Web3 and request account access
      await initializeWeb3();
      
      // Switch to correct network
      await switchToCorrectNetwork();
      
      // Get current account
      const address = await getCurrentAccount();
      if (!address) {
        throw new Error('No account found. Please unlock your wallet');
      }

      await updateWalletState(address);
      
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      balance: "0",
      userId: null,
    });
    setError(null);
  };

  const refreshBalance = async () => {
    if (wallet.address) {
      try {
        const balance = await getEthBalance(wallet.address);
        setWallet(prev => ({ ...prev, balance }));
      } catch (error) {
        console.error('Error refreshing balance:', error);
      }
    }
  };

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    isConnecting,
    error,
  };
}