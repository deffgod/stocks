/**
 * MOEX API Client Library
 * 
 * A comprehensive TypeScript client library for the Moscow Exchange (MOEX) 
 * Information & Statistical Server (ISS) API.
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