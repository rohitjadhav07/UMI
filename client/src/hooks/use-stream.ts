import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface StreamState {
  id: number | null;
  contentId: number | null;
  isActive: boolean;
  startTime: Date | null;
  elapsedMinutes: number;
  totalCost: number;
  pricePerMinute: number;
}

export function useStream(contentId: number, pricePerMinute: number) {
  const [stream, setStream] = useState<StreamState>({
    id: null,
    contentId: null,
    isActive: false,
    startTime: null,
    elapsedMinutes: 0,
    totalCost: 0,
    pricePerMinute,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Timer for tracking elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (stream.isActive && stream.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - stream.startTime!.getTime()) / 60000);
        const cost = elapsed * pricePerMinute;
        
        setStream(prev => ({
          ...prev,
          elapsedMinutes: elapsed,
          totalCost: cost,
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stream.isActive, stream.startTime, pricePerMinute]);

  const startStreamMutation = useMutation({
    mutationFn: async ({ userId }: { userId: number }) => {
      const response = await apiRequest("POST", "/api/streams", {
        userId,
        contentId,
        isActive: true,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setStream({
        id: data.id,
        contentId: data.contentId,
        isActive: true,
        startTime: new Date(),
        elapsedMinutes: 0,
        totalCost: 0,
        pricePerMinute,
      });
      toast({
        title: "Stream Started",
        description: "Your streaming session has begun!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/streams"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start stream. Please try again.",
        variant: "destructive",
      });
    },
  });

  const endStreamMutation = useMutation({
    mutationFn: async () => {
      if (!stream.id) throw new Error("No active stream");
      const response = await apiRequest("PUT", `/api/streams/${stream.id}/end`);
      return response.json();
    },
    onSuccess: () => {
      setStream({
        id: null,
        contentId: null,
        isActive: false,
        startTime: null,
        elapsedMinutes: 0,
        totalCost: 0,
        pricePerMinute,
      });
      toast({
        title: "Stream Ended",
        description: `Total cost: $${stream.totalCost.toFixed(2)}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/streams"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to end stream. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startStream = (userId: number) => {
    startStreamMutation.mutate({ userId });
  };

  const endStream = () => {
    endStreamMutation.mutate();
  };

  return {
    stream,
    startStream,
    endStream,
    isStarting: startStreamMutation.isPending,
    isEnding: endStreamMutation.isPending,
  };
}
