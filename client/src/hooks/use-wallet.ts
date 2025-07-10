import { useState, useEffect } from "react";

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

  useEffect(() => {
    // Check if wallet was previously connected
    const savedWallet = localStorage.getItem("wallet");
    if (savedWallet) {
      try {
        const parsedWallet = JSON.parse(savedWallet);
        setWallet(parsedWallet);
      } catch (error) {
        console.error("Failed to parse saved wallet:", error);
      }
    }
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWallet: WalletState = {
        isConnected: true,
        address: "0x" + Math.random().toString(16).substring(2, 42),
        balance: "127.45",
        userId: 2, // Mock user ID
      };
      
      setWallet(mockWallet);
      localStorage.setItem("wallet", JSON.stringify(mockWallet));
    } catch (error) {
      console.error("Failed to connect wallet:", error);
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
    localStorage.removeItem("wallet");
  };

  return {
    wallet,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };
}
