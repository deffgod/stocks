import { Metadata } from "next";
import ConvexMoexExample from "@/app/components/ConvexMoexExample";

export const metadata: Metadata = {
  title: "MOEX Streaming | Real-Time Data",
  description: "Real-time Moscow Exchange data with streaming updates via Convex",
};

export default function MoexStreamingPage() {
  return (
    <div className="py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">MOEX Streaming Data</h1>
        <p className="text-muted-foreground">
          Real-time Moscow Exchange data with automatic updates via Convex
        </p>
      </div>

      <div className="grid gap-8">
        <ConvexMoexExample />
      </div>

      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About MOEX Streaming</h2>
        <p className="mb-4">
          This page demonstrates real-time data from the Moscow Exchange (MOEX) fetched and stored
          using Convex as a backend data platform. The data is automatically refreshed with
          the following schedule:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Futures and Options:</strong> Updated every 5 minutes during trading hours
          </li>
          <li>
            <strong>Funds Flow Data:</strong> Updated daily after market close (approximately 19:00 MSK)
          </li>
          <li>
            <strong>Full Company List:</strong> Updated weekly on Saturday morning
          </li>
        </ul>
        <p className="mt-4">
          The Convex backend maintains a real-time connection with clients, so any changes to the
          data are immediately reflected in the UI without needing to refresh the page.
        </p>
      </div>
    </div>
  );
} 