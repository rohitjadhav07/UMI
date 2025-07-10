import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StreamStatus from "@/components/stream-status";
import WalletConnection from "@/components/wallet-connection";
import { useWallet } from "@/hooks/use-wallet";
import { Star, Clock, Eye, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Content } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams();
  const { wallet } = useWallet();

  const { data: content, isLoading } = useQuery<Content>({
    queryKey: ["/api/content", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h2>
          <p className="text-gray-600 mb-4">The requested content could not be found.</p>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "course":
        return "bg-accent/10 text-accent";
      case "game":
        return "bg-warning/10 text-warning";
      case "design":
        return "bg-purple-100 text-purple-600";
      case "document":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalCost = (parseFloat(content.pricePerMinute) * content.duration).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={content.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop"}
                alt={content.title}
                className="w-full h-64 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{content.title}</h1>
                      <p className="text-gray-600">Creator #{content.creatorId}</p>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(content.category)}>
                    {content.category}
                  </Badge>
                </div>

                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{content.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{formatDuration(content.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{content.totalViews} views</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{content.description}</p>
                  </div>
                  
                  {content.tags && content.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {content.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle>Streaming Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per minute</span>
                  <span className="font-semibold">${content.pricePerMinute}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total duration</span>
                  <span className="font-semibold">{formatDuration(content.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost to complete</span>
                  <span className="font-semibold">${totalCost}</span>
                </div>
              </CardContent>
            </Card>

            {/* Stream Status */}
            <StreamStatus 
              contentId={content.id}
              pricePerMinute={parseFloat(content.pricePerMinute)}
            />

            {/* Wallet Connection */}
            {!wallet.isConnected && <WalletConnection />}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full gradient-primary text-white"
                disabled={!wallet.isConnected}
              >
                {wallet.isConnected ? "Access Content" : "Connect Wallet to Access"}
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="w-full"
              >
                Preview Content
              </Button>
            </div>

            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Creator #{content.creatorId}</p>
                    <p className="text-sm text-gray-600">Verified Creator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
