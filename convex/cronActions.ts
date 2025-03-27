import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Cron Action Handlers for MOEX API
 * 
 * These functions are called by scheduled cron jobs to update data from the MOEX API.
 * Each action fetches fresh data and saves it to the Convex database.
 */

/**
 * Update futures data from MOEX API
 */
export const updateFuturesData = internalAction({
  handler: async (ctx) => {
    try {
      console.log("Starting futures data update...");
      
      // Fetch data from MOEX API
      const futuresResult = await ctx.runAction(internal.moexApi.fetchFutures, {
        limit: 300, // Fetch more data for futures
      });
      
      if (!futuresResult.success) {
        throw new Error(`Failed to fetch futures data: ${futuresResult.error}`);
      }
      
      console.log(`Fetched ${futuresResult.data.length} futures contracts`);
      
      // Save data to database
      const saveResult = await ctx.runMutation(internal.mutations.saveSecurities, {
        securities: futuresResult.data,
      });
      
      // Check for significant price changes and create notifications for users
      await checkForPriceChanges(ctx, futuresResult.data);
      
      return {
        success: true,
        message: `Futures data updated successfully. Created: ${saveResult.created}, Updated: ${saveResult.updated}`,
        stats: saveResult,
      };
    } catch (error) {
      console.error("Error updating futures data:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

/**
 * Update options data from MOEX API
 */
export const updateOptionsData = internalAction({
  handler: async (ctx) => {
    try {
      console.log("Starting options data update...");
      
      // Fetch data from MOEX API
      const optionsResult = await ctx.runAction(internal.moexApi.fetchOptions, {
        limit: 300, // Fetch more data for options
      });
      
      if (!optionsResult.success) {
        throw new Error(`Failed to fetch options data: ${optionsResult.error}`);
      }
      
      console.log(`Fetched ${optionsResult.data.length} options contracts`);
      
      // Save data to database
      const saveResult = await ctx.runMutation(internal.mutations.saveSecurities, {
        securities: optionsResult.data,
      });
      
      // Check for significant price changes and create notifications for users
      await checkForPriceChanges(ctx, optionsResult.data);
      
      return {
        success: true,
        message: `Options data updated successfully. Created: ${saveResult.created}, Updated: ${saveResult.updated}`,
        stats: saveResult,
      };
    } catch (error) {
      console.error("Error updating options data:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

/**
 * Update shares (stocks) data from MOEX API
 */
export const updateSharesData = internalAction({
  handler: async (ctx) => {
    try {
      console.log("Starting shares data update...");
      
      // Fetch data from MOEX API
      const sharesResult = await ctx.runAction(internal.moexApi.fetchShares, {
        limit: 300, // Fetch more data for shares
      });
      
      if (!sharesResult.success) {
        throw new Error(`Failed to fetch shares data: ${sharesResult.error}`);
      }
      
      console.log(`Fetched ${sharesResult.data.length} shares`);
      
      // Save data to database
      const saveResult = await ctx.runMutation(internal.mutations.saveSecurities, {
        securities: sharesResult.data,
      });
      
      // Check for significant price changes and create notifications for users
      await checkForPriceChanges(ctx, sharesResult.data);
      
      return {
        success: true,
        message: `Shares data updated successfully. Created: ${saveResult.created}, Updated: ${saveResult.updated}`,
        stats: saveResult,
      };
    } catch (error) {
      console.error("Error updating shares data:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

/**
 * Update funds flow data from MOEX API
 */
export const updateFundsFlowData = internalAction({
  handler: async (ctx) => {
    try {
      console.log("Starting funds flow data update...");
      
      // Use today's date as default
      const date = new Date().toISOString().split("T")[0];
      
      // Fetch data from MOEX API
      const fundsFlowResult = await ctx.runAction(internal.moexApi.fetchFundsFlow, {
        date,
      });
      
      if (!fundsFlowResult.success) {
        throw new Error(`Failed to fetch funds flow data: ${fundsFlowResult.error}`);
      }
      
      console.log(`Fetched ${fundsFlowResult.data.length} funds flow records for ${date}`);
      
      // Save data to database
      const saveResult = await ctx.runMutation(internal.mutations.saveFundsFlow, {
        fundsFlowData: fundsFlowResult.data,
      });
      
      return {
        success: true,
        message: `Funds flow data updated successfully. Created: ${saveResult.created}, Updated: ${saveResult.updated}`,
        stats: saveResult,
      };
    } catch (error) {
      console.error("Error updating funds flow data:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

/**
 * Clean up old notifications
 */
export const cleanupOldNotifications = internalAction({
  handler: async (ctx) => {
    try {
      console.log("Starting cleanup of old notifications...");
      
      // Calculate cutoff date (30 days ago)
      const cutoffTimestamp = Date.now() - 30 * 24 * 60 * 60 * 1000;
      
      // Get all notifications older than the cutoff date
      const oldNotifications = await ctx.runQuery(internal.queries.getOldNotifications, {
        cutoffTimestamp,
      });
      
      // Delete each old notification
      for (const notification of oldNotifications) {
        await ctx.runMutation(internal.mutations.deleteNotification, {
          notificationId: notification._id,
        });
      }
      
      return {
        success: true,
        message: `Cleaned up ${oldNotifications.length} old notifications`,
        count: oldNotifications.length,
      };
    } catch (error) {
      console.error("Error cleaning up old notifications:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

/**
 * Helper function to check for significant price changes and create notifications
 */
async function checkForPriceChanges(ctx, securities) {
  // Price change threshold for notifications (5%)
  const priceChangeThreshold = 0.05;
  
  for (const security of securities) {
    try {
      // Skip if we don't have change data
      if (!security.changePercent && !security.LASTTOPREVPRICE) {
        continue;
      }
      
      // Get change percent (normalize field name)
      const changePercent = Math.abs(security.changePercent || security.LASTTOPREVPRICE || 0);
      
      // If change percent exceeds threshold
      if (changePercent >= priceChangeThreshold) {
        // Get the normalized security ID
        const secid = security.secid || security.SECID;
        const shortname = security.shortname || security.SHORTNAME || secid;
        
        // Find users who have this security in favorites
        const favorites = await ctx.runQuery(internal.queries.getUsersFavorites, {
          secid,
        });
        
        // Create notification for each user
        for (const favorite of favorites) {
          const changeDirection = changePercent > 0 ? "выросла" : "упала";
          
          await ctx.runMutation(internal.mutations.createNotification, {
            userId: favorite.userId,
            secid,
            message: `Цена ${shortname} изменилась на ${changePercent.toFixed(2)}%`,
            changePercent,
          });
        }
      }
    } catch (error) {
      console.error(`Error processing notifications for ${security.secid}:`, error);
      // Continue with the next security
    }
  }
} 