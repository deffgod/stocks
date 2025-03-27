import { moexAPI } from './moexAPI';
import type { MOEXSecurity } from '@/types/moex-api';

/**
 * Fetches trending stocks from the Moscow Exchange
 * 
 * Retrieves the most active securities by volume from MOEX
 * 
 * @param limit Maximum number of securities to return (default: 10)
 * @returns Promise with array of securities sorted by trading volume
 */
export async function fetchTrendingStocks(limit: number = 10): Promise<MOEXSecurity[]> {
  try {
    // Fetch securities from the stock/shares market
    const securities = await moexAPI.getSecurities({
      engine: 'stock',
      market: 'shares',
      // Additional parameters to sort by volume
      sort_column: 'VALTODAY', // Sort by trading volume
      sort_order: 'desc',      // Descending order (highest first)
      limit: limit.toString()
    });

    // Filter out only the most relevant information
    return securities.map(security => ({
      secid: security.secid,
      shortname: security.shortname,
      type: 'shares',
      engine: 'stock',
      market: 'shares',
      lastPrice: parseFloat(security.LAST || '0'),
      change: parseFloat(security.CHANGE || '0'),
      changePercent: parseFloat(security.LASTTOPREVPRICE || '0'),
      volume: parseFloat(security.VALTODAY || '0'),
      value: parseFloat(security.VALTODAY_RUR || '0'),
      additionalData: {
        open: parseFloat(security.OPEN || '0'),
        high: parseFloat(security.HIGH || '0'),
        low: parseFloat(security.LOW || '0'),
        close: parseFloat(security.CLOSE || '0')
      },
      lastUpdated: Date.now(),
    }));
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    return [];
  }
}

/**
 * Mock implementation of fetchTrendingStocks
 * Returns mock data representing trending stocks from MOEX
 */
export async function fetchTrendingStocksMock(limit: number = 10): Promise<MOEXSecurity[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data for trending stocks
  return [
    {
      secid: "SBER",
      shortname: "Сбербанк",
      type: "shares",
      engine: "stock",
      market: "shares",
      lastPrice: 285.42,
      change: 2.35,
      changePercent: 0.0083,
      volume: 12453298,
      value: 3554834256.16,
      additionalData: {
        open: 283.11,
        high: 286.20,
        low: 282.89,
        close: 285.42
      },
      lastUpdated: Date.now(),
    },
    {
      secid: "GAZP",
      shortname: "Газпром",
      type: "shares",
      engine: "stock",
      market: "shares",
      lastPrice: 165.77,
      change: -1.23,
      changePercent: -0.0074,
      volume: 8567321,
      value: 1420187951.17,
      additionalData: {
        open: 167.04,
        high: 167.88,
        low: 165.31,
        close: 165.77
      },
      lastUpdated: Date.now(),
    },
    {
      secid: "LKOH",
      shortname: "Лукойл",
      type: "shares",
      engine: "stock",
      market: "shares",
      lastPrice: 6788.50,
      change: 45.50,
      changePercent: 0.0067,
      volume: 2345678,
      value: 15924276473.00,
      additionalData: {
        open: 6743.00,
        high: 6795.20,
        low: 6736.80,
        close: 6788.50
      },
      lastUpdated: Date.now(),
    },
    {
      secid: "ROSN",
      shortname: "Роснефть",
      type: "shares",
      engine: "stock",
      market: "shares",
      lastPrice: 425.15,
      change: -3.85,
      changePercent: -0.009,
      volume: 5678901,
      value: 2414035760.15,
      additionalData: {
        open: 429.00,
        high: 430.25,
        low: 424.60,
        close: 425.15
      },
      lastUpdated: Date.now(),
    },
    {
      secid: "YNDX",
      shortname: "Яндекс",
      type: "shares",
      engine: "stock",
      market: "shares",
      lastPrice: 2456.80,
      change: 34.20,
      changePercent: 0.0141,
      volume: 1987654,
      value: 4882273175.20,
      additionalData: {
        open: 2422.60,
        high: 2460.00,
        low: 2420.50,
        close: 2456.80
      },
      lastUpdated: Date.now(),
    }
  ].slice(0, limit);
} 