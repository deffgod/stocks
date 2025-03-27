"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, BarList, Title, Subtitle } from "@tremor/react";

// Import either the real or mock hooks based on environment
import { useMockQuery as useQuery } from "./MockProvider";

export default function MoexFundsFlowChart() {
  const [entityType, setEntityType] = useState("all");
  const [dateRange, setDateRange] = useState("7");

  // Get funds flow data with selected filters
  const fundsFlowData = useQuery('api.queries.getFundsFlow', {
    entityType: entityType !== "all" ? entityType : undefined,
    // Calculate date range
    dateFrom: dateRange !== "all" ? getDateNDaysAgo(parseInt(dateRange)) : undefined,
    dateTo: new Date().toISOString().split("T")[0],
    limit: 50,
  });

  // Create chart data
  const chartData = useMemo(() => {
    if (!fundsFlowData) return [];

    // Group data by date and entityType
    const groupedData = {};

    fundsFlowData.forEach((flow) => {
      if (!groupedData[flow.date]) {
        groupedData[flow.date] = { date: flow.date, individual: 0, legal: 0 };
      }
      
      if (flow.entityType === "individual") {
        groupedData[flow.date].individual += flow.direction === "inflow" ? flow.amount : -flow.amount;
      } else if (flow.entityType === "legal") {
        groupedData[flow.date].legal += flow.direction === "inflow" ? flow.amount : -flow.amount;
      }
    });

    // Convert to array and sort by date
    return Object.values(groupedData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [fundsFlowData]);

  // Create bar list data for individual securities
  const securitiesData = useMemo(() => {
    if (!fundsFlowData) return [];
    
    // Group by security and sum the amounts
    const securityFlows = {};
    
    fundsFlowData.forEach((flow) => {
      if (!flow.secid) return;
      
      if (!securityFlows[flow.secid]) {
        securityFlows[flow.secid] = { name: flow.secid, value: 0 };
      }
      
      securityFlows[flow.secid].value += flow.direction === "inflow" ? flow.amount : -flow.amount;
    });
    
    // Convert to array, sort by absolute value, and take top 10
    return Object.values(securityFlows)
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 10)
      .map(item => ({
        ...item,
        name: item.name.toUpperCase(),
        color: item.value > 0 ? "emerald" : "rose"
      }));
  }, [fundsFlowData]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 pb-4">
        <div className="w-40">
          <Select value={entityType} onValueChange={setEntityType}>
            <SelectTrigger>
              <SelectValue placeholder="Investor Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Investors</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="legal">Institutional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-40">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="chart">
        <TabsList className="mb-4">
          <TabsTrigger value="chart">Timeline Chart</TabsTrigger>
          <TabsTrigger value="securities">Top Securities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart">
          {!chartData || chartData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              No funds flow data available for the selected filters
            </div>
          ) : (
            <BarChart
              className="h-80"
              data={chartData}
              index="date"
              categories={["individual", "legal"]}
              colors={["blue", "amber"]}
              stack={false}
              yAxisWidth={60}
              showLegend={true}
              valueFormatter={(value) => `${(value / 1000000).toFixed(2)}M ₽`}
              customTooltip={({ payload }) => {
                if (!payload?.[0]?.payload) return null;
                return (
                  <div className="p-2 bg-white dark:bg-gray-800 border rounded shadow-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {payload[0].payload.date}
                    </div>
                    {payload.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 mt-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }} 
                        />
                        <span>{item.name === "individual" ? "Individual" : "Institutional"}: </span>
                        <span className="font-semibold">
                          {(item.value / 1000000).toFixed(2)}M ₽
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          )}
        </TabsContent>
        
        <TabsContent value="securities">
          {!securitiesData || securitiesData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              No securities data available for the selected filters
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <Title>Top Securities by Funds Flow</Title>
                <Subtitle>Net flow in millions of rubles</Subtitle>
                <BarList
                  data={securitiesData}
                  className="mt-4"
                  valueFormatter={(value) => `${(value / 1000000).toFixed(2)}M ₽`}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to calculate date range
function getDateNDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
} 