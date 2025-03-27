/**
 * Type definitions for MOEX API
 */

/**
 * Enumeration of candle intervals
 */
export enum MOEXCandleInterval {
  MIN1 = '1',      // 1 minute
  MIN10 = '10',    // 10 minutes
  HOUR1 = '60',    // 1 hour
  DAY1 = '24',     // 1 day
  WEEK1 = '7',     // 1 week
  MONTH1 = '31',   // 1 month
}

/**
 * Basic response structure from MOEX API
 */
export interface MOEXBaseResponse {
  [key: string]: {
    metadata: { [key: string]: any };
    columns: string[];
    data: any[][];
  };
}

/**
 * Query parameters for MOEX API requests
 */
export interface MOEXQueryParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Request options for MOEX API
 */
export interface MOEXRequestOptions {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: MOEXPostBody;
}

/**
 * Post body for MOEX API requests
 */
export interface MOEXPostBody {
  [key: string]: string | number | boolean | Record<string, any>;
}

/**
 * Filters for securities search
 */
export interface MOEXSearchFilters {
  engine?: string;
  market?: string;
  board?: string;
  securityTypes?: string[];
  searchText?: string;
  query?: string;
  [key: string]: any; // Allow for additional filter properties
}

/**
 * Filters for historical data
 */
export interface MOEXHistoryFilters {
  from?: string | Date;
  till?: string | Date;
  date?: string | Date;
  start?: number;
}

/**
 * Security data structure
 */
export interface MOEXSecurity {
  secid: string;
  shortname?: string;
  type: string;
  engine?: string;
  market?: string;
  lastPrice?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  value?: number;
  additionalData?: Record<string, any>;
  lastUpdated: number;
  [key: string]: any;
}

/**
 * Trade data structure
 */
export interface MOEXTrade {
  secid: string;
  tradeno?: number;
  boardid?: string;
  tradetime?: string;
  price?: number;
  quantity?: number;
  value?: number;
  [key: string]: any;
}

/**
 * Order book entry
 */
export interface MOEXOrderbookEntry {
  price: number;
  quantity: number;
}

/**
 * Order book data structure
 */
export interface MOEXOrderbook {
  secid: string;
  asks: MOEXOrderbookEntry[];
  bids: MOEXOrderbookEntry[];
  timestamp?: string;
  spread?: number;
  spread_basis_points?: number;
  [key: string]: any;
}

/**
 * Candle data structure
 */
export interface MOEXCandle {
  secid: string;
  interval?: MOEXCandleInterval;
  open: number;
  close: number;
  high: number;
  low: number;
  value: number;
  volume: number;
  begin?: string;
  end?: string;
  [key: string]: any;
}

/**
 * Analytics data structure
 */
export interface MOEXAnalytics {
  indexid: string;
  shortname?: string;
  date?: string;
  capitalization?: number;
  capitalization_usd?: number;
  value?: number;
  value_usd?: number;
  [key: string]: any;
}

/**
 * Engine data structure
 */
export interface MOEXEngine {
  id: string;
  name?: string;
  title?: string;
  [key: string]: any;
}

/**
 * Market data structure
 */
export interface MOEXMarket {
  id: string;
  name?: string;
  title?: string;
  marketplace?: string;
  engine?: string;
  [key: string]: any;
}

/**
 * Board data structure
 */
export interface MOEXBoard {
  id: string;
  boardid?: string;
  title?: string;
  market?: string;
  engine?: string;
  [key: string]: any;
}

/**
 * Board group data structure
 */
export interface MOEXBoardGroup {
  id: string;
  title?: string;
  market?: string;
  engine?: string;
  [key: string]: any;
}

/**
 * Turnover data structure
 */
export interface MOEXTurnover {
  engine?: string;
  market?: string;
  value?: number;
  currency?: string;
  [key: string]: any;
}

/**
 * Currency rate data structure
 */
export interface MOEXCurrencyRate {
  secid: string;
  shortname?: string;
  rate?: number;
  date?: string;
  [key: string]: any;
}

/**
 * Futures series data structure
 */
export interface MOEXFuturesSeries {
  id: string;
  name?: string;
  shortname?: string;
  [key: string]: any;
}

/**
 * Options asset data structure
 */
export interface MOEXOptionsAsset {
  id: string;
  name?: string;
  shortname?: string;
  [key: string]: any;
}

/**
 * Sector performance data structure
 */
export interface MOEXSectorPerformance {
  indexid: string;
  shortname?: string;
  change?: number;
  changePercent?: number;
  [key: string]: any;
}

/**
 * Index data structure
 */
export interface MOEXIndexData {
  indexid: string;
  shortname?: string;
  value?: number;
  change?: number;
  changePercent?: number;
  [key: string]: any;
} 