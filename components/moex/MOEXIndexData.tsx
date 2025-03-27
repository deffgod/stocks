"use client"

import { cn } from "@/lib/utils"
import type { MOEXIndexData } from "@/types/moex-api"
import { ArrowDown, ArrowUp } from "lucide-react"

interface MOEXIndexDataProps {
  indices: MOEXIndexData[]
  title?: string
}

export default function MOEXIndexData({
  indices,
  title = "Market Indices"
}: MOEXIndexDataProps) {
  if (!indices || indices.length === 0) {
    return (
      <div className="rounded-lg border p-4">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">No index data available</p>
        </div>
      </div>
    )
  }

  // Format number with 2 decimal places
  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "-"
    return parseFloat(num.toString()).toFixed(2)
  }

  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indices.map((index) => {
          const isPositive = (index.changePercent || 0) > 0
          return (
            <div
              key={index.indexid}
              className="rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-xl font-medium">{index.shortname}</span>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-2xl font-bold">{formatNumber(index.value)}</span>
                  <div className="flex items-center">
                    <span
                      className={cn(
                        "flex items-center font-medium",
                        isPositive
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {isPositive ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      {formatNumber(Math.abs(index.change || 0))}
                    </span>
                    <span
                      className={cn(
                        "ml-2 rounded-md px-2 py-0.5 text-sm",
                        isPositive
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400"
                      )}
                    >
                      {isPositive ? '+' : ''}{(index.changePercent || 0).toFixed(2)}%
                    </span>
                  </div>
                </div>
                {index.updatetime && (
                  <div className="mt-3 text-xs text-gray-500">
                    Last update: {index.updatetime}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 