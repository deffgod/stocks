import { fetchMOEX } from "./fetchMOEX"
import { ENDPOINTS, TRADING_SESSIONS } from "./constants"
import type { MOEXSectorPerformance, MOEXQueryParams } from "@/types/moex-api"

/**
 * Fetch sector performance data from MOEX API
 * @param params - Query parameters
 * @returns Processed sector performance data
 */
export async function fetchSectorPerformance(params: MOEXQueryParams = {}) {
  try {
    const response = await fetchMOEX(ENDPOINTS.SECTOR_PERFORMANCE, {
      tradingsession: TRADING_SESSIONS.TOTAL,
      ...params,
    })

    // Extract sector performance data from the response
    if (!response.securities || !response.securities.data) {
      return []
    }

    // Map array data to object using column names
    const columns = response.securities.columns
    const sectors = response.securities.data.map((row) => {
      const sector: any = {}
      columns.forEach((col, index) => {
        // Normalize property names
        const propName = col.toLowerCase()
        // Convert percentage-based fields to numbers with proper format
        if (propName === 'changespercent' || propName === 'changepercent') {
          sector['changePercent'] = typeof row[index] === 'string' 
            ? parseFloat(row[index]) 
            : row[index]
        } else {
          sector[propName] = row[index]
        }
      })
      return sector as MOEXSectorPerformance
    })

    // Filter out non-sector entities if necessary
    // This is a simplification - actual filtering would depend on MOEX API response format
    const filteredSectors = sectors.filter(sector => 
      sector.secid && sector.shortname && typeof sector.value === 'number'
    )

    return filteredSectors
  } catch (error) {
    console.error("Error fetching sector performance:", error)
    return []
  }
} 