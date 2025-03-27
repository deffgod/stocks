import { cn } from "@/lib/utils"

// Mock data function instead of API call
async function fetchSectorPerformance() {
  // Static mock data for sector performance
  const mockData = [
    { sector: "Technology", changesPercentage: "1.25" },
    { sector: "Healthcare", changesPercentage: "0.78" },
    { sector: "Consumer Cyclical", changesPercentage: "-0.43" },
    { sector: "Financial Services", changesPercentage: "0.92" },
    { sector: "Communication Services", changesPercentage: "0.35" },
    { sector: "Industrials", changesPercentage: "-0.21" },
    { sector: "Consumer Defensive", changesPercentage: "0.56" },
    { sector: "Energy", changesPercentage: "-0.67" },
    { sector: "Basic Materials", changesPercentage: "0.12" },
    { sector: "Real Estate", changesPercentage: "-0.33" },
    { sector: "Utilities", changesPercentage: "0.41" },
  ]
  
  return mockData
}

interface Sector {
  sector: string
  changesPercentage: string
}

export default async function SectorPerformance() {
  const data = (await fetchSectorPerformance()) as Sector[]

  if (!data) {
    return null
  }

  const totalChangePercentage = data.reduce((total, sector) => {
    return total + parseFloat(sector.changesPercentage)
  }, 0)

  const averageChangePercentage =
    (totalChangePercentage / data.length).toFixed(2) + "%"

  const allSectors = {
    sector: "All sectors",
    changesPercentage: averageChangePercentage,
  }
  data.unshift(allSectors)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {data.map((sector: Sector) => (
        <div
          key={sector.sector}
          className="flex w-full flex-row items-center justify-between text-sm"
        >
          <span className="font-medium">{sector.sector}</span>
          <span
            className={cn(
              "w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right transition-colors",
              parseFloat(sector.changesPercentage) > 0
                ? "bg-gradient-to-l from-green-300 text-green-800 dark:from-green-950 dark:text-green-400"
                : "bg-gradient-to-l from-red-300 text-red-800 dark:from-red-950 dark:text-red-500"
            )}
          >
            {parseFloat(sector.changesPercentage).toFixed(2) + "%"}
          </span>
        </div>
      ))}
    </div>
  )
}
