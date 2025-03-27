"use client"

import { cn } from "@/lib/utils"
import type { MOEXSectorPerformance } from "@/types/moex-api"

interface MOEXSectorPerformanceProps {
  sectors: MOEXSectorPerformance[]
  title?: string
}

export default function MOEXSectorPerformance({
  sectors,
  title = "Sector Performance"
}: MOEXSectorPerformanceProps) {
  if (!sectors || sectors.length === 0) {
    return (
      <div className="rounded-lg border p-4">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">No sector data available</p>
        </div>
      </div>
    )
  }

  // Calculate average change percentage for all sectors
  const totalChangePercentage = sectors.reduce((total, sector) => {
    return total + (sector.changePercent || 0)
  }, 0)

  const averageChangePercentage = sectors.length > 0
    ? totalChangePercentage / sectors.length
    : 0

  // Add "All Sectors" at the beginning
  const allSectors = [
    {
      secid: "ALL",
      shortname: "All Sectors",
      value: 0, // Not relevant for this summary
      change: 0, // Not relevant for this summary
      changePercent: averageChangePercentage
    },
    ...sectors
  ]

  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {allSectors.map((sector) => (
          <div
            key={sector.secid}
            className="flex w-full flex-row items-center justify-between text-sm"
          >
            <span className="font-medium">{sector.shortname}</span>
            <span
              className={cn(
                "w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right transition-colors",
                (sector.changePercent || 0) > 0
                  ? "bg-gradient-to-l from-green-300 text-green-800 dark:from-green-950 dark:text-green-400"
                  : "bg-gradient-to-l from-red-300 text-red-800 dark:from-red-950 dark:text-red-500"
              )}
            >
              {(sector.changePercent || 0).toFixed(2) + "%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 