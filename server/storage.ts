import { 
  users, 
  content, 
  streams, 
  transactions, 
  walletBalances,
  type User, 
  type InsertUser,
  type Content,
  type InsertContent,
  type Stream,
  type InsertStream,
  type Transaction,
  type InsertTransaction,
  type WalletBalance,
  type InsertWalletBalance
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Content operations
  getContent(id: number): Promise<Content | undefined>;
  getAllContent(): Promise<Content[]>;
  getContentByCreator(creatorId: number): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;
  
  // Stream operations
  getStream(id: number): Promise<Stream | undefined>;
  getActiveStreams(userId: number): Promise<Stream[]>;
  getStreamsByContent(contentId: number): Promise<Stream[]>;
  createStream(stream: InsertStream): Promise<Stream>;
  updateStream(id: number, updates: Partial<InsertStream>): Promise<Stream | undefined>;
  endStream(id: number): Promise<Stream | undefined>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByStream(streamId: number): Promise<Transaction[]>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  
  // Wallet operations
  getWalletBalance(userId: number): Promise<WalletBalance | undefined>;
  updateWalletBalance(userId: number, balance: string): Promise<WalletBalance>;
  
  // Analytics
  getSellerStats(sellerId: number): Promise<{
    totalEarnings: string;
    activeStreams: number;
    totalProducts: number;
    averageRating: string;
  }>;
  
  getMarketplaceStats(): Promise<{
    totalContent: number;
    activeStreams: number;
    totalRevenue: string;
    totalCreators: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private content: Map<number, Content> = new Map();
  private streams: Map<number, Stream> = new Map();
  private transactions: Map<number, Transaction> = new Map();
  private walletBalances: Map<number, WalletBalance> = new Map();
  
  private currentUserId = 1;
  private currentContentId = 1;
  private currentStreamId = 1;
  private currentTransactionId = 1;
  private currentWalletId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const user1: User = {
      id: this.currentUserId++,
      username: "john_doe",
      email: "john@example.com",
      walletAddress: "0x123...abc",
      role: "seller",
      createdAt: new Date(),
    };
    
    const user2: User = {
      id: this.currentUserId++,
      username: "jane_smith",
      email: "jane@example.com",
      walletAddress: "0x456...def",
      role: "buyer",
      createdAt: new Date(),
    };
    
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    
    // Create sample content
    const content1: Content = {
      id: this.currentContentId++,
      title: "Complete JavaScript Mastery",
      description: "From zero to hero in modern JavaScript development",
      category: "course",
      pricePerMinute: "0.05",
      duration: 480, // 8 hours
      thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
      contentUrl: "https://example.com/js-course",
      creatorId: user1.id,
      tags: ["javascript", "programming", "web development"],
      isActive: true,
      rating: "4.9",
      totalViews: 1247,
      createdAt: new Date(),
    };
    
    const content2: Content = {
      id: this.currentContentId++,
      title: "Pixel Adventure Pro",
      description: "Retro-style platformer with modern mechanics",
      category: "game",
      pricePerMinute: "0.02",
      duration: 600, // 10 hours
      thumbnailUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=400&fit=crop",
      contentUrl: "https://example.com/pixel-game",
      creatorId: user1.id,
      tags: ["game", "indie", "platformer"],
      isActive: true,
      rating: "4.7",
      totalViews: 892,
      createdAt: new Date(),
    };
    
    const content3: Content = {
      id: this.currentContentId++,
      title: "UI Kit Pro Bundle",
      description: "Premium design system for modern applications",
      category: "design",
      pricePerMinute: "0.08",
      duration: 300, // 5 hours
      thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop",
      contentUrl: "https://example.com/ui-kit",
      creatorId: user1.id,
      tags: ["design", "ui", "figma"],
      isActive: true,
      rating: "4.8",
      totalViews: 654,
      createdAt: new Date(),
    };
    
    this.content.set(content1.id, content1);
    this.content.set(content2.id, content2);
    this.content.set(content3.id, content3);
    
    // Create sample wallet balances
    const wallet1: WalletBalance = {
      id: this.currentWalletId++,
      userId: user1.id,
      balance: "2456.75",
      updatedAt: new Date(),
    };
    
    const wallet2: WalletBalance = {
      id: this.currentWalletId++,
      userId: user2.id,
      balance: "127.45",
      updatedAt: new Date(),
    };
    
    this.walletBalances.set(user1.id, wallet1);
    this.walletBalances.set(user2.id, wallet2);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getContent(id: number): Promise<Content | undefined> {
    return this.content.get(id);
  }

  async getAllContent(): Promise<Content[]> {
    return Array.from(this.content.values()).filter(c => c.isActive);
  }

  async getContentByCreator(creatorId: number): Promise<Content[]> {
    return Array.from(this.content.values()).filter(c => c.creatorId === creatorId);
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const newContent: Content = {
      ...insertContent,
      id: this.currentContentId++,
      rating: "0",
      totalViews: 0,
      createdAt: new Date(),
    };
    this.content.set(newContent.id, newContent);
    return newContent;
  }

  async updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined> {
    const existing = this.content.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.content.set(id, updated);
    return updated;
  }

  async deleteContent(id: number): Promise<boolean> {
    return this.content.delete(id);
  }

  async getStream(id: number): Promise<Stream | undefined> {
    return this.streams.get(id);
  }

  async getActiveStreams(userId: number): Promise<Stream[]> {
    return Array.from(this.streams.values()).filter(s => s.userId === userId && s.isActive);
  }

  async getStreamsByContent(contentId: number): Promise<Stream[]> {
    return Array.from(this.streams.values()).filter(s => s.contentId === contentId);
  }

  async createStream(insertStream: InsertStream): Promise<Stream> {
    const stream: Stream = {
      ...insertStream,
      id: this.currentStreamId++,
      totalMinutes: 0,
      totalCost: "0",
      createdAt: new Date(),
    };
    this.streams.set(stream.id, stream);
    return stream;
  }

  async updateStream(id: number, updates: Partial<InsertStream>): Promise<Stream | undefined> {
    const existing = this.streams.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.streams.set(id, updated);
    return updated;
  }

  async endStream(id: number): Promise<Stream | undefined> {
    const stream = this.streams.get(id);
    if (!stream) return undefined;
    
    const updated = { 
      ...stream, 
      endTime: new Date(), 
      isActive: false 
    };
    this.streams.set(id, updated);
    return updated;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      ...insertTransaction,
      id: this.currentTransactionId++,
      timestamp: new Date(),
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async getTransactionsByStream(streamId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => t.streamId === streamId);
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    const userStreams = Array.from(this.streams.values()).filter(s => s.userId === userId);
    const streamIds = userStreams.map(s => s.id);
    return Array.from(this.transactions.values()).filter(t => streamIds.includes(t.streamId));
  }

  async getWalletBalance(userId: number): Promise<WalletBalance | undefined> {
    return this.walletBalances.get(userId);
  }

  async updateWalletBalance(userId: number, balance: string): Promise<WalletBalance> {
    const existing = this.walletBalances.get(userId);
    const updated: WalletBalance = {
      id: existing?.id || this.currentWalletId++,
      userId,
      balance,
      updatedAt: new Date(),
    };
    this.walletBalances.set(userId, updated);
    return updated;
  }

  async getSellerStats(sellerId: number): Promise<{
    totalEarnings: string;
    activeStreams: number;
    totalProducts: number;
    averageRating: string;
  }> {
    const sellerContent = await this.getContentByCreator(sellerId);
    const activeStreams = Array.from(this.streams.values()).filter(s => 
      sellerContent.some(c => c.id === s.contentId) && s.isActive
    );
    
    const totalEarnings = Array.from(this.streams.values())
      .filter(s => sellerContent.some(c => c.id === s.contentId))
      .reduce((sum, stream) => sum + parseFloat(stream.totalCost || "0"), 0);
    
    const averageRating = sellerContent.length > 0 
      ? (sellerContent.reduce((sum, c) => sum + parseFloat(c.rating || "0"), 0) / sellerContent.length).toFixed(1)
      : "0";
    
    return {
      totalEarnings: totalEarnings.toFixed(2),
      activeStreams: activeStreams.length,
      totalProducts: sellerContent.length,
      averageRating,
    };
  }

  async getMarketplaceStats(): Promise<{
    totalContent: number;
    activeStreams: number;
    totalRevenue: string;
    totalCreators: number;
  }> {
    const allContent = await this.getAllContent();
    const activeStreams = Array.from(this.streams.values()).filter(s => s.isActive);
    const totalRevenue = Array.from(this.streams.values())
      .reduce((sum, stream) => sum + parseFloat(stream.totalCost || "0"), 0);
    const creators = new Set(allContent.map(c => c.creatorId));
    
    return {
      totalContent: allContent.length,
      activeStreams: activeStreams.length,
      totalRevenue: totalRevenue.toFixed(0),
      totalCreators: creators.size,
    };
  }
}

export const storage = new MemStorage();
