import { moexAPI } from "./moexAPI"
import { BOARDS, TRADING_SESSIONS } from "./constants"
import type { MOEXSecurity, MOEXQueryParams } from "@/types/moex-api"

/**
 * Fetch securities data from MOEX API
 * @param params - Query parameters
 * @returns Processed securities data
 */
export async function fetchSecurities(params: MOEXQueryParams = {}): Promise<MOEXSecurity[]> {
  try {
    // Use the new moexAPI client
    return await moexAPI.getSecuritiesHistory({
      tradingsession: TRADING_SESSIONS.TOTAL,
      ...params,
    });
  } catch (error) {
    console.error("Error fetching securities:", error)
    return []
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