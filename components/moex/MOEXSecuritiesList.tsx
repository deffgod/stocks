"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { MOEXSecurity } from "@/types/moex-api"

interface MOEXSecuritiesListProps {
  securities: MOEXSecurity[]
  title?: string
}

export default function MOEXSecuritiesList({ 
  securities, 
  title = "MOEX Securities" 
}: MOEXSecuritiesListProps) {
  const [page, setPage] = useState(0)
  const rowsPerPage = 10
  
  const startRow = page * rowsPerPage
  const endRow = startRow + rowsPerPage
  const paginatedSecurities = securities.slice(startRow, endRow)
  const totalPages = Math.ceil(securities.length / rowsPerPage)

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(prev => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(prev => prev - 1)
    }
  }

  // Format number with 2 decimal places
  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "-"
    return parseFloat(num.toString()).toFixed(2)
  }

  // Format percentage for change
  const formatChange = (change: number | null | undefined) => {
    if (change === null || change === undefined) return "-"
    const value = parseFloat(change.toString())
    return value > 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`
  }

  // Get CSS class for positive/negative change
  const getChangeClass = (change: number | null | undefined) => {
    if (change === null || change === undefined) return ""
    return parseFloat(change.toString()) > 0 
      ? "text-green-600 dark:text-green-400" 
      : "text-red-600 dark:text-red-400"
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {page + 1} / {totalPages > 0 ? totalPages : 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1 || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticker</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Last</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">Open</TableHead>
              <TableHead className="text-right">High</TableHead>
              <TableHead className="text-right">Low</TableHead>
              <TableHead className="text-right">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSecurities.length > 0 ? (
              paginatedSecurities.map((security) => (
                <TableRow key={security.secid}>
                  <TableCell className="font-medium">{security.secid}</TableCell>
                  <TableCell>{security.shortname}</TableCell>
                  <TableCell className="text-right">{formatNumber(security.last)}</TableCell>
                  <TableCell className={`text-right ${getChangeClass(security.change)}`}>
                    {formatChange(security.change)}
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(security.open)}</TableCell>
                  <TableCell className="text-right">{formatNumber(security.high)}</TableCell>
                  <TableCell className="text-right">{formatNumber(security.low)}</TableCell>
                  <TableCell className="text-right">{formatNumber(security.volume)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No securities data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 