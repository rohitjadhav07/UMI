import { useState, useEffect } from 'react';
import { useWallet } from './use-wallet';
import { contractMethods, subscribeToEvents } from '@/lib/web3';
import type { Content, Stream, User } from '@shared/schema';
import { useToast } from './use-toast';

export function useContract() {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Content operations
  const createContent = async (contentData: {
    title: string;
    description: string;
    category: string;
    contentUrl: string;
    thumbnailUrl: string;
    pricePerMinute: string;
    duration: number;
    tags: string[];
  }) => {
    if (!wallet.address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contractMethods.createContent(
        contentData.title,
        contentData.description,
        contentData.category,
        contentData.contentUrl,
        contentData.thumbnailUrl,
        contentData.pricePerMinute,
        contentData.duration,
        contentData.tags,
        wallet.address
      );

      toast({
        title: 'Transaction Sent',
        description: `Content creation transaction sent. Hash: ${tx.transactionHash}`,
      });

      return tx;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create content';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const startStream = async (contentId: number, paymentAmount: string) => {
    if (!wallet.address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contractMethods.startStream(
        contentId,
        wallet.address,
        paymentAmount
      );

      toast({
        title: 'Stream Started',
        description: `Stream started successfully. Hash: ${tx.transactionHash}`,
      });

      return tx;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to start stream';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const endStream = async (streamId: number) => {
    if (!wallet.address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contractMethods.endStream(streamId, wallet.address);

      toast({
        title: 'Stream Ended',
        description: `Stream ended successfully. Hash: ${tx.transactionHash}`,
      });

      return tx;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to end stream';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (username: string, email: string, isCreator: boolean) => {
    if (!wallet.address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contractMethods.registerUser(
        username,
        email,
        isCreator,
        wallet.address
      );

      toast({
        title: 'User Registered',
        description: `Registration successful. Hash: ${tx.transactionHash}`,
      });

      return tx;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to register user';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Read operations
  const getContent = async (contentId: number): Promise<Content | null> => {
    try {
      const content = await contractMethods.getContent(contentId);
      return content;
    } catch (error) {
      console.error('Failed to get content:', error);
      return null;
    }
  };

  const getAllActiveContent = async (): Promise<number[]> => {
    try {
      const contentIds = await contractMethods.getAllActiveContent();
      return contentIds;
    } catch (error) {
      console.error('Failed to get active content:', error);
      return [];
    }
  };

  const getUser = async (address: string): Promise<User | null> => {
    try {
      const user = await contractMethods.getUser(address);
      return user;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  };

  const getActiveStreams = async (userAddress: string): Promise<number[]> => {
    try {
      const streamIds = await contractMethods.getActiveStreams(userAddress);
      return streamIds;
    } catch (error) {
      console.error('Failed to get active streams:', error);
      return [];
    }
  };

  const getStream = async (streamId: number): Promise<Stream | null> => {
    try {
      const stream = await contractMethods.getStream(streamId);
      return stream;
    } catch (error) {
      console.error('Failed to get stream:', error);
      return null;
    }
  };

  const getCreatorContent = async (creatorAddress: string): Promise<number[]> => {
    try {
      const contentIds = await contractMethods.getCreatorContent(creatorAddress);
      return contentIds;
    } catch (error) {
      console.error('Failed to get creator content:', error);
      return [];
    }
  };

  // Event listeners
  useEffect(() => {
    if (!wallet.address) return;

    const handleContentCreated = (event: any) => {
      toast({
        title: 'Content Created',
        description: `New content "${event.returnValues.title}" created successfully`,
      });
    };

    const handleStreamStarted = (event: any) => {
      toast({
        title: 'Stream Started',
        description: `Stream ${event.returnValues.streamId} started`,
      });
    };

    const handleStreamEnded = (event: any) => {
      toast({
        title: 'Stream Ended',
        description: `Stream ${event.returnValues.streamId} ended`,
      });
    };

    const handlePaymentProcessed = (event: any) => {
      toast({
        title: 'Payment Processed',
        description: `Payment of ${event.returnValues.amount} wei processed`,
      });
    };

    // Subscribe to events
    subscribeToEvents('ContentCreated', handleContentCreated, { creator: wallet.address });
    subscribeToEvents('StreamStarted', handleStreamStarted, { buyer: wallet.address });
    subscribeToEvents('StreamEnded', handleStreamEnded, { buyer: wallet.address });
    subscribeToEvents('PaymentProcessed', handlePaymentProcessed, { buyer: wallet.address });

    // Cleanup listeners on unmount
    return () => {
      // Event listeners are automatically cleaned up by the web3 library
    };
  }, [wallet.address, toast]);

  return {
    // State
    isLoading,
    error,
    
    // Content operations
    createContent,
    getContent,
    getAllActiveContent,
    getCreatorContent,
    
    // Stream operations
    startStream,
    endStream,
    getStream,
    getActiveStreams,
    
    // User operations
    registerUser,
    getUser,
  };
}