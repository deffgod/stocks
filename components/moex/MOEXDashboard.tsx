import MOEXSecuritiesList from "./MOEXSecuritiesList"
import MOEXSectorPerformance from "./MOEXSectorPerformance"
import MOEXAnalytics from "./MOEXAnalytics"
import MOEXIndexData from "./MOEXIndexData"
import type { MOEXSecurity, MOEXSectorPerformance as MOEXSectorType, MOEXAnalytics as MOEXAnalyticsType, MOEXIndexData as MOEXIndexType } from "@/types/moex-api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MOEXDashboardProps {
  securities: MOEXSecurity[]
  sectors: MOEXSectorType[]
  analytics: MOEXAnalyticsType[]
  indices: MOEXIndexType[]
}

export default function MOEXDashboard({
  securities,
  sectors,
  analytics,
  indices
}: MOEXDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">MOEX Dashboard</h1>
        <Link href="/moex/filtered">
          <Button variant="outline">
            Advanced Filtering (GET/POST)
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-8">
        {/* Market Indices */}
        <div>
          <MOEXIndexData indices={indices} title="MOEX Market Indices" />
        </div>

        {/* Main Analytics and Sector Performance */}
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <MOEXAnalytics analytics={analytics} title="Market Analytics" />
          </div>
          <div>
            <MOEXSectorPerformance sectors={sectors} title="Sector Performance" />
          </div>
        </div>

        {/* Securities List */}
        <div>
          <MOEXSecuritiesList securities={securities} title="Top Securities" />
        </div>
      </div>
    </div>
  )
} 