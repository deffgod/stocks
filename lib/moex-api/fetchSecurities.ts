/**
 * Functions for fetching securities data from MOEX
 * @packageDocumentation
 */

import { moexAPI } from "./moexAPI"
import { BOARDS, TRADING_SESSIONS } from "./constants"
import type { MOEXSecurity, MOEXQueryParams } from "@/types/moex-api"

/**
 * Default ISS API endpoint for securities
 * @internal
 */
const SECURITIES_ENDPOINT = '/iss/securities.json';

/**
 * Process raw MOEX API response into a structured securities array
 * 
 * @param response - Raw response from MOEX API
 * @returns Array of processed securities objects
 * @internal
 */
function processSecuritiesResponse(response: MOEXBaseResponse): MOEXSecurity[] {
  if (!response.securities || !response.securities.data || !Array.isArray(response.securities.data)) {
    return [];
  }

  const columns = response.securities.columns;
  const securityData = response.securities.data;

  return securityData.map(row => {
    const security: Record<string, any> = {};
    
    // Map columns to object properties
    columns.forEach((col, index) => {
      security[col.toLowerCase()] = row[index];
    });
    
    // Convert to standardized security object
    return {
      secid: security.secid || '',
      shortname: security.shortname || security.name,
      type: security.type || 'unknown',
      lastPrice: typeof security.prevprice === 'number' ? security.prevprice : undefined,
      change: typeof security.change === 'number' ? security.change : undefined,
      changePercent: typeof security.lasttoprevprice === 'number' ? security.lasttoprevprice - 100 : undefined,
      lastUpdated: Date.now(),
      ...security,
    } as MOEXSecurity;
  });
}

/**
 * Fetch securities from MOEX with optional filtering
 * 
 * @param filters - Optional search filters
 * @param start - Starting position for pagination
 * @param limit - Maximum number of securities to return
 * @returns Promise with array of securities
 * @public
 * 
 * @example
 * ```typescript
 * // Fetch all shares
 * const shares = await fetchSecurities({ type: 'shares' });
 * 
 * // Fetch with text search
 * const sberbank = await fetchSecurities({ searchText: 'SBER' });
 * ```
 */
export async function fetchSecurities(
  filters: MOEXSearchFilters = {},
  start: number = 0,
  limit: number = 100
): Promise<MOEXSecurity[]> {
  try {
    // Prepare query parameters
    const query: Record<string, any> = {
      ...filters,
      start,
      limit,
      lang: 'ru'
    };
    
    // Make API call
    const response = await fetchMOEX(SECURITIES_ENDPOINT, query);
    
    // Process response
    return processSecuritiesResponse(response);
  } catch (error) {
    console.error('Error fetching securities:', error);
    return [];
  }
}

/**
 * Fetch securities data by board
 * @param board - Board ID (e.g., TQBR, TQTF)
 * @param params - Additional query parameters
 * @returns Processed securities data
 */
export async function fetchSecuritiesByBoard(
  board: string = BOARDS.TQBR,
  params: MOEXQueryParams = {}
): Promise<MOEXSecurity[]> {
  try {
    // Use the new moexAPI client
    return await moexAPI.getSecuritiesByBoardHistory(board, {
      tradingsession: TRADING_SESSIONS.TOTAL,
      ...params,
    });
  } catch (error) {
    console.error(`Error fetching securities for board ${board}:`, error)
    return []
  }
}

/**
 * Fetch data for a specific security by board
 * @param security - Security ID
 * @param board - Board ID
 * @param params - Additional query parameters
 * @returns Processed security data
 */
export async function fetchSecurityByBoard(
  security: string,
  board: string = BOARDS.TQBR,
  params: MOEXQueryParams = {}
): Promise<MOEXSecurity | null> {
  try {
    // Use the new moexAPI client
    return await moexAPI.getSecurityByBoardHistory(security, board, {
      tradingsession: TRADING_SESSIONS.TOTAL,
      ...params,
    });
  } catch (error) {
    console.error(`Error fetching security ${security} for board ${board}:`, error)
    return null
  }
} 