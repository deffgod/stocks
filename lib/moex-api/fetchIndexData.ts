import { fetchMOEX } from "./fetchMOEX"
import { ENDPOINTS, TRADING_SESSIONS } from "./constants"
import type { MOEXIndexData, MOEXQueryParams } from "@/types/moex-api"

/**
 * Fetch index data from MOEX API
 * @param params - Query parameters
 * @returns Processed index data
 */
export async function fetchIndexData(params: MOEXQueryParams = {}) {
  try {
    const response = await fetchMOEX(ENDPOINTS.INDEX_DATA, {
      tradingsession: TRADING_SESSIONS.TOTAL,
      ...params,
    })

    // Extract index data from the response
    if (!response.analytics || !response.analytics.data) {
      return []
    }

    // Map array data to object using column names
    const columns = response.analytics.columns
    const indices = response.analytics.data.map((row) => {
      const index: any = {}
      columns.forEach((col, index) => {
        // Normalize property names
        const propName = col.toLowerCase()
        // Convert percentage-based fields to numbers with proper format
        if (propName === 'changespercent' || propName === 'changepercent') {
          index['changePercent'] = typeof row[index] === 'string' 
            ? parseFloat(row[index]) 
            : row[index]
        } else {
          index[propName] = row[index]
        }
      })
      return index as MOEXIndexData
    })

    return indices
  } catch (error) {
    console.error("Error fetching index data:", error)
    return []
  }
}

/**
 * Get the market indices needed for the dashboard
 * This function fetches the main market indices data
 * @returns Array of main market indices
 */
export async function fetchMainIndices() {
  try {
    // Fetch all indices first
    const allIndices = await fetchIndexData()
    
    // Filter for the main indices (this will depend on MOEX API response format)
    // This is an example - you would need to adjust based on actual data
    const mainIndices = allIndices.filter(index => {
      // Filter for common indices: MOEX, RTS, etc.
      const indexId = index.indexid?.toLowerCase() || ''
      return (
        indexId.includes('moex') || 
        indexId.includes('rts') || 
        indexId.includes('blue') ||
        indexId.includes('broad')
      )
    })
    
    return mainIndices
  } catch (error) {
    console.error("Error fetching main indices:", error)
    return []
  }
} 