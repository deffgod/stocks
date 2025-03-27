import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Queries for the MOEX API integration
 * 
 * This module provides query functions to retrieve data from the database,
 * including securities, funds flow data, favorites, and notifications.
 */

/**
 * Получение ценных бумаг по типу
 */
export const getSecuritiesByType = query({
  args: {
    type: v.string(),
    limit: v.optional(v.number()),
    skip: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    const skip = args.skip || 0;
    
    const result = await ctx.db
      .query("securities")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .order("desc", (q) => q.field("lastUpdated"))
      .paginate({ limit, skip });
    
    return {
      securities: result.page,
      continuationToken: result.continuationToken,
      type: args.type,
    };
  },
});

/**
 * Получение ценных бумаг с фильтрацией
 */
export const getSecuritiesFiltered = query({
  args: {
    filters: v.optional(
      v.object({
        type: v.optional(v.string()),
        market: v.optional(v.string()),
        searchTerm: v.optional(v.string()),
      })
    ),
    limit: v.optional(v.number()),
    skip: v.optional(v.number()),
    continuationToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { filters, limit = 20, skip = 0 } = args;
    
    // Start query builder
    let query = ctx.db.query("securities");
    
    // Apply filters
    if (filters) {
      // Filter by type
      if (filters.type) {
        query = query.withIndex("by_type", (q) => q.eq("type", filters.type));
      }
      
      // Filter by type and market
      if (filters.type && filters.market) {
        query = query.withIndex("by_type_market", (q) => 
          q.eq("type", filters.type).eq("market", filters.market)
        );
      }
      
      // Apply search term filter if provided
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        query = query.filter((q) => 
          q.or(
            q.where("secid", (secid) => secid.toLowerCase().includes(term)),
            q.where("shortname", (name) => name !== null && name.toLowerCase().includes(term))
          )
        );
      }
    }
    
    // Sort by update time (newest first)
    query = query.order("desc");
    
    // Pagination
    if (args.continuationToken) {
      query = query.paginate({ cursor: args.continuationToken, numItems: limit });
    } else {
      query = query.paginate({ skip, numItems: limit });
    }
    
    // Execute the query
    const paginationResult = await query;
    
    return {
      securities: paginationResult.page,
      continuationToken: paginationResult.continuationToken,
      filters: filters || {},
    };
  },
});

/**
 * Получение данных по конкретной ценной бумаге
 */
export const getSecurityById = query({
  args: {
    secid: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("securities")
      .withIndex("by_secid", (q) => q.eq("secid", args.secid))
      .first();
  },
});

/**
 * Получение данных о движении средств с фильтрацией
 */
export const getFundsFlow = query({
  args: {
    entityType: v.optional(v.string()),
    secid: v.optional(v.string()),
    dateFrom: v.optional(v.string()),
    dateTo: v.optional(v.string()),
    limit: v.optional(v.number()),
    skip: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { entityType, secid, dateFrom, dateTo, limit = 50, skip = 0 } = args;
    
    // Start query builder
    let query = ctx.db.query("fundsFlow");
    
    // Apply filters
    if (entityType) {
      query = query.withIndex("by_entity_type", (q) => q.eq("entityType", entityType));
    } else {
      query = query.withIndex("by_date", (q) => q.gt("date", dateFrom || ""));
    }
    
    // Filter by date range
    if (dateFrom || dateTo) {
      query = query.filter((q) => {
        let condition = q.true();
        if (dateFrom) {
          condition = q.and(condition, q.gte(q.field("date"), dateFrom));
        }
        if (dateTo) {
          condition = q.and(condition, q.lte(q.field("date"), dateTo));
        }
        return condition;
      });
    }
    
    // Filter by security
    if (secid) {
      query = query.filter((q) => q.eq(q.field("secid"), secid));
    }
    
    // Sort by date (newest first)
    query = query.order("desc");
    
    // Pagination
    const fundsFlow = await query.paginate({ skip, numItems: limit });
    
    return fundsFlow.page;
  },
});

/**
 * Получение избранных ценных бумаг пользователя
 */
export const getUserFavorites = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    // Get favorites
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    // Get the security details for each favorite
    const favoritesWithDetails = await Promise.all(
      favorites.map(async (favorite) => {
        const security = await ctx.db
          .query("securities")
          .withIndex("by_secid", (q) => q.eq("secid", favorite.secid))
          .first();
        
        return {
          ...favorite,
          securityDetails: security || null,
        };
      })
    );
    
    return favoritesWithDetails;
  },
});

/**
 * Получение уведомлений пользователя
 */
export const getUserNotifications = query({
  args: {
    userId: v.string(),
    unreadOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    skip: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId, unreadOnly = false, limit = 20, skip = 0 } = args;
    
    // Query notifications
    let query = ctx.db.query("notifications");
    
    if (unreadOnly) {
      query = query.withIndex("by_user_unread", (q) => 
        q.eq("userId", userId).eq("read", false)
      );
    } else {
      query = query.withIndex("by_user", (q) => q.eq("userId", userId));
    }
    
    // Sort by timestamp (newest first)
    query = query.order("desc");
    
    // Pagination
    const notifications = await query.paginate({ skip, numItems: limit });
    
    return notifications.page;
  },
});

/**
 * Получение статистики по типам ценных бумаг
 */
export const getSecuritiesTypeStats = query({
  handler: async (ctx) => {
    // Get all securities
    const securities = await ctx.db.query("securities").collect();
    
    // Group by type and count
    const typeStats = securities.reduce((stats, security) => {
      const type = security.type;
      if (!stats[type]) {
        stats[type] = 0;
      }
      stats[type]++;
      return stats;
    }, {});
    
    // Convert to array of { type, count }
    return Object.entries(typeStats).map(([type, count]) => ({
      type,
      count,
    }));
  },
});

/**
 * Get funds flow trend data by date
 */
export const getFundsFlowTrend = query({
  args: {
    dateFrom: v.optional(v.string()),
    dateTo: v.optional(v.string()),
    entityType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { dateFrom, dateTo, entityType } = args;
    
    // Start query builder
    let query = ctx.db.query("fundsFlow");
    
    // Apply filters
    if (entityType) {
      query = query.withIndex("by_entity_type", (q) => q.eq("entityType", entityType));
    } else {
      query = query.withIndex("by_date", (q) => q.gt("date", dateFrom || ""));
    }
    
    // Filter by date range
    if (dateFrom || dateTo) {
      query = query.filter((q) => {
        let condition = q.true();
        if (dateFrom) {
          condition = q.and(condition, q.gte(q.field("date"), dateFrom));
        }
        if (dateTo) {
          condition = q.and(condition, q.lte(q.field("date"), dateTo));
        }
        return condition;
      });
    }
    
    // Get all matching funds flow data
    const fundsFlowData = await query.collect();
    
    // Aggregate by date and entity type
    const trendData = fundsFlowData.reduce((result, item) => {
      const key = `${item.date}_${item.entityType}`;
      
      if (!result[key]) {
        result[key] = {
          date: item.date,
          entityType: item.entityType,
          netFlow: 0,
          totalVolume: 0,
        };
      }
      
      const amount = item.amount || 0;
      result[key].totalVolume += amount;
      
      if (item.direction === "inflow") {
        result[key].netFlow += amount;
      } else {
        result[key].netFlow -= amount;
      }
      
      return result;
    }, {});
    
    // Convert to array and sort by date
    return Object.values(trendData).sort((a, b) => 
      a.date.localeCompare(b.date)
    );
  },
});

/**
 * Get user notification count (unread)
 */
export const getUnreadNotificationCount = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    
    const count = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => 
        q.eq("userId", userId).eq("read", false)
      )
      .count();
    
    return { count };
  },
});

/**
 * Get old notifications (for cleanup)
 */
export const getOldNotifications = query({
  args: {
    cutoffTimestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const { cutoffTimestamp } = args;
    
    // Get notifications older than the cutoff date
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.lt(q.field("timestamp"), cutoffTimestamp))
      .collect();
    
    return notifications;
  },
});

/**
 * Get users who have a security in their favorites
 */
export const getUsersFavorites = query({
  args: {
    secid: v.string(),
  },
  handler: async (ctx, args) => {
    const { secid } = args;
    
    // Get users who have this security in favorites
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_secid", (q) => q.eq("secid", secid))
      .collect();
    
    return favorites;
  },
}); 