import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Mutations for saving and updating MOEX data in the Convex database
 */

/**
 * Save or update a security in the database
 */
export const saveSecurities = mutation({
  args: {
    securities: v.array(
      v.object({
        secid: v.string(),
        shortname: v.optional(v.string()),
        type: v.string(),
        engine: v.optional(v.string()),
        market: v.optional(v.string()),
        SECID: v.optional(v.string()),
        SHORTNAME: v.optional(v.string()),
        LAST: v.optional(v.number()),
        CHANGE: v.optional(v.number()),
        LASTTOPREVPRICE: v.optional(v.number()),
        VOLUME: v.optional(v.number()),
        VALUE: v.optional(v.number()),
        lastPrice: v.optional(v.number()),
        change: v.optional(v.number()),
        changePercent: v.optional(v.number()),
        volume: v.optional(v.number()),
        value: v.optional(v.number()),
        lastUpdated: v.number(),
        // Allow additional fields
        [v.String]: v.any(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { securities } = args;
    const results = { created: 0, updated: 0, failed: 0 };

    for (const security of securities) {
      try {
        // Normalize the data (handle both uppercase and lowercase field names)
        const normalizedSecurity = {
          secid: security.secid || security.SECID,
          shortname: security.shortname || security.SHORTNAME,
          type: security.type,
          engine: security.engine,
          market: security.market,
          lastPrice: security.lastPrice || security.LAST,
          change: security.change || security.CHANGE,
          changePercent: security.changePercent || security.LASTTOPREVPRICE,
          volume: security.volume || security.VOLUME,
          value: security.value || security.VALUE,
          // Copy any other fields
          ...security,
          // Ensure lastUpdated is set
          lastUpdated: security.lastUpdated || Date.now(),
        };

        // Check if security already exists
        const existing = await ctx.db
          .query("securities")
          .withIndex("by_secid", (q) => q.eq("secid", normalizedSecurity.secid))
          .first();

        if (existing) {
          // Update existing security
          await ctx.db.patch(existing._id, normalizedSecurity);
          results.updated++;
        } else {
          // Create new security
          await ctx.db.insert("securities", normalizedSecurity);
          results.created++;
        }
      } catch (error) {
        console.error(`Error saving security ${security.secid}:`, error);
        results.failed++;
      }
    }

    return results;
  },
});

/**
 * Save funds flow data
 */
export const saveFundsFlow = mutation({
  args: {
    fundsFlowData: v.array(
      v.object({
        date: v.string(),
        entityType: v.string(),
        secid: v.optional(v.string()),
        market: v.optional(v.string()),
        amount: v.number(),
        direction: v.string(),
        lastUpdated: v.number(),
        // Allow additional fields
        [v.String]: v.any(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { fundsFlowData } = args;
    const results = { created: 0, updated: 0, failed: 0 };

    for (const flowItem of fundsFlowData) {
      try {
        // Check if similar record exists for the same date, security, and entity type
        const existing = await ctx.db
          .query("fundsFlow")
          .withIndex("by_date_entity_security", (q) =>
            q
              .eq("date", flowItem.date)
              .eq("entityType", flowItem.entityType)
              .eq("secid", flowItem.secid || null)
          )
          .first();

        if (existing) {
          // Update existing record
          await ctx.db.patch(existing._id, flowItem);
          results.updated++;
        } else {
          // Create new record
          await ctx.db.insert("fundsFlow", flowItem);
          results.created++;
        }
      } catch (error) {
        console.error(`Error saving funds flow data:`, error);
        results.failed++;
      }
    }

    return results;
  },
});

/**
 * Add a security to user favorites
 */
export const addToFavorites = mutation({
  args: {
    userId: v.string(),
    secid: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, secid, name } = args;

    // Check if already in favorites
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_security", (q) => q.eq("userId", userId).eq("secid", secid))
      .first();

    if (existing) {
      // Already favorited
      return { success: false, message: "Security already in favorites" };
    }

    // Add to favorites
    const id = await ctx.db.insert("favorites", {
      userId,
      secid,
      name: name || secid,
      addedAt: Date.now(),
    });

    return { success: true, favoriteId: id };
  },
});

/**
 * Remove a security from user favorites
 */
export const removeFromFavorites = mutation({
  args: {
    favoriteId: v.id("favorites"),
  },
  handler: async (ctx, args) => {
    const { favoriteId } = args;
    await ctx.db.delete(favoriteId);
    return { success: true };
  },
});

/**
 * Create a notification for a user based on security price change
 */
export const createNotification = mutation({
  args: {
    userId: v.string(),
    secid: v.string(),
    message: v.string(),
    changePercent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId, secid, message, changePercent } = args;

    // Create notification
    const id = await ctx.db.insert("notifications", {
      userId,
      secid,
      message,
      changePercent,
      timestamp: Date.now(),
      read: false,
    });

    return { success: true, notificationId: id };
  },
});

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const { notificationId } = args;
    await ctx.db.patch(notificationId, { read: true });
    return { success: true };
  },
});

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    // Get all unread notifications for user
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", userId).eq("read", false))
      .collect();
    
    // Update each notification
    for (const notification of notifications) {
      await ctx.db.patch(notification._id, { read: true });
    }
    
    return { success: true, count: notifications.length };
  },
});

/**
 * Delete a notification
 */
export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const { notificationId } = args;
    await ctx.db.delete(notificationId);
    return { success: true };
  },
}); 