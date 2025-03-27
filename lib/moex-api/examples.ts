/**
 * MOEX API Client Examples
 * 
 * This file contains examples of how to use the MOEX API client to fetch data from the Moscow Exchange.
 */

import { moexAPI } from './moexAPI';
import { ENGINES, MARKETS, BOARDS, INDICES, MOEXCandleInterval } from './constants';

/**
 * Example: Fetch all securities
 * 
 * This example demonstrates how to fetch a list of securities from the MOEX API.
 */
export async function exampleFetchSecurities() {
  try {
    // Fetch all securities with some basic filtering
    const securities = await moexAPI.getSecurities({
      lang: 'en',
      start: 0,
      limit: 20,
    });
    
    console.log(`Retrieved ${securities.length} securities`);
    return securities;
  } catch (error) {
    console.error('Error fetching securities:', error);
    return [];
  }
}

/**
 * Example: Fetch security details
 * 
 * This example demonstrates how to fetch details for a specific security.
 */
export async function exampleFetchSecurityDetails(securityId: string = 'SBER') {
  try {
    // Fetch details for a specific security
    const security = await moexAPI.getSecurityById(securityId);
    
    console.log(`Retrieved details for security ${securityId}:`, security);
    return security;
  } catch (error) {
    console.error(`Error fetching security ${securityId}:`, error);
    return null;
  }
}

/**
 * Example: Fetch securities by market
 * 
 * This example demonstrates how to fetch securities for a specific market.
 */
export async function exampleFetchSecuritiesByMarket(
  engineId: string = ENGINES.STOCK,
  marketId: string = MARKETS.SHARES
) {
  try {
    // Fetch securities for a specific market
    const securities = await moexAPI.getMarketSecurities(engineId, marketId, {
      lang: 'en',
      limit: 20,
    });
    
    console.log(`Retrieved ${securities.length} securities for market ${marketId}`);
    return securities;
  } catch (error) {
    console.error(`Error fetching securities for market ${marketId}:`, error);
    return [];
  }
}

/**
 * Example: Fetch market data
 * 
 * This example demonstrates how to fetch all available markets for an engine.
 */
export async function exampleFetchMarkets(engineId: string = ENGINES.STOCK) {
  try {
    // Fetch all markets for the specified engine
    const markets = await moexAPI.getMarkets(engineId);
    
    console.log(`Retrieved ${markets.length} markets for engine ${engineId}`);
    return markets;
  } catch (error) {
    console.error(`Error fetching markets for engine ${engineId}:`, error);
    return [];
  }
}

/**
 * Example: Fetch recent trades
 * 
 * This example demonstrates how to fetch recent trades for a security.
 */
export async function exampleFetchTrades(
  securityId: string = 'SBER',
  engineId: string = ENGINES.STOCK,
  marketId: string = MARKETS.SHARES
) {
  try {
    // Fetch recent trades for a specific security
    const trades = await moexAPI.getSecurityTrades(securityId, engineId, marketId, {
      limit: 10,
    });
    
    console.log(`Retrieved ${trades.length} trades for security ${securityId}`);
    return trades;
  } catch (error) {
    console.error(`Error fetching trades for security ${securityId}:`, error);
    return [];
  }
}

/**
 * Example: Fetch orderbook
 * 
 * This example demonstrates how to fetch the orderbook for a security.
 */
export async function exampleFetchOrderbook(
  securityId: string = 'SBER',
  engineId: string = ENGINES.STOCK,
  marketId: string = MARKETS.SHARES
) {
  try {
    // Fetch orderbook for a specific security
    const orderbook = await moexAPI.getSecurityOrderbook(securityId, engineId, marketId);
    
    if (orderbook) {
      console.log(`Retrieved orderbook for security ${securityId}:`);
      console.log(`Bids: ${orderbook.bids.length}, Asks: ${orderbook.asks.length}`);
    } else {
      console.log(`No orderbook found for security ${securityId}`);
    }
    
    return orderbook;
  } catch (error) {
    console.error(`Error fetching orderbook for security ${securityId}:`, error);
    return null;
  }
}

/**
 * Example: Fetch candles
 * 
 * This example demonstrates how to fetch candles for a security.
 */
export async function exampleFetchCandles(
  securityId: string = 'SBER',
  engineId: string = ENGINES.STOCK,
  marketId: string = MARKETS.SHARES,
  interval: MOEXCandleInterval = MOEXCandleInterval.DAY1
) {
  try {
    // Fetch candles for a specific security
    const candles = await moexAPI.getSecurityCandles(securityId, engineId, marketId, interval, {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 30 days ago
      till: new Date().toISOString().slice(0, 10), // Today
    });
    
    console.log(`Retrieved ${candles.length} candles for security ${securityId}`);
    return candles;
  } catch (error) {
    console.error(`Error fetching candles for security ${securityId}:`, error);
    return [];
  }
}

/**
 * Example: Fetch index analytics
 * 
 * This example demonstrates how to fetch analytics for a market index.
 */
export async function exampleFetchIndexAnalytics(indexId: string = INDICES.MOEX) {
  try {
    // Fetch analytics for a specific index
    const analytics = await moexAPI.getAnalyticsByIndex(indexId);
    
    console.log(`Retrieved analytics for index ${indexId}:`, analytics);
    return analytics;
  } catch (error) {
    console.error(`Error fetching analytics for index ${indexId}:`, error);
    return null;
  }
}

/**
 * Example: Fetch all market indices
 * 
 * This example demonstrates how to fetch all market indices.
 */
export async function exampleFetchAllIndices() {
  try {
    // Fetch all market indices
    const indices = await moexAPI.getAnalytics();
    
    console.log(`Retrieved ${indices.length} market indices`);
    return indices;
  } catch (error) {
    console.error('Error fetching market indices:', error);
    return [];
  }
}

/**
 * Example: Fetch historical data
 * 
 * This example demonstrates how to fetch historical data for a security.
 */
export async function exampleFetchHistoricalData(
  securityId: string = 'SBER',
  boardId: string = BOARDS.TQBR
) {
  try {
    // Fetch historical data for a specific security on a specific board
    const historicalData = await moexAPI.getSecurityByBoardHistory(securityId, boardId, {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 30 days ago
      till: new Date().toISOString().slice(0, 10), // Today
    });
    
    console.log(`Retrieved historical data for security ${securityId} on board ${boardId}:`, historicalData);
    return historicalData;
  } catch (error) {
    console.error(`Error fetching historical data for security ${securityId}:`, error);
    return null;
  }
}

/**
 * Example: Fetch futures series
 * 
 * This example demonstrates how to fetch futures series.
 */
export async function exampleFetchFuturesSeries() {
  try {
    // Fetch all futures series
    const futuresSeries = await moexAPI.getFuturesSeries();
    
    console.log(`Retrieved ${futuresSeries.length} futures series`);
    return futuresSeries;
  } catch (error) {
    console.error('Error fetching futures series:', error);
    return [];
  }
}

/**
 * Example: Fetch currency rates
 * 
 * This example demonstrates how to fetch currency rates.
 */
export async function exampleFetchCurrencyRates() {
  try {
    // Fetch currency rates
    const currencyRates = await moexAPI.getCurrencyRates();
    
    console.log(`Retrieved ${currencyRates.length} currency rates`);
    return currencyRates;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    return [];
  }
}

// Export all examples
export const examples = {
  fetchSecurities: exampleFetchSecurities,
  fetchSecurityDetails: exampleFetchSecurityDetails,
  fetchSecuritiesByMarket: exampleFetchSecuritiesByMarket,
  fetchMarkets: exampleFetchMarkets,
  fetchTrades: exampleFetchTrades,
  fetchOrderbook: exampleFetchOrderbook,
  fetchCandles: exampleFetchCandles,
  fetchIndexAnalytics: exampleFetchIndexAnalytics,
  fetchAllIndices: exampleFetchAllIndices,
  fetchHistoricalData: exampleFetchHistoricalData,
  fetchFuturesSeries: exampleFetchFuturesSeries,
  fetchCurrencyRates: exampleFetchCurrencyRates,
}; 