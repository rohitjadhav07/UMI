import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { Podcast, User, ShoppingCart, Wallet } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const { wallet, isConnecting, connectWallet, disconnectWallet } = useWallet();

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Podcast className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">StreamMall</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link href="/">
                <Button 
                  variant={isActive("/") ? "default" : "ghost"}
                  className="font-medium"
                >
                  Browse
                </Button>
              </Link>
              <Link href="/seller-dashboard">
                <Button 
                  variant={isActive("/seller-dashboard") ? "default" : "ghost"}
                  className="font-medium"
                >
                  Sell
                </Button>
              </Link>
              <Link href="/buyer-dashboard">
                <Button 
                  variant={isActive("/buyer-dashboard") ? "default" : "ghost"}
                  className="font-medium"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {wallet.isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  <div className="font-medium">${wallet.balance}</div>
                  <div className="text-xs">{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</div>
                </div>
                <Button
                  variant="outline"
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="gradient-primary text-white flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
              </Button>
            )}
            
            <div className="relative">
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
