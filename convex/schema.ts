import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Schema for MOEX Streaming Service
 * 
 * Defines tables for storing Moscow Exchange (MOEX) data:
 * - securities: Stores futures, options, and other securities data
 * - fundsFlow: Stores data about money flows between individual and legal entities
 * - favorites: User's favorite securities for tracking
 * - notifications: Price change notifications for users
 */
export default defineSchema({
  // Securities table - stores data about futures, options, and other financial instruments
  securities: defineTable({
    // Key fields
    secid: v.string(),           // Security ID (e.g. "SBER", "RIH4")
    shortname: v.optional(v.string()), // Short name (e.g. "Сбербанк", "RTS-3.24")
    type: v.string(),            // Type: "futures", "options", "shares", etc.
    engine: v.optional(v.string()),   // Engine: "stock", "futures", "currency"
    market: v.optional(v.string()),   // Market: "shares", "forts", "options"
    
    // Price data
    lastPrice: v.optional(v.number()),  // Last price
    change: v.optional(v.number()),     // Change in points
    changePercent: v.optional(v.number()), // Change in percent
    volume: v.optional(v.number()),     // Trading volume
    value: v.optional(v.number()),      // Trading value
    
    // Additional data as JSON
    additionalData: v.optional(v.any()),
    
    // Timestamps
    lastUpdated: v.number(),            // Last update timestamp
  })
  .index("by_secid", ["secid"])         // Index for fast lookup by security ID
  .index("by_type", ["type"])           // Index for filtering by security type
  .index("by_type_market", ["type", "market"]), // Index for filtering by type and market
  
  // Funds Flow table - stores data about money flows
  fundsFlow: defineTable({
    date: v.string(),            // Date in YYYY-MM-DD format
    entityType: v.string(),      // "individual" or "legal"
    secid: v.optional(v.string()), // Security ID or null for market totals
    market: v.optional(v.string()), // Market
    amount: v.number(),          // Money amount
    direction: v.string(),       // "inflow" or "outflow"
    lastUpdated: v.number(),     // Last update timestamp
  })
  .index("by_date", ["date"])    // Index for filtering by date
  .index("by_entity_type", ["entityType"]) // Index for filtering by entity type
  .index("by_date_entity_security", ["date", "entityType", "secid"]), // Composite index
  
  // Favorites table - stores user's favorite securities
  favorites: defineTable({
    userId: v.string(),          // User ID
    secid: v.string(),           // Security ID
    name: v.optional(v.string()), // Optional custom name
    addedAt: v.number(),         // Timestamp when added to favorites
  })
  .index("by_user", ["userId"])  // Index for filtering by user
  .index("by_user_security", ["userId", "secid"]) // Index for checking if security is in favorites
  .index("by_secid", ["secid"]), // Index for finding all users who favorited a security
  
  // Notifications table - stores price change notifications
  notifications: defineTable({
    userId: v.string(),          // User ID
    secid: v.string(),           // Security ID
    message: v.string(),         // Notification message
    changePercent: v.optional(v.number()), // Price change percentage
    timestamp: v.number(),       // Notification creation timestamp
    read: v.boolean(),           // Whether notification was read
  })
  .index("by_user", ["userId"])  // Index for filtering by user
  .index("by_user_unread", ["userId", "read"]), // Index for filtering unread notifications
}); 