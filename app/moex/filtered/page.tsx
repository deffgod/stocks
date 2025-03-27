import { fetchSecuritiesByBoard } from "@/lib/moex-api/fetchSecurities"
import { BOARDS } from "@/lib/moex-api/constants"
import MOEXFilteredSecurities from "@/components/moex/MOEXFilteredSecurities"

export const metadata = {
  title: "MOEX Filtered Securities",
  description: "Filter MOEX securities using GET and POST requests",
}

export default async function MOEXFilteredSecuritiesPage() {
  // Fetch initial securities data for demo
  const securities = await fetchSecuritiesByBoard(BOARDS.TQBR)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">MOEX Filtered Securities</h1>
      <p className="text-gray-500 mb-8">
        This page demonstrates fetching MOEX securities using both GET and POST requests.
      </p>
      
      <MOEXFilteredSecurities initialSecurities={securities || []} />
    </div>
  )
} 