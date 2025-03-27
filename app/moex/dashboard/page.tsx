import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, BarChart3, LineChart, PieChart, TrendingUp, Users } from "lucide-react";
import ConvexMoexExample from "@/app/components/ConvexMoexExample";
import MoexFundsFlowChart from "@/app/components/MoexFundsFlowChart";
import MoexNotifications from "@/app/components/MoexNotifications";

export const metadata: Metadata = {
  title: "MOEX Dashboard | Market Analytics",
  description: "Comprehensive Moscow Exchange (MOEX) data dashboard with real-time updates and analytics",
};

export default function MoexDashboardPage() {
  return (
    <div className="py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">MOEX Market Dashboard</h1>
          <p className="text-muted-foreground max-w-2xl">
            Real-time Moscow Exchange data with automatic updates via Convex. Monitor futures, options, 
            equities, and track funds flow for individual and institutional investors.
          </p>
        </div>
        <Link href="/moex/streaming">
          <Button className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Live Streaming Data
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="securities">Securities</TabsTrigger>
          <TabsTrigger value="fundsflow">Funds Flow</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Securities Tracked</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,350</div>
                <p className="text-xs text-muted-foreground">
                  +180 from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Futures Contracts</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">427</div>
                <p className="text-xs text-muted-foreground">
                  +22 from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Options Contracts</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">843</div>
                <p className="text-xs text-muted-foreground">
                  +35 from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">573K</div>
                <p className="text-xs text-muted-foreground">
                  +4.3% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Securities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Recent securities component will be displayed here
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Funds Flow Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <MoexFundsFlowChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="securities" className="space-y-4">
          <ConvexMoexExample />
        </TabsContent>
        
        <TabsContent value="fundsflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funds Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <MoexFundsFlowChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <MoexNotifications />
        </TabsContent>
      </Tabs>
    </div>
  );
} 