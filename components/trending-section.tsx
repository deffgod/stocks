"use client";

import React from 'react';
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

export interface TrendingSectionProps {
  limit?: number;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ limit = 5 }) => {
  // Fetch trending securities from Convex
  const securities = useQuery(api.queries.getSecuritiesFiltered, {
    filters: {
      type: "shares", // You can change this to "futures" or "options" based on your preference
    },
    limit,
  });

  // Format price change with appropriate sign
  const formatPriceChange = (change: number | undefined, changePercent: number | undefined) => {
    if (change === undefined || changePercent === undefined) return "-";
    
    const changeStr = change.toFixed(2);
    const changePercentStr = (changePercent * 100).toFixed(2);
    
    return (
      <div className="flex items-center">
        {change > 0 ? (
          <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={change > 0 ? "text-green-500" : "text-red-500"}>
          {changeStr} ({changePercentStr}%)
        </span>
      </div>
    );
  };

  // Format volume with appropriate separators
  const formatVolume = (volume: number | undefined) => {
    if (volume === undefined) return "-";
    return new Intl.NumberFormat('ru-RU').format(volume);
  };

  if (!securities) {
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Trending Securities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Trending Securities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {securities.securities.map((security) => (
              <TableRow key={security._id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{security.secid}</span>
                    <Badge variant="outline" className="mt-1">{security.type}</Badge>
                  </div>
                </TableCell>
                <TableCell>{security.shortname || security.secid}</TableCell>
                <TableCell className="text-right font-medium">
                  {security.lastPrice?.toFixed(2) || "-"}
                </TableCell>
                <TableCell className="text-right">
                  {formatPriceChange(security.change, security.changePercent)}
                </TableCell>
                <TableCell className="text-right">
                  {formatVolume(security.volume)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TrendingSection; 