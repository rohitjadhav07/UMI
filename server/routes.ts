import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { userSchema, contentSchema, streamSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = userSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Content routes
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getContent(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const contentData = contentSchema.parse(req.body);
      const content = await storage.createContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      res.status(400).json({ message: "Invalid content data" });
    }
  });

  app.put("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertContentSchema.partial().parse(req.body);
      const content = await storage.updateContent(id, updates);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContent(id);
      if (!deleted) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  // Stream routes
  app.get("/api/streams/active/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const streams = await storage.getActiveStreams(userId);
      res.json(streams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active streams" });
    }
  });

  app.post("/api/streams", async (req, res) => {
    try {
      const streamData = streamSchema.parse(req.body);
      const stream = await storage.createStream(streamData);
      res.status(201).json(stream);
    } catch (error) {
      res.status(400).json({ message: "Invalid stream data" });
    }
  });

  app.put("/api/streams/:id/end", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const stream = await storage.endStream(id);
      if (!stream) {
        return res.status(404).json({ message: "Stream not found" });
      }
      res.json(stream);
    } catch (error) {
      res.status(500).json({ message: "Failed to end stream" });
    }
  });

  // Wallet routes
  app.get("/api/wallet/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const wallet = await storage.getWalletBalance(userId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet balance" });
    }
  });

  app.put("/api/wallet/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { balance } = req.body;
      const wallet = await storage.updateWalletBalance(userId, balance);
      res.json(wallet);
    } catch (error) {
      res.status(400).json({ message: "Invalid balance data" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/seller/:sellerId", async (req, res) => {
    try {
      const sellerId = parseInt(req.params.sellerId);
      const stats = await storage.getSellerStats(sellerId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch seller stats" });
    }
  });

  app.get("/api/analytics/marketplace", async (req, res) => {
    try {
      const stats = await storage.getMarketplaceStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch marketplace stats" });
    }
  });

  // Creator content routes
  app.get("/api/content/creator/:creatorId", async (req, res) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      const content = await storage.getContentByCreator(creatorId);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch creator content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
