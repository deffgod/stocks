import { fetchMOEX } from "./fetchMOEX"
import type { MOEXBaseResponse, MOEXQueryParams, MOEXPostBody, MOEXRequestOptions } from "@/types/moex-api"

/**
 * Make a POST request to MOEX API
 * @param endpoint - API endpoint
 * @param body - POST request body
 * @param params - Query parameters
 * @param options - Additional request options
 * @returns Parsed API response
 */
export async function postMOEX(
  endpoint: string,
  body: MOEXPostBody,
  params: MOEXQueryParams = {},
  options: Partial<MOEXRequestOptions> = {}
): Promise<MOEXBaseResponse> {
  // Use the base fetchMOEX function with POST method
  const postOptions: MOEXRequestOptions = {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    revalidate: options.revalidate,
    ...options
  }

  return fetchMOEX(endpoint, params, postOptions)
}

/**
 * Search for securities with advanced filters using POST
 * @param filters - Search filters
 * @param params - Additional query parameters
 * @returns Search results
 */
export async function searchSecuritiesPost(
  filters: Record<string, any>,
  params: MOEXQueryParams = {}
): Promise<any[]> {
  try {
    // MOEX doesn't have an official search endpoint for POST
    // This is an example implementation - you'd need to adjust for actual endpoints
    const response = await postMOEX(
      '/securities/search',
      filters,
      params
    )

    // Process and transform the response as needed
    if (!response.securities || !response.securities.data) {
      return []
    }

    // Map array data to objects
    const columns = response.securities.columns
    return response.securities.data.map((row) => {
      const result: Record<string, any> = {}
      columns.forEach((col, index) => {
        result[col.toLowerCase()] = row[index]
      })
      return result
    })
  } catch (error) {
    console.error('Error searching securities:', error)
    return []
  }
}

/**
 * Submit trade orders via POST
 * Note: This is a placeholder example and not an actual MOEX API endpoint
 * MOEX ISS API doesn't have order submission - this would be part of a trading API
 * @param orderData - Order data
 * @returns Order result
 */
export async function submitOrderPost(orderData: Record<string, any>): Promise<any> {
  try {
    // This is an example - MOEX ISS doesn't have order submission
    // You would replace this with the actual order submission endpoint
    const response = await postMOEX(
      '/orders/submit',
      orderData
    )
    
    return response
  } catch (error) {
    console.error('Error submitting order:', error)
    throw new Error('Failed to submit order')
  }
}

/**
 * Bulk data upload via POST
 * @param data - Data to upload
 * @param endpoint - Specific endpoint for the upload
 * @returns Upload result
 */
export async function bulkUploadPost(
  data: Record<string, any>[],
  endpoint: string
): Promise<any> {
  try {
    const response = await postMOEX(
      endpoint,
      { items: data }
    )
    
    return response
  } catch (error) {
    console.error('Error uploading data:', error)
    throw new Error('Failed to upload data')
  }
} 