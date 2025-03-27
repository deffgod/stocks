"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import type { MOEXSecurity, MOEXSearchFilters } from "@/types/moex-api"

interface MOEXFilteredSecuritiesProps {
  initialSecurities: MOEXSecurity[]
}

export default function MOEXFilteredSecurities({ initialSecurities }: MOEXFilteredSecuritiesProps) {
  const [securities, setSecurities] = useState<MOEXSecurity[]>(initialSecurities)
  const [filters, setFilters] = useState<MOEXSearchFilters>({})
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<'GET' | 'POST'>('GET')
  const [error, setError] = useState('')

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const applyFilters = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      // In a real implementation, these would be imported and used directly
      // Here we're dynamically importing to avoid server/client conflicts
      if (method === 'GET') {
        const response = await fetch(`/api/moex/securities-filtered?${new URLSearchParams({
          ...filters as any,
          method: 'GET'
        }).toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch securities')
        }
        
        const data = await response.json()
        setSecurities(data)
      } else {
        // POST method
        const response = await fetch('/api/moex/securities-filtered', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filters,
            method: 'POST'
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch securities')
        }
        
        const data = await response.json()
        setSecurities(data)
      }
    } catch (err: any) {
      console.error('Error filtering securities:', err)
      setError(err.message || 'Failed to filter securities')
    } finally {
      setLoading(false)
    }
  }, [filters, method])

  // Format number with 2 decimal places
  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "-"
    return parseFloat(num.toString()).toFixed(2)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="w-full md:w-1/4">
          <label className="text-sm font-medium">Board</label>
          <Select 
            value={filters.board as string || ''} 
            onValueChange={(value) => handleFilterChange('board', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select board" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TQBR">TQBR (T+2 Shares)</SelectItem>
              <SelectItem value="TQTF">TQTF (T+2 ETFs)</SelectItem>
              <SelectItem value="FQBR">FQBR (Foreign Shares)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/4">
          <label className="text-sm font-medium">Search</label>
          <Input 
            placeholder="Search by ticker or name" 
            value={filters.query || ''}
            onChange={(e) => handleFilterChange('query', e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-1/4">
          <label className="text-sm font-medium">Request Method</label>
          <Select 
            value={method} 
            onValueChange={(value: 'GET' | 'POST') => setMethod(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={applyFilters} 
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </>
          ) : (
            'Apply Filters'
          )}
        </Button>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticker</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Last</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {securities.length > 0 ? (
              securities.slice(0, 10).map((security) => (
                <TableRow key={security.secid}>
                  <TableCell className="font-medium">{security.secid}</TableCell>
                  <TableCell>{security.shortname}</TableCell>
                  <TableCell className="text-right">{formatNumber(security.last)}</TableCell>
                  <TableCell 
                    className={`text-right ${
                      (security.change || 0) > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatNumber(security.change)}%
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(security.volume)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No securities found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-gray-500">
        Showing {securities.length > 10 ? 10 : securities.length} of {securities.length} securities
      </div>
      
      <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900">
        <h3 className="text-sm font-medium">API Request Details</h3>
        <div className="mt-2 text-xs">
          <p><strong>Method:</strong> {method}</p>
          <p><strong>Endpoint:</strong> {method === 'GET' ? '/api/moex/securities-filtered?' + new URLSearchParams(filters as any).toString() : '/api/moex/securities-filtered'}</p>
          {method === 'POST' && (
            <div>
              <p><strong>Body:</strong></p>
              <pre className="mt-1 rounded-md bg-gray-100 p-2 dark:bg-gray-800">
                {JSON.stringify({ filters }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 