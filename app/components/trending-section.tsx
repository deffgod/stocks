"use client";

import React from 'react';
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

// Mock data for trending securities
const MOCK_SECURITIES = [
  {
    _id: "1",
    secid: "SBER",
    shortname: "Сбербанк",
    type: "shares",
    lastPrice: 285.42,
    change: 2.35,
    changePercent: 0.0083,
    volume: 12453298,
  },
  {
    _id: "2",
    secid: "GAZP",
    shortname: "Газпром",
    type: "shares",
    lastPrice: 165.77,
    change: -1.23,
    changePercent: -0.0074,
    volume: 8567321,
  },
  {
    _id: "3",
    secid: "LKOH",
    shortname: "Лукойл",
    type: "shares",
    lastPrice: 6788.50,
    change: 45.50,
    changePercent: 0.0067,
    volume: 2345678,
  },
  {
    _id: "4",
    secid: "ROSN",
    shortname: "Роснефть",
    type: "shares",
    lastPrice: 425.15,
    change: -3.85,
    changePercent: -0.009,
    volume: 5678901,
  },
  {
    _id: "5",
    secid: "YNDX",
    shortname: "Яндекс",
    type: "shares",
    lastPrice: 2456.80,
    change: 34.20,
    changePercent: 0.0141,
    volume: 1987654,
  }
];

export interface TrendingSectionProps {
  limit?: number;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ limit = 5 }) => {
  // Use mock data instead of fetching from Convex
  const securities = {
    securities: MOCK_SECURITIES.slice(0, limit)
  };

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