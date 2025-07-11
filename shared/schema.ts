import { z } from "zod";

// Blockchain-based types for StreamMall
export interface User {
  walletAddress: string;
  username: string;
  email: string;
  isCreator: boolean;
  totalEarnings: string;
  totalSpent: string;
  contentIds: number[];
  streamIds: number[];
}

export interface Content {
  id: number;
  title: string;
  description: string;
  category: string;
  contentUrl: string;
  thumbnailUrl: string;
  pricePerMinute: string; // in wei
  duration: number; // in minutes
  creator: string; // wallet address
  isActive: boolean;
  totalViews: number;
  totalEarnings: string;
  tags: string[];
  rating?: string;
  createdAt?: Date;
  creatorId?: number; // for backward compatibility
}

export interface Stream {
  id: number;
  contentId: number;
  buyer: string; // wallet address
  seller: string; // wallet address
  startTime: Date;
  endTime?: Date;
  totalMinutes: number;
  totalCost: string; // in wei
  isActive: boolean;
  lastPaymentTime: Date;
  userId?: number; // for backward compatibility
  createdAt?: Date;
}

export interface Transaction {
  id: number;
  streamId: number;
  amount: string; // in wei
  timestamp: Date;
  type: string; // stream_payment, stream_start, stream_end
  txHash: string;
  from: string;
  to: string;
}

export interface WalletBalance {
  id: number;
  userId: number;
  balance: string;
  updatedAt: Date;
}

// Zod schemas for validation
export const userSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  isCreator: z.boolean(),
});

export const contentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["course", "game", "document", "design"]),
  contentUrl: z.string().url("Invalid content URL"),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),
  pricePerMinute: z.string().regex(/^\d+$/, "Price must be a valid number in wei"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  tags: z.array(z.string()).default([]),
});

export const streamSchema = z.object({
  contentId: z.number().min(1, "Content ID is required"),
  buyer: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid buyer address"),
  seller: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid seller address"),
});

// Contract ABI types
export interface ContractConfig {
  address: string;
  abi: any[];
}

// Blockchain transaction types
export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  status: boolean;
}

// Legacy types for backward compatibility
export type InsertUser = z.infer<typeof userSchema>;
export type InsertContent = z.infer<typeof contentSchema>;
export type InsertStream = z.infer<typeof streamSchema>;
export type InsertTransaction = Omit<Transaction, 'id' | 'timestamp'>;
export type InsertWalletBalance = Omit<WalletBalance, 'id' | 'updatedAt'>;

// Smart contract event types
export interface ContentCreatedEvent {
  contentId: number;
  creator: string;
  title: string;
  pricePerMinute: string;
}

export interface StreamStartedEvent {
  streamId: number;
  contentId: number;
  buyer: string;
  seller: string;
}

export interface StreamEndedEvent {
  streamId: number;
  totalCost: string;
  totalMinutes: number;
}

// Web3 configuration
export interface Web3Config {
  contractAddress: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}
