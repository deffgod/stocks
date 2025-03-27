"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock StockChart component
const MockStockChart: React.FC<{ securityId: string; name: string; interval: string }> = ({
  securityId,
  name,
  interval
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-muted/20 rounded-md">
      <div className="text-center mb-2">
        <div className="text-xl font-semibold">{name}</div>
        <div className="text-sm text-muted-foreground">({securityId})</div>
        <div className="text-xs text-muted-foreground mt-1">Interval: {interval}</div>
      </div>
      <div className="w-[90%] h-[60%] relative">
        {/* Mock chart with random data */}
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path
            d="M0,25 L10,20 L20,30 L30,15 L40,25 L50,10 L60,30 L70,25 L80,15 L90,20 L100,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border"></div>
        <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-border"></div>
      </div>
    </div>
  );
};

const ChartComponent: React.FC = () => {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {/* Use MockStockChart instead of the real one */}
          <MockStockChart 
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