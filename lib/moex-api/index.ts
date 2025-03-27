/**
 * MOEX API Client Library
 * 
 * This library provides a set of functions for interacting with the Moscow Exchange (MOEX) ISS API.
 * It allows fetching securities data, historical prices, order books, and other market information.
 * 
 * @packageDocumentation
 */

// Export the main API client and instance
export { MOEXAPI, moexAPI } from './moexAPI';

// Export type definitions
export type {
  MOEXBaseResponse,
  MOEXQueryParams,
  MOEXRequestOptions,
  MOEXPostBody,
  MOEXSecurity,
  MOEXTrade,
  MOEXOrderbook,
  MOEXOrderbookEntry,
  MOEXCandle,
  MOEXAnalytics,
  MOEXEngine,
  MOEXMarket,
  MOEXBoard,
  MOEXBoardGroup,
  MOEXTurnover,
  MOEXCurrencyRate,
  MOEXFuturesSeries,
  MOEXOptionsAsset,
  MOEXSectorPerformance,
  MOEXIndexData,
  MOEXSearchFilters,
  MOEXHistoryFilters,
} from '@/types/moex-api';

// Export enums and constants
export { MOEXCandleInterval } from '@/types/moex-api';
export {
  ENDPOINTS,
  ENGINES,
  MARKETS,
  BOARDS,
  INDICES,
  TRADING_SESSIONS,
  MOEX_API_BASE_URL,
  DEFAULT_FORMAT,
  DEFAULT_QUERY_PARAMS
} from './constants';

// Export base fetcher functions
export { fetchMOEX } from './fetchMOEX';
export { postMOEX } from './postMOEX';

// Export specialized fetchers (backwards compatibility)
export { 
  fetchSecurities,
  fetchSecuritiesByBoard,
  fetchSecurityByBoard
} from './fetchSecurities';
export { fetchAnalytics } from './fetchAnalytics';
export { fetchIndexData } from './fetchIndexData';
export { fetchSectorPerformance } from './fetchSectorPerformance';
export { 
  filterSecuritiesGet as fetchSecuritiesFiltered, 
  filterSecuritiesPost 
} from './fetchSecuritiesFiltered';
export { fetchTrendingStocks } from './fetchTrendingStocks';

// Export examples
export { examples } from './examples';

/**
 * Creates a standard query parameter string from an object
 * @param params - Object containing query parameters
 * @returns Formatted query string
 * @internal
 */
export function createQueryString(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

/**
 * Formats a date object or string into YYYY-MM-DD format required by MOEX API
 * @param date - Date to format
 * @returns Formatted date string
 * @internal
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
} 