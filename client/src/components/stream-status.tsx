import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Square, Wallet } from "lucide-react";
import { useStream } from "@/hooks/use-stream";
import { useWallet } from "@/hooks/use-wallet";

interface StreamStatusProps {
  contentId: number;
  pricePerMinute: number;
}

export default function StreamStatus({ contentId, pricePerMinute }: StreamStatusProps) {
  const { wallet } = useWallet();
  const { stream, startStream, endStream, isStarting, isEnding } = useStream(contentId, pricePerMinute);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!wallet.isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <Wallet className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="font-semibold text-yellow-800">Connect Wallet Required</p>
            <p className="text-sm text-yellow-700">Connect your wallet to start streaming</p>
          </div>
        </div>
      </div>
    );
  }

  if (stream.isActive) {
    return (
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="font-semibold text-green-800">Stream Active</p>
              <p className="text-sm text-green-700">
                {formatTime(stream.elapsedMinutes)} • ${stream.totalCost.toFixed(2)} spent
              </p>
            </div>
          </div>
          <Button
            onClick={endStream}
            disabled={isEnding}
            variant="destructive"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Square className="h-4 w-4" />
            <span>{isEnding ? "Ending..." : "End Stream"}</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <div>
            <p className="font-semibold text-gray-900">Ready to Stream</p>
            <p className="text-sm text-gray-600">Start streaming at ${pricePerMinute}/min</p>
          </div>
        </div>
        <Button
          onClick={() => wallet.userId && startStream(wallet.userId)}
          disabled={isStarting || !wallet.userId}
          className="gradient-primary text-white flex items-center space-x-2"
        >
          <Play className="h-4 w-4" />
          <span>{isStarting ? "Starting..." : "Start Stream"}</span>
        </Button>
      </div>
    </div>
  );
}
