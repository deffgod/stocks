"use client"

import { cn } from "@/lib/utils"
import type { MOEXAnalytics } from "@/types/moex-api"

interface MOEXAnalyticsProps {
  analytics: MOEXAnalytics[]
  title?: string
}

export default function MOEXAnalytics({
  analytics,
  title = "MOEX Analytics"
}: MOEXAnalyticsProps) {
  if (!analytics || analytics.length === 0) {
    return (
      <div className="rounded-lg border p-4">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      </div>
    )
  }

  // Format number with 2 decimal places
  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return "-"
    return parseFloat(num.toString()).toFixed(2)
  }

  // Format percentage
  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-"
    const numValue = parseFloat(value.toString())
    return numValue > 0 ? `+${numValue.toFixed(2)}%` : `${numValue.toFixed(2)}%`
  }

  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {analytics.map((analytic) => (
          <div
            key={analytic.indexid}
            className="rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{analytic.indexid}</span>
              <span className="font-medium">{analytic.shortname || analytic.name}</span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-bold">{formatNumber(analytic.value)}</span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-sm",
                    (analytic.changePercent || 0) > 0
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400"
                  )}
                >
                  {formatPercent(analytic.changePercent)}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500">
                <div>
                  <div>Open</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {formatNumber(analytic.open)}
                  </div>
                </div>
                <div>
                  <div>High</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {formatNumber(analytic.high)}
                  </div>
                </div>
                <div>
                  <div>Low</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {formatNumber(analytic.low)}
                  </div>
                </div>
              </div>
              {analytic.updatetime && (
                <div className="mt-3 text-xs text-gray-500">
                  Last update: {analytic.updatetime}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 