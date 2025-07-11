import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { apiRequest } from "@/lib/queryClient";
import { Plus, TrendingUp, Users, Star, Edit, Trash2, DollarSign, Activity } from "lucide-react";
import { contentSchema, type Content } from "@shared/schema";
import { z } from "zod";

const contentFormSchema = contentSchema.extend({
  pricePerMinute: z.string().min(1, "Price must be greater than 0"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
}).omit({ creator: true });

type ContentFormData = z.infer<typeof contentFormSchema>;

export default function SellerDashboard() {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: sellerStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/seller", wallet.userId],
    enabled: !!wallet.userId,
  });

  const { data: sellerContent = [], isLoading: contentLoading } = useQuery<Content[]>({
    queryKey: ["/api/content/creator", wallet.userId],
    enabled: !!wallet.userId,
  });

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "course",
      pricePerMinute: "10000000000000000", // 0.01 ETH in wei
      duration: 60,
      thumbnailUrl: "",
      contentUrl: "",
      tags: [],
    },
  });

  const createContentMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      if (!wallet.address) {
        throw new Error("Wallet not connected");
      }
      
      const contentData = {
        ...data,
        creator: wallet.address,
        pricePerMinute: data.pricePerMinute, // Already in wei format
      };
      
      const response = await apiRequest("POST", "/api/content", contentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/creator", wallet.userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/seller", wallet.userId] });
      toast({
        title: "Content Created",
        description: "Your content has been successfully created!",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/creator", wallet.userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/seller", wallet.userId] });
      toast({
        title: "Content Deleted",
        description: "Your content has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContentFormData) => {
    createContentMutation.mutate(data);
  };

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

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              You need to connect your wallet to access the seller dashboard
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your digital content and track streaming revenue</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="gradient-primary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    ${statsLoading ? "..." : sellerStats?.totalEarnings || "0"}
                  </div>
                  <div className="text-primary-100">Total Earnings</div>
                </div>
                <DollarSign className="h-8 w-8 text-primary-100" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : sellerStats?.activeStreams || "0"}
                  </div>
                  <div className="text-gray-600">Active Streams</div>
                </div>
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : sellerStats?.totalProducts || "0"}
                  </div>
                  <div className="text-gray-600">Listed Products</div>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : sellerStats?.averageRating || "0"}
                  </div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
                <Star className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-white p-6 h-auto flex-col space-y-2">
                    <Plus className="h-6 w-6" />
                    <span className="font-semibold">Upload Content</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Content</DialogTitle>
                    <DialogDescription>
                      Upload your digital content and set streaming parameters
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          {...form.register("title")}
                          placeholder="Enter content title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select onValueChange={(value) => form.setValue("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="course">Course</SelectItem>
                            <SelectItem value="game">Game</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="document">Document</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        {...form.register("description")}
                        placeholder="Describe your content"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pricePerMinute">Price per Minute ($)</Label>
                        <Input
                          id="pricePerMinute"
                          type="number"
                          step="0.01"
                          {...form.register("pricePerMinute")}
                          placeholder="0.05"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          {...form.register("duration", { valueAsNumber: true })}
                          placeholder="60"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                      <Input
                        id="thumbnailUrl"
                        {...form.register("thumbnailUrl")}
                        placeholder="https://example.com/thumbnail.jpg"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contentUrl">Content URL</Label>
                      <Input
                        id="contentUrl"
                        {...form.register("contentUrl")}
                        placeholder="https://example.com/content"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createContentMutation.isPending}
                        className="gradient-primary text-white"
                      >
                        {createContentMutation.isPending ? "Creating..." : "Create Content"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
              <Button className="gradient-accent text-white p-6 h-auto flex-col space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span className="font-semibold">View Analytics</span>
              </Button>
              
              <Button className="bg-warning text-white p-6 h-auto flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span className="font-semibold">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Your Content</CardTitle>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="gradient-primary text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contentLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sellerContent.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg">No content created yet</div>
                <p className="text-gray-500 mt-2">Create your first content to start earning!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Content</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Price/min</th>
                      <th className="text-left py-3 px-4">Views</th>
                      <th className="text-left py-3 px-4">Rating</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerContent.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=64&h=64&fit=crop"}
                              alt={item.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-gray-500">{item.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">${item.pricePerMinute}</td>
                        <td className="py-3 px-4">{item.totalViews}</td>
                        <td className="py-3 px-4 font-semibold">{item.rating}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-primary hover:text-primary/80"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive/80"
                              onClick={() => deleteContentMutation.mutate(item.id)}
                              disabled={deleteContentMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
