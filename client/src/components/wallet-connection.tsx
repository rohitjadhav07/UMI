import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, AlertCircle } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";

export default function WalletConnection() {
  const { wallet, isConnecting, connectWallet } = useWallet();

  if (wallet.isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-green-600" />
            <span>Wallet Connected</span>
          </CardTitle>
          <CardDescription>
            Your wallet is connected and ready to stream
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Address:</span>
              <span className="text-sm font-mono">
                {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Balance:</span>
              <span className="text-sm font-semibold">${wallet.balance}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-orange-600" />
          <span>Connect Wallet</span>
        </CardTitle>
        <CardDescription>
          Connect your wallet to start streaming content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full gradient-primary text-white"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </CardContent>
    </Card>
  );
}
