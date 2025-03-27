import { fetchMOEX } from "./fetchMOEX"
import { ENDPOINTS, INDICES, TRADING_SESSIONS } from "./constants"
import type { MOEXAnalytics, MOEXQueryParams } from "@/types/moex-api"

/**
 * Fetch analytics data from MOEX API
 * @param params - Query parameters
 * @returns Processed analytics data
 */
export async function fetchAnalytics(params: MOEXQueryParams = {}) {
  try {
    const response = await fetchMOEX(ENDPOINTS.ANALYTICS, {
      tradingsession: TRADING_SESSIONS.TOTAL,
      ...params,
    })

    // Extract analytics data from the response
    if (!response.analytics || !response.analytics.data) {
      return []
    }

    // Map array data to object using column names
    const columns = response.analytics.columns
    const analytics = response.analytics.data.map((row) => {
      const analytic: any = {}
      columns.forEach((col, index) => {
        analytic[col.toLowerCase()] = row[index]
      })
      return analytic as MOEXAnalytics
    })

    return analytics
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return []
  }
}

/**
 * Fetch analytics data for a specific index
 * @param indexid - Index ID (e.g., IMOEX, RTSI)
 * @param params - Additional query parameters
 * @returns Processed analytics data
 */
export async function fetchAnalyticsByIndex(
  indexid: string = INDICES.MOEX,
  params: MOEXQueryParams = {}
) {
  try {
    const response = await fetchMOEX(ENDPOINTS.ANALYTICS_BY_INDEX, {
      indexid,
      tradingsession: TRADING_SESSIONS.TOTAL,
      ...params,
    })

    // Extract analytics data from the response
    if (!response.analytics || !response.analytics.data || response.analytics.data.length === 0) {
      return null
    }

    // Map array data to object using column names
    const columns = response.analytics.columns
    const analyticData: any = {}
    columns.forEach((col, index) => {
      analyticData[col.toLowerCase()] = response.analytics.data[0][index]
    })

    return analyticData as MOEXAnalytics
  } catch (error) {
    console.error(`Error fetching analytics for index ${indexid}:`, error)
    return null
  }
} 