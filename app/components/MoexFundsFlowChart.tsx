"use client";

import { useState } from "react";
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

// Mock data for funds flow
const MOCK_CHART_DATA = [
  { date: "2023-05-01", individual: 125, legal: -87 },
  { date: "2023-05-02", individual: 158, legal: 102 },
  { date: "2023-05-03", individual: -45, legal: 67 },
  { date: "2023-05-04", individual: 89, legal: -24 },
  { date: "2023-05-05", individual: 103, legal: 117 },
  { date: "2023-05-06", individual: -56, legal: -38 },
  { date: "2023-05-07", individual: 78, legal: 92 },
];

const MOCK_SECURITIES_DATA = [
  { name: "SBER", value: 125 },
  { name: "GAZP", value: -87 },
  { name: "LKOH", value: 58 },
  { name: "ROSN", value: -45 },
  { name: "YNDX", value: 112 },
  { name: "MTSS", value: -67 },
  { name: "VTBR", value: 34 },
  { name: "GMKN", value: -23 },
  { name: "ALRS", value: 89 },
  { name: "TCSG", value: -12 },
].map(item => ({
  ...item,
  color: item.value > 0 ? "emerald" : "rose"
}));

export default function MoexFundsFlowChart() {
  const [entityType, setEntityType] = useState("all");
  const [dateRange, setDateRange] = useState("7");

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
          <BarChart
            className="h-80"
            data={MOCK_CHART_DATA}
            index="date"
            categories={["individual", "legal"]}
            colors={["blue", "amber"]}
            stack={false}
            yAxisWidth={60}
            showLegend={true}
            valueFormatter={(value) => `${(value).toFixed(2)}M ₽`}
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
                        {(item.value).toFixed(2)}M ₽
                      </span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
        </TabsContent>
        
        <TabsContent value="securities">
          <Card>
            <CardContent className="p-6">
              <Title>Top Securities by Funds Flow</Title>
              <Subtitle>Net flow in millions of rubles</Subtitle>
              <BarList
                data={MOCK_SECURITIES_DATA}
                className="mt-4"
                valueFormatter={(value) => `${(value).toFixed(2)}M ₽`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 