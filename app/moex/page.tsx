import { fetchSecuritiesByBoard } from "@/lib/moex-api/fetchSecurities"
import { fetchSectorPerformance } from "@/lib/moex-api/fetchSectorPerformance"
import { fetchAnalytics } from "@/lib/moex-api/fetchAnalytics"
import { fetchMainIndices } from "@/lib/moex-api/fetchIndexData"
import { BOARDS } from "@/lib/moex-api/constants"
import MOEXDashboard from "@/components/moex/MOEXDashboard"

export const metadata = {
  title: "MOEX Dashboard",
  description: "Moscow Exchange (MOEX) Market Dashboard",
}

export default async function MOEXDashboardPage() {
  // Fetch all the data needed for the dashboard in parallel
  const [securities, sectors, analytics, indices] = await Promise.all([
    fetchSecuritiesByBoard(BOARDS.TQBR),
    fetchSectorPerformance(),
    fetchAnalytics(),
    fetchMainIndices(),
  ])

  return (
    <div>
      <MOEXDashboard 
        securities={securities || []}
        sectors={sectors || []}
        analytics={analytics || []}
        indices={indices || []}
      />
    </div>
  )
} 