import { unstable_noStore as noStore } from "next/cache"
import { MOEX_API_BASE_URL, DEFAULT_FORMAT, DEFAULT_QUERY_PARAMS } from "./constants"
import type { MOEXBaseResponse, MOEXQueryParams, MOEXRequestOptions } from "@/types/moex-api"

/**
 * Base function to fetch data from MOEX API
 * @param endpoint - API endpoint
 * @param params - Query parameters
 * @param options - Request options (method, body, etc.)
 * @returns Parsed API response
 */
export async function fetchMOEX(
  endpoint: string,
  params: MOEXQueryParams = {},
  options: MOEXRequestOptions = { method: "GET" }
): Promise<MOEXBaseResponse> {
  noStore()

  // Replace path parameters in endpoint if any
  // Example: /path/{param}/data with params.param = "value" becomes /path/value/data
  let processedEndpoint = endpoint
  const pathParams = endpoint.match(/{([^}]+)}/g)
  
  if (pathParams) {
    pathParams.forEach((param) => {
      const paramName = param.slice(1, -1) // Remove { and }
      if (params[paramName]) {
        processedEndpoint = processedEndpoint.replace(param, params[paramName])
        delete params[paramName] // Remove path parameter from query params
      }
    })
  }

  // Prepare query parameters
  const queryParams = new URLSearchParams({
    ...DEFAULT_QUERY_PARAMS,
    ...params,
  })

  // Add format parameter
  queryParams.append("iss.json", "extended")
  queryParams.append("iss.meta", "off")

  // Construct complete URL
  const url = `${MOEX_API_BASE_URL}${processedEndpoint}.${DEFAULT_FORMAT}?${queryParams.toString()}`

  try {
    console.log(`Fetching MOEX data from: ${url} using ${options.method} method`)
    
    const fetchOptions: RequestInit = {
      method: options.method,
      next: {
        revalidate: options.revalidate || 60, // Cache for 60 seconds by default
      },
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
    
    // Add body for POST, PUT, PATCH requests
    if (options.method !== "GET" && options.method !== "HEAD" && options.body) {
      fetchOptions.body = typeof options.body === 'string' 
        ? options.body 
        : JSON.stringify(options.body)
    }
    
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      console.error(`Failed to fetch MOEX data: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to fetch MOEX data: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching MOEX data:", error)
    throw new Error("Failed to fetch MOEX data")
  }
} 