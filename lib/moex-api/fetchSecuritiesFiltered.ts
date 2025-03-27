import { fetchMOEX } from "./fetchMOEX"
import { postMOEX } from "./postMOEX"
import { ENDPOINTS, BOARDS, TRADING_SESSIONS } from "./constants"
import type { MOEXSecurity, MOEXQueryParams, MOEXSearchFilters } from "@/types/moex-api"

/**
 * Filter securities using GET parameters
 * @param filters - Filter parameters to apply
 * @returns Filtered securities
 */
export async function filterSecuritiesGet(filters: MOEXSearchFilters = {}): Promise<MOEXSecurity[]> {
  try {
    // Build query parameters from filters
    const queryParams: MOEXQueryParams = {
      tradingsession: TRADING_SESSIONS.TOTAL,
    }
    
    // Add filters to query params
    if (filters.engine) queryParams.engine = filters.engine
    if (filters.market) queryParams.market = filters.market
    if (filters.board) queryParams.board = filters.board
    if (filters.query) queryParams.q = filters.query
    
    // Pass all other filters directly as query params
    Object.entries(filters).forEach(([key, value]) => {
      if (!['engine', 'market', 'board', 'query', 'securityTypes'].includes(key)) {
        queryParams[key] = value
      }
    })
    
    // Determine the endpoint based on filters
    let endpoint = ENDPOINTS.SECURITIES
    
    if (filters.board) {
      endpoint = ENDPOINTS.SECURITIES_BY_BOARD
    }
    
    // Make the GET request
    const response = await fetchMOEX(endpoint, queryParams)
    
    // Extract securities data from the response
    if (!response.securities || !response.securities.data) {
      return []
    }
    
    // Map array data to object using column names
    const columns = response.securities.columns
    const securities = response.securities.data.map((row) => {
      const security: any = {}
      columns.forEach((col, index) => {
        security[col.toLowerCase()] = row[index]
      })
      return security as MOEXSecurity
    })
    
    // Apply any client-side filtering (e.g., for securityTypes)
    if (filters.securityTypes && filters.securityTypes.length > 0) {
      return securities.filter(sec => 
        filters.securityTypes?.includes(sec.secid.substring(0, 2))
      )
    }
    
    return securities
  } catch (error) {
    console.error("Error filtering securities with GET:", error)
    return []
  }
}

/**
 * Filter securities using POST with request body
 * This demonstrates how you would use a POST request if MOEX supported it
 * Note: MOEX's ISS API primarily uses GET, this is for demonstration purposes
 * @param filters - Filter criteria
 * @returns Filtered securities
 */
export async function filterSecuritiesPost(filters: MOEXSearchFilters = {}): Promise<MOEXSecurity[]> {
  try {
    // In a real implementation, this would use a MOEX POST endpoint if one existed
    // For this example, we're using the same endpoint as GET but with POST method
    // and moving filters to the request body instead of query params
    
    // Basic query params
    const queryParams: MOEXQueryParams = {
      tradingsession: TRADING_SESSIONS.TOTAL
    }
    
    // Body parameters for the POST request
    const requestBody = {
      filters: {
        ...filters,
        // Format certain filters specifically for the API
        securityTypes: filters.securityTypes ? filters.securityTypes.join(',') : undefined
      },
      // Add other POST-specific parameters as needed
      pageSize: 100,
      sortBy: 'volume',
      sortDirection: 'desc'
    }
    
    // Determine the endpoint based on basic filters
    let endpoint = '/securities/filter' // Example custom endpoint
    
    // Make the POST request
    const response = await postMOEX(endpoint, requestBody, queryParams)
    
    // Extract securities data from the response
    if (!response.securities || !response.securities.data) {
      return []
    }
    
    // Map array data to object using column names
    const columns = response.securities.columns
    const securities = response.securities.data.map((row) => {
      const security: any = {}
      columns.forEach((col, index) => {
        security[col.toLowerCase()] = row[index]
      })
      return security as MOEXSecurity
    })
    
    return securities
  } catch (error) {
    console.error("Error filtering securities with POST:", error)
    // Fall back to GET method if POST fails or is not supported
    console.log("Falling back to GET method for securities filtering")
    return filterSecuritiesGet(filters)
  }
} 