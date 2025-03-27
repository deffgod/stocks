"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

export interface TrendingStockProps {
  secid: string;
  shortname?: string;
  lastPrice?: number;
  change?: number;
  changePercent?: number;
  onClick?: () => void;
}

export const TrendingStock: React.FC<TrendingStockProps> = ({
  secid,
  shortname,
  lastPrice,
  change,
  changePercent,
  onClick
}) => {
  const isPositive = change !== undefined && change > 0;
  const displayName = shortname || secid;
  
  // Format price for display
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return "-";
    return price.toFixed(2);
  };
  
  // Format percent change for display
  const formatChangePercent = (percent: number | undefined) => {
    if (percent === undefined) return "-";
    return (percent * 100).toFixed(2) + "%";
  };
  
  return (
    <Card 
      className={`hover:shadow-md transition-all cursor-pointer ${
        isPositive ? "hover:border-green-500/50" : "hover:border-red-500/50"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="font-medium">{displayName}</div>
          <div className="text-sm text-muted-foreground">{secid}</div>
        </div>
        
        <div className="mt-2 font-bold text-lg">
          {formatPrice(lastPrice)}
        </div>
        
        <div className="flex items-center mt-1">
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
          )}
          
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {formatChangePercent(changePercent)}
          </span>
          
          <span className="text-sm text-muted-foreground ml-2">
            {change !== undefined ? (isPositive ? "+" : "") + change.toFixed(2) : "-"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingStock; 