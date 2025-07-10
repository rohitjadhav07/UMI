import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  walletAddress: text("wallet_address"),
  role: text("role").notNull().default("buyer"), // buyer, seller, admin
  createdAt: timestamp("created_at").defaultNow(),
});

// Content table
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // course, game, document, design
  pricePerMinute: decimal("price_per_minute", { precision: 10, scale: 4 }).notNull(),
  duration: integer("duration").notNull(), // in minutes
  thumbnailUrl: text("thumbnail_url"),
  contentUrl: text("content_url").notNull(),
  creatorId: integer("creator_id").references(() => users.id).notNull(),
  tags: json("tags").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalViews: integer("total_views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Streams table (active subscriptions)
export const streams = pgTable("streams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contentId: integer("content_id").references(() => content.id).notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  totalMinutes: integer("total_minutes").default(0),
  totalCost: decimal("total_cost", { precision: 10, scale: 4 }).default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  streamId: integer("stream_id").references(() => streams.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 4 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  type: text("type").notNull(), // stream_payment, stream_start, stream_end
});

// Wallet balances table
export const walletBalances = pgTable("wallet_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  balance: decimal("balance", { precision: 10, scale: 4 }).default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
  totalViews: true,
  rating: true,
});

export const insertStreamSchema = createInsertSchema(streams).omit({
  id: true,
  createdAt: true,
  totalMinutes: true,
  totalCost: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  timestamp: true,
});

export const insertWalletBalanceSchema = createInsertSchema(walletBalances).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;

export type Stream = typeof streams.$inferSelect;
export type InsertStream = z.infer<typeof insertStreamSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type WalletBalance = typeof walletBalances.$inferSelect;
export type InsertWalletBalance = z.infer<typeof insertWalletBalanceSchema>;
