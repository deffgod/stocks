import { NextResponse } from 'next/server'
import { filterSecuritiesGet, filterSecuritiesPost } from '@/lib/moex-api/fetchSecuritiesFiltered'
import type { MOEXSearchFilters } from '@/types/moex-api'

/**
 * Handle GET requests for filtered securities
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Convert search params to filters object
    const filters: MOEXSearchFilters = {}
    
    // Extract common filters
    if (searchParams.has('board')) filters.board = searchParams.get('board') as string
    if (searchParams.has('query')) filters.query = searchParams.get('query') as string
    if (searchParams.has('engine')) filters.engine = searchParams.get('engine') as string
    if (searchParams.has('market')) filters.market = searchParams.get('market') as string
    
    // Handle array parameters
    if (searchParams.has('securityTypes')) {
      const types = searchParams.get('securityTypes')
      filters.securityTypes = types ? types.split(',') : []
    }
    
    // Add any other parameters as direct filters
    searchParams.forEach((value, key) => {
      if (!['board', 'query', 'engine', 'market', 'securityTypes', 'method'].includes(key)) {
        filters[key] = value
      }
    })
    
    // Get filtered securities using GET method
    const securities = await filterSecuritiesGet(filters)
    
    return NextResponse.json(securities)
  } catch (error) {
    console.error('API Error fetching securities with GET:', error)
    return NextResponse.json(
      { error: 'Failed to fetch securities' },
      { status: 500 }
    )
  }
}

/**
 * Handle POST requests for filtered securities
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { filters = {} } = body
    
    // Get filtered securities using POST method
    const securities = await filterSecuritiesPost(filters)
    
    return NextResponse.json(securities)
  } catch (error) {
    console.error('API Error fetching securities with POST:', error)
    return NextResponse.json(
      { error: 'Failed to fetch securities' },
      { status: 500 }
    )
  }
} 