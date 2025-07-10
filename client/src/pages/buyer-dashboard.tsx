import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/use-wallet";
import { Wallet, Activity, Clock, DollarSign, Square, Calendar } from "lucide-react";
import type { Stream, Content } from "@shared/schema";

export default function BuyerDashboard() {
  const { wallet } = useWallet();

  const { data: activeStreams = [], isLoading: streamsLoading } = useQuery<Stream[]>({
    queryKey: ["/api/streams/active", wallet.userId],
    enabled: !!wallet.userId,
  });

  const { data: walletBalance, isLoading: balanceLoading } = useQuery({
    queryKey: ["/api/wallet", wallet.userId],
    enabled: !!wallet.userId,
  });

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              You need to connect your wallet to access the buyer dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buyer Dashboard</h1>
          <p className="text-gray-600">Manage your active subscriptions and content access</p>
        </div>

        {/* Wallet Balance */}
        <Card className="gradient-primary text-white mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold mb-2">Wallet Balance</h3>
                <div className="text-3xl font-bold">
                  ${balanceLoading ? "..." : walletBalance?.balance || wallet.balance}
                </div>
                <p className="text-primary-100">Available for streaming</p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Top Up
                </Button>
                <Wallet className="h-8 w-8 text-primary-100" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Streams */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Active Streams</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {streamsLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : activeStreams.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-400 text-lg">No active streams</div>
                <p className="text-gray-500 mt-2">Start streaming some content to see it here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeStreams.map((stream) => (
                  <div key={stream.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Content #{stream.contentId}</h4>
                        <p className="text-sm text-gray-600">Started {formatDate(stream.startTime?.toString() || "")}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{formatTime(stream.totalMinutes)}</div>
                        <div className="text-sm text-gray-500">streamed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">${stream.totalCost}</div>
                        <div className="text-sm text-gray-500">spent</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <Badge className="bg-green-100 text-green-800">Live</Badge>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Square className="h-4 w-4" />
                        <span>Stop</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Purchase History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Purchase History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-400 text-lg">No purchase history yet</div>
              <p className="text-gray-500 mt-2">Your completed streams will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
