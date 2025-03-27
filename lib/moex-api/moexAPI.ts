import { fetchMOEX } from "./fetchMOEX";
import { postMOEX } from "./postMOEX";
import { ENDPOINTS, ENGINES, MARKETS, BOARDS, TRADING_SESSIONS } from "./constants";
import type {
  MOEXBaseResponse,
  MOEXQueryParams,
  MOEXRequestOptions,
  MOEXPostBody,
  MOEXSecurity,
  MOEXTrade,
  MOEXOrderbook,
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
  MOEXCandleInterval,
} from "@/types/moex-api";

/**
 * MOEX API client with comprehensive methods for all endpoints
 */
export class MOEXAPI {
  /**
   * Initialize the MOEX API client
   * @param defaultOptions - Default request options to use for all requests
   */
  constructor(private defaultOptions: Partial<MOEXRequestOptions> = {}) {}

  /**
   * Process MOEX API response data
   * @param response - Raw API response
   * @param blockName - Name of the data block to extract (securities, engines, etc.)
   * @returns Processed data as an array of objects
   */
  private processResponseData<T>(response: MOEXBaseResponse, blockName: string): T[] {
    if (!response[blockName] || !response[blockName].data) {
      return [];
    }

    const columns = response[blockName].columns;
    const data = response[blockName].data;

    return data.map((row) => {
      const item: Record<string, any> = {};
      columns.forEach((col: string, index: number) => {
        item[col.toLowerCase()] = row[index];
      });
      return item as T;
    });
  }

  /**
   * Make a basic API request
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @param options - Request options
   * @returns Raw API response
   */
  async request(
    endpoint: string, 
    params: MOEXQueryParams = {}, 
    options: Partial<MOEXRequestOptions> = {}
  ): Promise<MOEXBaseResponse> {
    return fetchMOEX(endpoint, params, {
      ...this.defaultOptions,
      ...options,
    });
  }

  /**
   * Make a POST API request
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param params - Query parameters
   * @param options - Request options
   * @returns Raw API response
   */
  async postRequest(
    endpoint: string,
    body: MOEXPostBody,
    params: MOEXQueryParams = {},
    options: Partial<MOEXRequestOptions> = {}
  ): Promise<MOEXBaseResponse> {
    return postMOEX(endpoint, body, params, {
      ...this.defaultOptions,
      ...options,
    });
  }

  //
  // SECURITIES METHODS
  //

  /**
   * Get list of securities
   * @param params - Query parameters
   * @returns List of securities
   */
  async getSecurities(params: MOEXQueryParams = {}): Promise<MOEXSecurity[]> {
    const response = await this.request(ENDPOINTS.SECURITIES, params);
    return this.processResponseData<MOEXSecurity>(response, "securities");
  }

  /**
   * Get security details by ID
   * @param securityId - Security ID
   * @param params - Query parameters
   * @returns Security details
   */
  async getSecurityById(securityId: string, params: MOEXQueryParams = {}): Promise<MOEXSecurity | null> {
    const response = await this.request(ENDPOINTS.SECURITY_BY_ID, {
      security: securityId,
      ...params,
    });
    
    const securities = this.processResponseData<MOEXSecurity>(response, "description");
    return securities.length > 0 ? securities[0] : null;
  }

  /**
   * Get indices that include a security
   * @param securityId - Security ID
   * @param params - Query parameters
   * @returns List of indices
   */
  async getSecurityIndices(securityId: string, params: MOEXQueryParams = {}): Promise<any[]> {
    const response = await this.request(ENDPOINTS.SECURITY_INDICES, {
      security: securityId,
      ...params,
    });
    
    return this.processResponseData<any>(response, "indices");
  }

  //
  // ENGINE AND MARKET METHODS
  //

  /**
   * Get list of trading engines
   * @param params - Query parameters
   * @returns List of engines
   */
  async getEngines(params: MOEXQueryParams = {}): Promise<MOEXEngine[]> {
    const response = await this.request(ENDPOINTS.ENGINES, params);
    return this.processResponseData<MOEXEngine>(response, "engines");
  }

  /**
   * Get engine details by ID
   * @param engineId - Engine ID
   * @param params - Query parameters
   * @returns Engine details
   */
  async getEngineById(engineId: string, params: MOEXQueryParams = {}): Promise<MOEXEngine | null> {
    const response = await this.request(ENDPOINTS.ENGINE_BY_ID, {
      engine: engineId,
      ...params,
    });
    
    const engines = this.processResponseData<MOEXEngine>(response, "engine");
    return engines.length > 0 ? engines[0] : null;
  }

  /**
   * Get markets for a specific engine
   * @param engineId - Engine ID
   * @param params - Query parameters
   * @returns List of markets
   */
  async getMarkets(engineId: string, params: MOEXQueryParams = {}): Promise<MOEXMarket[]> {
    const response = await this.request(ENDPOINTS.MARKETS, {
      engine: engineId,
      ...params,
    });
    
    return this.processResponseData<MOEXMarket>(response, "markets");
  }

  /**
   * Get market details by ID
   * @param engineId - Engine ID
   * @param marketId - Market ID
   * @param params - Query parameters
   * @returns Market details
   */
  async getMarketById(engineId: string, marketId: string, params: MOEXQueryParams = {}): Promise<MOEXMarket | null> {
    const response = await this.request(ENDPOINTS.MARKET_BY_ID, {
      engine: engineId,
      market: marketId,
      ...params,
    });
    
    const markets = this.processResponseData<MOEXMarket>(response, "market");
    return markets.length > 0 ? markets[0] : null;
  }

  //
  // BOARD AND BOARD GROUP METHODS
  //

  /**
   * Get boards for a specific market
   * @param engineId - Engine ID
   * @param marketId - Market ID
   * @param params - Query parameters
   * @returns List of boards
   */
  async getBoards(engineId: string, marketId: string, params: MOEXQueryParams = {}): Promise<MOEXBoard[]> {
    const response = await this.request(ENDPOINTS.BOARDS, {
      engine: engineId,
      market: marketId,
      ...params,
    });
    
    return this.processResponseData<MOEXBoard>(response, "boards");
  }

  /**
   * Get board groups for a specific market
   * @param engineId - Engine ID
   * @param marketId - Market ID
   * @param params - Query parameters
   * @returns List of board groups
   */
  async getBoardGroups(engineId: string, marketId: string, params: MOEXQueryParams = {}): Promise<MOEXBoardGroup[]> {
    const response = await this.request(ENDPOINTS.BOARDGROUPS, {
      engine: engineId,
      market: marketId,
      ...params,
    });
    
    return this.processResponseData<MOEXBoardGroup>(response, "boardgroups");
  }

  //
  // MARKET SECURITIES METHODS
  //

  /**
   * Get securities for a specific market
   * @param engineId - Engine ID
   * @param marketId - Market ID
   * @param params - Query parameters
   * @returns List of securities
   */
  async getMarketSecurities(engineId: string, marketId: string, params: MOEXQueryParams = {}): Promise<MOEXSecurity[]> {
    const response = await this.request(ENDPOINTS.MARKET_SECURITIES, {
      engine: engineId,
      market: marketId,
      ...params,
    });
    
    return this.processResponseData<MOEXSecurity>(response, "securities");
  }

  /**
   * Get security from a specific market
   * @param securityId - Security ID
   * @param engineId - Engine ID
   * @param marketId - Market ID
   * @param params - Query parameters
   * @returns Security details
   */
  async getMarketSecurity(
    securityId: string,
    engineId: string,
    marketId: string,
    params: MOEXQueryParams = {}
  ): Promise<MOEXSecurity | null> {
    const response = await this.request(ENDPOINTS.MARKET_SECURITY_BY_ID, {
      security: securityId,
      engine: engineId,
      market: marketId,
      ...params,
    });
    
    const securities = this.processResponseData<MOEXSecurity>(response, "securities");
    return securities.length > 0 ? securities[0] : null;
  }

  /**
   * Get securities for a specific board
   * @param boardId - Board ID
   * @param engineId - Engine ID
   * @param marketId - Market ID
   * @param params - Query parameters
   * @returns List of securities
   */
  async getBoardSecurities(
    boardId: string,
    engineId: string,
    marketId: string,
    params: MOEXQueryParams = {}
  ): Promise<MOEXSecurity[]> {
    const response = await this.request(ENDPOINTS.BOARD_SECURITIES, {
      board: boardId,
      engine: engineId,
      market: marketId,
      ...params,
    });
    
    return this.processResponseData<MOEXSecurity>(response, "securities");
  }

  //
  // TRADING DATA METHODS
  //

  /**
   * Get trades for a specific market
   * @param engineId - Engine ID
   * @param marketId - Market ID
   * @param params - Query parameters
   * @returns List of trades
   */
  async getMarketTrades(engineId: string, marketId: string, params: MOEXQueryParams = {}): Promise<MOEXTrade[]> {
    const response = await this.request(ENDPOINTS.MARKET_TRADES, {
      engine: engineId,
      market: marketId,
      ...params,
    });
    
    return this.processResponseData<MOEXTrade>(response, "trades");
  }

  /**
   * Get trades for a specific security
   * @param securityId - Security ID
   * @param engineId - Engine ID
   * @param marketId - Market ID
   * @param params - Query parameters
   * @returns List of trades
   */
  async getSecurityTrades(
    securityId: string,
    engineId: string,
    marketId: string,
    params: MOEXQueryParams = {}
  ): Promise<MOEXTrade[]> {
    const response = await this.request(ENDPOINTS.SECURITY_TRADES, {
      security: securityId,
      engine: engineId,
      market: marketId,
      ...params,
    });
    
    return this.processResponseData<MOEXTrade>(response, "trades");
  }

  //
  // ORDERBOOK METHODS
  //

  /**
   * Get orderbook for a specific security
   * @param securityId - Security ID
   * @param engineId - Engine ID
   * @param marketId - Market ID
   * @param params - Query parameters
   * @returns Orderbook data
   */
  async getSecurityOrderbook(
    securityId: string,
    engineId: string,
    marketId: string,
    params: MOEXQueryParams = {}
  ): Promise<MOEXOrderbook | null> {
    const response = await this.request(ENDPOINTS.SECURITY_ORDERBOOK, {
      security: securityId,
      engine: engineId,
      market: marketId,
      ...params,
    });
    
    // Process orderbook data - different format than other endpoints
    if (!response.orderbook || !response.orderbook.data) {
      return null;
    }
    
    const columns = response.orderbook.columns;
    const data = response.orderbook.data;
    
    // Create empty orderbook
    const orderbook: MOEXOrderbook = {
      secid: securityId,
      bids: [],
      asks: [],
    };
    
    // Process each row in the orderbook
    data.forEach((row) => {
      const entry: MOEXOrderbookEntry = {
        price: 0,
        quantity: 0,
      };
      
      columns.forEach((col: string, index: number) => {
        if (col.toLowerCase() === 'price') {
          entry.price = row[index];
        } else if (col.toLowerCase() === 'quantity') {
          entry.quantity = row[index];
        }
      });
      
      // Determine if this is a bid or ask
      const buysellIdx = columns.findIndex(col => col.toLowerCase() === 'buysell');
      if (buysellIdx >= 0) {
        if (row[buysellIdx] === 'B') {
          orderbook.bids.push(entry);
        } else {
          orderbook.asks.push(entry);
        }
      }
    });
    
    return orderbook;
  }

  //
  // CANDLES METHODS
  //

  /**
   * Get candles for a specific security
   * @param securityId - Security ID
   * @param engineId - Engine ID
   * @param marketId - Market ID
   * @param interval - Candle interval
   * @param params - Query parameters
   * @returns List of candles
   */
  async getSecurityCandles(
    securityId: string,
    engineId: string,
    marketId: string,
    interval: MOEXCandleInterval = MOEXCandleInterval.DAY1,
    params: MOEXQueryParams = {}
  ): Promise<MOEXCandle[]> {
    const response = await this.request(ENDPOINTS.SECURITY_CANDLES, {
      security: securityId,
      engine: engineId,
      market: marketId,
      interval,
      ...params,
    });
    
    return this.processResponseData<MOEXCandle>(response, "candles");
  }

  //
  // ANALYTICS AND STATISTICS METHODS
  //

  /**
   * Get market analytics
   * @param params - Query parameters
   * @returns List of analytics data
   */
  async getAnalytics(params: MOEXQueryParams = {}): Promise<MOEXAnalytics[]> {
    const response = await this.request(ENDPOINTS.ANALYTICS, params);
    return this.processResponseData<MOEXAnalytics>(response, "analytics");
  }

  /**
   * Get analytics for a specific index
   * @param indexId - Index ID
   * @param params - Query parameters
   * @returns Analytics data
   */
  async getAnalyticsByIndex(indexId: string, params: MOEXQueryParams = {}): Promise<MOEXAnalytics | null> {
    const response = await this.request(ENDPOINTS.ANALYTICS_BY_INDEX, {
      indexid: indexId,
      ...params,
    });
    
    const analytics = this.processResponseData<MOEXAnalytics>(response, "analytics");
    return analytics.length > 0 ? analytics[0] : null;
  }

  /**
   * Get sector performance data
   * @param params - Query parameters
   * @returns Sector performance data
   */
  async getSectorPerformance(params: MOEXQueryParams = {}): Promise<any[]> {
    const response = await this.request(ENDPOINTS.SECTOR_PERFORMANCE, params);
    return this.processResponseData<any>(response, "coefficients");
  }

  //
  // TURNOVERS METHODS
  //

  /**
   * Get market turnovers
   * @param params - Query parameters
   * @returns List of turnovers
   */
  async getTurnovers(params: MOEXQueryParams = {}): Promise<MOEXTurnover[]> {
    const response = await this.request(ENDPOINTS.TURNOVERS, params);
    return this.processResponseData<MOEXTurnover>(response, "turnovers");
  }

  /**
   * Get turnovers for a specific engine
   * @param engineId - Engine ID
   * @param params - Query parameters
   * @returns List of turnovers
   */
  async getEngineTurnovers(engineId: string, params: MOEXQueryParams = {}): Promise<MOEXTurnover[]> {
    const response = await this.request(ENDPOINTS.ENGINE_TURNOVERS, {
      engine: engineId,
      ...params,
    });
    
    return this.processResponseData<MOEXTurnover>(response, "turnovers");
  }

  //
  // CURRENCY METHODS
  //

  /**
   * Get currency rates
   * @param params - Query parameters
   * @returns List of currency rates
   */
  async getCurrencyRates(params: MOEXQueryParams = {}): Promise<MOEXCurrencyRate[]> {
    const response = await this.request(ENDPOINTS.CURRENCY_RATES, params);
    return this.processResponseData<MOEXCurrencyRate>(response, "rates");
  }

  /**
   * Get currency fixing data
   * @param params - Query parameters
   * @returns Currency fixing data
   */
  async getCurrencyFixing(params: MOEXQueryParams = {}): Promise<any[]> {
    const response = await this.request(ENDPOINTS.CURRENCY_FIXING, params);
    return this.processResponseData<any>(response, "fixings");
  }

  //
  // FUTURES AND OPTIONS METHODS
  //

  /**
   * Get futures series
   * @param params - Query parameters
   * @returns List of futures series
   */
  async getFuturesSeries(params: MOEXQueryParams = {}): Promise<MOEXFuturesSeries[]> {
    const response = await this.request(ENDPOINTS.FUTURES_SERIES, params);
    return this.processResponseData<MOEXFuturesSeries>(response, "series");
  }

  /**
   * Get options assets
   * @param params - Query parameters
   * @returns List of options assets
   */
  async getOptionsAssets(params: MOEXQueryParams = {}): Promise<MOEXOptionsAsset[]> {
    const response = await this.request(ENDPOINTS.OPTIONS_ASSETS, params);
    return this.processResponseData<MOEXOptionsAsset>(response, "assets");
  }

  /**
   * Get options asset by ID
   * @param assetId - Asset ID
   * @param params - Query parameters
   * @returns Options asset data
   */
  async getOptionsAssetById(assetId: string, params: MOEXQueryParams = {}): Promise<MOEXOptionsAsset | null> {
    const response = await this.request(ENDPOINTS.OPTIONS_ASSET_BY_ID, {
      asset: assetId,
      ...params,
    });
    
    const assets = this.processResponseData<MOEXOptionsAsset>(response, "asset");
    return assets.length > 0 ? assets[0] : null;
  }

  //
  // HISTORICAL DATA METHODS
  //

  /**
   * Get historical securities data
   * @param params - Query parameters
   * @returns List of historical securities data
   */
  async getSecuritiesHistory(params: MOEXQueryParams = {}): Promise<MOEXSecurity[]> {
    const response = await this.request(ENDPOINTS.SECURITIES_HISTORY, {
      tradingsession: TRADING_SESSIONS.TOTAL,
      ...params,
    });
    
    return this.processResponseData<MOEXSecurity>(response, "securities");
  }

  /**
   * Get historical securities data by board
   * @param boardId - Board ID
   * @param params - Query parameters
   * @returns List of historical securities data
   */
  async getSecuritiesByBoardHistory(boardId: string, params: MOEXQueryParams = {}): Promise<MOEXSecurity[]> {
    const response = await this.request(ENDPOINTS.SECURITIES_BY_BOARD_HISTORY, {
      board: boardId,
      tradingsession: TRADING_SESSIONS.TOTAL,
      ...params,
    });
    
    return this.processResponseData<MOEXSecurity>(response, "securities");
  }

  /**
   * Get historical data for a specific security by board
   * @param securityId - Security ID
   * @param boardId - Board ID
   * @param params - Query parameters
   * @returns Historical security data
   */
  async getSecurityByBoardHistory(
    securityId: string,
    boardId: string,
    params: MOEXQueryParams = {}
  ): Promise<MOEXSecurity | null> {
    const response = await this.request(ENDPOINTS.SECURITY_BY_BOARD_HISTORY, {
      security: securityId,
      board: boardId,
      tradingsession: TRADING_SESSIONS.TOTAL,
      ...params,
    });
    
    const securities = this.processResponseData<MOEXSecurity>(response, "securities");
    return securities.length > 0 ? securities[0] : null;
  }
}

// Export an instance of the API client for convenience
export const moexAPI = new MOEXAPI();

// Also export specific data fetchers that use the API client
export * from "./fetchSecurities";
export * from "./fetchAnalytics";
export * from "./fetchIndexData";
export * from "./fetchSectorPerformance";
export * from "./fetchSecuritiesFiltered"; 