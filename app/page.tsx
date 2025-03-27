import ChartComponent from "./components/chart-component"
import { TrendingSection } from "./components/trending-section"
import { SearchBar } from "./components/search-bar"
import {
  fetchTrendingStocks as moexFetchTrendingStocks,
} from "@/lib/moex-api"

export default async function Home() {
  const trendingStocksPromise = moexFetchTrendingStocks()
  const trendingStocks = await trendingStocksPromise

  return (
    <main className="flex min-h-screen flex-col items-center p-6 gap-6">
      <div className="z-10 max-w-5xl w-full font-mono text-sm lg:flex gap-4">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4">MOEX Market Data</h1>
          <SearchBar />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="col-span-2">
              <TrendingSection limit={5} />
            </div>
            
            <div className="col-span-2">
              <ChartComponent />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
