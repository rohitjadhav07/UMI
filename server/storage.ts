import type { 
  User, 
  Content, 
  Stream, 
  Transaction, 
  WalletBalance, 
  InsertUser, 
  InsertContent, 
  InsertStream, 
  InsertTransaction, 
  InsertWalletBalance 
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
    // Create demo users
    const user1: User = {
      walletAddress: "0x742d35Cc6634C0532925a3b8D9F9DC1f3e2f5847",
      username: "alice_creator",
      email: "alice@example.com",
      isCreator: true,
      totalEarnings: "1500000000000000000", // 1.5 ETH in wei
      totalSpent: "0",
      contentIds: [1, 2],
      streamIds: []
    };

    const user2: User = {
      walletAddress: "0x8ba1f109551bD432803012645Hac136c9333E4dF7",
      username: "bob_buyer",
      email: "bob@example.com",
      isCreator: false,
      totalEarnings: "0",
      totalSpent: "500000000000000000", // 0.5 ETH in wei
      contentIds: [],
      streamIds: [1]
    };

    this.users.set(1, user1);
    this.users.set(2, user2);

    // Create demo content
    const content1: Content = {
      id: 1,
      title: "Complete JavaScript Mastery",
      description: "Master JavaScript from basics to advanced concepts with hands-on projects.",
      category: "course",
      contentUrl: "https://example.com/js-course",
      thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
      pricePerMinute: "10000000000000000", // 0.01 ETH in wei
      duration: 120,
      creator: user1.walletAddress,
      isActive: true,
      totalViews: 45,
      totalEarnings: "1000000000000000000", // 1 ETH in wei
      tags: ["javascript", "programming", "web development"],
      rating: "4.8"
    };

    const content2: Content = {
      id: 2,
      title: "Advanced React Patterns",
      description: "Learn advanced React patterns and best practices for scalable applications.",
      category: "course",
      contentUrl: "https://example.com/react-course",
      thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      pricePerMinute: "15000000000000000", // 0.015 ETH in wei
      duration: 90,
      creator: user1.walletAddress,
      isActive: true,
      totalViews: 23,
      totalEarnings: "500000000000000000", // 0.5 ETH in wei
      tags: ["react", "javascript", "frontend"],
      rating: "4.9"
    };

    const content3: Content = {
      id: 3,
      title: "Blockchain Game Development",
      description: "Build engaging blockchain games with NFT integration and smart contracts.",
      category: "game",
      contentUrl: "https://example.com/blockchain-game",
      thumbnailUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400",
      pricePerMinute: "20000000000000000", // 0.02 ETH in wei
      duration: 180,
      creator: user1.walletAddress,
      isActive: true,
      totalViews: 12,
      totalEarnings: "0",
      tags: ["blockchain", "gaming", "nft"],
      rating: "4.7"
    };

    this.content.set(1, content1);
    this.content.set(2, content2);
    this.content.set(3, content3);

    // Create wallet balances
    const wallet1: WalletBalance = {
      id: 1,
      userId: 1,
      balance: "2000000000000000000", // 2 ETH in wei
      updatedAt: new Date()
    };

    const wallet2: WalletBalance = {
      id: 2,
      userId: 2,
      balance: "1000000000000000000", // 1 ETH in wei
      updatedAt: new Date()
    };

    this.walletBalances.set(1, wallet1);
    this.walletBalances.set(2, wallet2);

    // Update counters
    this.currentUserId = 3;
    this.currentContentId = 4;
    this.currentWalletId = 3;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      totalEarnings: "0",
      totalSpent: "0",
      contentIds: [],
      streamIds: []
    };
    
    this.users.set(this.currentUserId, user);
    this.currentUserId++;
    return user;
  }

  // Content operations
  async getContent(id: number): Promise<Content | undefined> {
    return this.content.get(id);
  }

  async getAllContent(): Promise<Content[]> {
    return Array.from(this.content.values());
  }

  async getContentByCreator(creatorId: number): Promise<Content[]> {
    const user = this.users.get(creatorId);
    if (!user) return [];
    
    return Array.from(this.content.values()).filter(
      content => content.creator === user.walletAddress
    );
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const newContent: Content = {
      id: this.currentContentId,
      ...insertContent,
      creator: insertContent.creator || "0x0000000000000000000000000000000000000000",
      isActive: true,
      totalViews: 0,
      totalEarnings: "0",
      createdAt: new Date()
    };
    
    this.content.set(this.currentContentId, newContent);
    this.currentContentId++;
    return newContent;
  }

  async updateContent(id: number, updates: Partial<InsertContent>): Promise<Content | undefined> {
    const content = this.content.get(id);
    if (!content) return undefined;
    
    const updated = { ...content, ...updates };
    this.content.set(id, updated);
    return updated;
  }

  async deleteContent(id: number): Promise<boolean> {
    return this.content.delete(id);
  }

  // Stream operations
  async getStream(id: number): Promise<Stream | undefined> {
    return this.streams.get(id);
  }

  async getActiveStreams(userId: number): Promise<Stream[]> {
    const user = this.users.get(userId);
    if (!user) return [];
    
    return Array.from(this.streams.values()).filter(
      stream => stream.isActive && (stream.buyer === user.walletAddress || stream.seller === user.walletAddress)
    );
  }

  async getStreamsByContent(contentId: number): Promise<Stream[]> {
    return Array.from(this.streams.values()).filter(
      stream => stream.contentId === contentId
    );
  }

  async createStream(insertStream: InsertStream): Promise<Stream> {
    const stream: Stream = {
      id: this.currentStreamId,
      ...insertStream,
      startTime: new Date(),
      totalMinutes: 0,
      totalCost: "0",
      isActive: true,
      lastPaymentTime: new Date(),
      createdAt: new Date()
    };
    
    this.streams.set(this.currentStreamId, stream);
    this.currentStreamId++;
    return stream;
  }

  async updateStream(id: number, updates: Partial<InsertStream>): Promise<Stream | undefined> {
    const stream = this.streams.get(id);
    if (!stream) return undefined;
    
    const updated = { ...stream, ...updates };
    this.streams.set(id, updated);
    return updated;
  }

  async endStream(id: number): Promise<Stream | undefined> {
    const stream = this.streams.get(id);
    if (!stream) return undefined;
    
    stream.isActive = false;
    stream.endTime = new Date();
    this.streams.set(id, stream);
    return stream;
  }

  // Transaction operations
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      id: this.currentTransactionId,
      ...insertTransaction,
      timestamp: new Date()
    };
    
    this.transactions.set(this.currentTransactionId, transaction);
    this.currentTransactionId++;
    return transaction;
  }

  async getTransactionsByStream(streamId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.streamId === streamId
    );
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    const user = this.users.get(userId);
    if (!user) return [];
    
    return Array.from(this.transactions.values()).filter(
      transaction => transaction.from === user.walletAddress || transaction.to === user.walletAddress
    );
  }

  // Wallet operations
  async getWalletBalance(userId: number): Promise<WalletBalance | undefined> {
    return this.walletBalances.get(userId);
  }

  async updateWalletBalance(userId: number, balance: string): Promise<WalletBalance> {
    const existing = this.walletBalances.get(userId);
    const updated: WalletBalance = {
      id: existing?.id || this.currentWalletId++,
      userId,
      balance,
      updatedAt: new Date()
    };
    
    this.walletBalances.set(userId, updated);
    return updated;
  }

  // Analytics
  async getSellerStats(sellerId: number): Promise<{
    totalEarnings: string;
    activeStreams: number;
    totalProducts: number;
    averageRating: string;
  }> {
    const user = this.users.get(sellerId);
    if (!user) {
      return {
        totalEarnings: "0",
        activeStreams: 0,
        totalProducts: 0,
        averageRating: "0"
      };
    }

    const userContent = Array.from(this.content.values()).filter(
      content => content.creator === user.walletAddress
    );
    
    const activeStreams = Array.from(this.streams.values()).filter(
      stream => stream.isActive && stream.seller === user.walletAddress
    ).length;

    const totalRating = userContent.reduce((sum, content) => {
      return sum + (parseFloat(content.rating || "0"));
    }, 0);

    const averageRating = userContent.length > 0 ? (totalRating / userContent.length).toFixed(1) : "0";

    return {
      totalEarnings: user.totalEarnings,
      activeStreams,
      totalProducts: userContent.length,
      averageRating
    };
  }

  async getMarketplaceStats(): Promise<{
    totalContent: number;
    activeStreams: number;
    totalRevenue: string;
    totalCreators: number;
  }> {
    const totalContent = this.content.size;
    const activeStreams = Array.from(this.streams.values()).filter(stream => stream.isActive).length;
    
    const totalRevenue = Array.from(this.content.values()).reduce((sum, content) => {
      return sum + parseFloat(content.totalEarnings);
    }, 0);

    const totalCreators = Array.from(this.users.values()).filter(user => user.isCreator).length;

    return {
      totalContent,
      activeStreams,
      totalRevenue: totalRevenue.toString(),
      totalCreators
    };
  }
}

export const storage = new MemStorage();