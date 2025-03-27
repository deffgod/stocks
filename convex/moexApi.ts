import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * MOEX API Integration Module
 * 
 * This module contains actions for fetching data from the Moscow Exchange (MOEX) API.
 * These actions are meant to be triggered by scheduled cron jobs or HTTP endpoints.
 */

/**
 * Fetches futures data from MOEX API
 */
export const fetchFutures = action({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const limit = args.limit || 100;
      
      // Fetch futures data from MOEX API
      const response = await fetch(
        `https://iss.moex.com/iss/engines/futures/markets/forts/securities.json?limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`MOEX API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process the response into a standardized format
      const securities = processSecuritiesData(data, "futures");
      
      return { success: true, data: securities };
    } catch (error) {
      console.error("Error fetching futures data:", error);
      return { success: false, error: error.message };
    }
  },
});

/**
 * Fetches options data from MOEX API
 */
export const fetchOptions = action({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const limit = args.limit || 100;
      
      // Fetch options data from MOEX API
      const response = await fetch(
        `https://iss.moex.com/iss/engines/futures/markets/options/securities.json?limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`MOEX API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process the response into a standardized format
      const securities = processSecuritiesData(data, "options");
      
      return { success: true, data: securities };
    } catch (error) {
      console.error("Error fetching options data:", error);
      return { success: false, error: error.message };
    }
  },
});

/**
 * Fetches shares (stocks) data from MOEX API
 */
export const fetchShares = action({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const limit = args.limit || 100;
      
      // Fetch shares data from MOEX API
      const response = await fetch(
        `https://iss.moex.com/iss/engines/stock/markets/shares/securities.json?limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`MOEX API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process the response into a standardized format
      const securities = processSecuritiesData(data, "shares");
      
      return { success: true, data: securities };
    } catch (error) {
      console.error("Error fetching shares data:", error);
      return { success: false, error: error.message };
    }
  },
});

/**
 * Fetches funds flow data from MOEX Analytical Products
 */
export const fetchFundsFlow = action({
  args: {
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Use provided date or current date
      const date = args.date || new Date().toISOString().split("T")[0];
      
      // Fetch funds flow data from MOEX API (netflow2 endpoint)
      const response = await fetch(
        `https://iss.moex.com/iss/analyticalproducts/netflow2/securities.json?date=${date}`
      );
      
      if (!response.ok) {
        throw new Error(`MOEX API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process the response into a standardized format
      const fundsFlow = processFundsFlowData(data, date);
      
      return { success: true, data: fundsFlow };
    } catch (error) {
      console.error("Error fetching funds flow data:", error);
      return { success: false, error: error.message };
    }
  },
});

/**
 * Fetches details for a specific security by ID
 */
export const fetchSecurityDetails = action({
  args: {
    secid: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const { secid } = args;
      
      // Fetch security details from MOEX API
      const response = await fetch(
        `https://iss.moex.com/iss/securities/${secid}.json`
      );
      
      if (!response.ok) {
        throw new Error(`MOEX API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process the security details
      const securityDetails = processSecurityDetails(data, secid);
      
      return { success: true, data: securityDetails };
    } catch (error) {
      console.error(`Error fetching details for security ${args.secid}:`, error);
      return { success: false, error: error.message };
    }
  },
});

/**
 * Process securities data from MOEX API response
 */
function processSecuritiesData(data, type) {
  const securities = [];
  
  // Extract column names and values
  if (data && data.securities && data.securities.columns && data.securities.data) {
    const columns = data.securities.columns;
    const securitiesData = data.securities.data;
    
    // Extract market data if available
    let marketdata = null;
    if (data.marketdata && data.marketdata.columns && data.marketdata.data) {
      marketdata = {
        columns: data.marketdata.columns,
        data: data.marketdata.data,
      };
    }
    
    // Map each row of data to an object with named properties
    securitiesData.forEach((row, rowIndex) => {
      const security = { type };
      
      // Map columns to properties
      columns.forEach((column, colIndex) => {
        security[column] = row[colIndex];
      });
      
      // Add market data if available
      if (marketdata && rowIndex < marketdata.data.length) {
        marketdata.columns.forEach((column, colIndex) => {
          // Don't overwrite existing properties
          if (!security[column]) {
            security[column] = marketdata.data[rowIndex][colIndex];
          }
        });
      }
      
      // Add lastUpdated timestamp
      security.lastUpdated = Date.now();
      
      securities.push(security);
    });
  }
  
  return securities;
}

/**
 * Process funds flow data from MOEX API response
 */
function processFundsFlowData(data, date) {
  const fundsFlow = [];
  
  if (data && data.securities && data.securities.columns && data.securities.data) {
    const columns = data.securities.columns;
    const flowData = data.securities.data;
    
    flowData.forEach(row => {
      const flowItem = { date };
      
      columns.forEach((column, colIndex) => {
        flowItem[column] = row[colIndex];
      });
      
      // Transform client_type to entityType
      if (flowItem.client_type === 'physical') {
        flowItem.entityType = 'individual';
      } else if (flowItem.client_type === 'legal') {
        flowItem.entityType = 'legal';
      }
      
      // Transform values into numeric amounts with direction
      if (typeof flowItem.value === 'number') {
        flowItem.amount = Math.abs(flowItem.value);
        flowItem.direction = flowItem.value >= 0 ? 'inflow' : 'outflow';
      }
      
      // Add lastUpdated timestamp
      flowItem.lastUpdated = Date.now();
      
      fundsFlow.push(flowItem);
    });
  }
  
  return fundsFlow;
}

/**
 * Process security details from MOEX API response
 */
function processSecurityDetails(data, secid) {
  let details = { secid };
  
  if (data && data.description && data.description.columns && data.description.data) {
    const columns = data.description.columns;
    const rows = data.description.data;
    
    // Process description data
    rows.forEach(row => {
      const name = row[columns.indexOf('name')];
      const value = row[columns.indexOf('value')];
      
      if (name && value !== undefined) {
        details[name] = value;
      }
    });
  }
  
  return details;
} 