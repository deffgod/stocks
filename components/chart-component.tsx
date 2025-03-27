"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockChart from "@/components/chart/StockChart";

const ChartComponent: React.FC = () => {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {/* Use StockChart with default values when no specific security is selected */}
          <StockChart 
            securityId="IMOEX" 
            name="Moscow Exchange Index" 
            interval="1D"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartComponent; 