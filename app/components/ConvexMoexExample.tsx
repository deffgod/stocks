"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, RefreshCw } from "lucide-react";

// Mock data for the example
const MOCK_SECURITIES = [
  {
    id: "1",
    secid: "SBER",
    shortname: "Сбербанк",
    type: "shares",
    lastPrice: 285.92,
    change: 1.23,
    volume: 5628900,
  },
  {
    id: "2",
    secid: "GAZP",
    shortname: "Газпром",
    type: "shares",
    lastPrice: 168.44,
    change: -0.67,
    volume: 3421500,
  },
  {
    id: "3",
    secid: "LKOH",
    shortname: "Лукойл",
    type: "shares",
    lastPrice: 6784.00,
    change: 0.42,
    volume: 782300,
  },
  {
    id: "4",
    secid: "RIH4",
    shortname: "РТС-3.24",
    type: "futures",
    lastPrice: 165430,
    change: 2.15,
    volume: 1245720,
  },
  {
    id: "5",
    secid: "SiH4",
    shortname: "USD-3.24",
    type: "futures",
    lastPrice: 89742,
    change: -0.83,
    volume: 3567800,
  },
];

/**
 * Example component for displaying MOEX securities data from Convex
 */
export default function ConvexMoexExample() {
  const [securityType, setSecurityType] = useState("shares");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);

  // Static type stats
  const typeStats = [
    { type: "futures", count: 45 },
    { type: "options", count: 67 },
    { type: "shares", count: 89 },
  ];
  
  // Format price for display
  const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";
    return new Intl.NumberFormat("ru-RU", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };
  
  // Format percentage change
  const formatChange = (change) => {
    if (change === null || change === undefined) return "0%";
    const formattedChange = new Intl.NumberFormat("ru-RU", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: "always",
    }).format(change);
    return `${formattedChange}%`;
  };
  
  // Determine badge color based on change
  const getChangeBadgeColor = (change) => {
    if (!change) return "secondary";
    return change > 0 ? "default" : change < 0 ? "destructive" : "secondary";
  };

  // Filter securities based on selected type and search term
  const filteredSecurities = MOCK_SECURITIES.filter(security => {
    // Filter by type
    const typeMatch = securityType === "all" || security.type === securityType;
    
    // Filter by search term
    const searchMatch = searchTerm === "" || 
      security.secid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      security.shortname.toLowerCase().includes(searchTerm.toLowerCase());
      
    return typeMatch && searchMatch;
  }).slice(0, limit);

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>MOEX Securities Data</CardTitle>
        <CardDescription>
          Mock data example (Convex integration pending)
        </CardDescription>
      </CardHeader>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 pb-4">
        {/* Type selection */}
        <div className="flex-1 min-w-[200px]">
          <Select
            value={securityType}
            onValueChange={(value) => setSecurityType(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Security Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="futures">Futures</SelectItem>
              <SelectItem value="options">Options</SelectItem>
              <SelectItem value="shares">Shares</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Limit */}
        <div className="w-32">
          <Select
            value={limit.toString()}
            onValueChange={(value) => setLimit(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Refresh button */}
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Stats */}
      <div className="flex flex-wrap gap-2 pb-4">
        {typeStats.map((stat) => (
          <Badge
            key={stat.type}
            variant={stat.type === securityType ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSecurityType(stat.type)}
          >
            {stat.type}: {stat.count}
          </Badge>
        ))}
      </div>
      
      {/* Securities table */}
      {filteredSecurities.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-right p-3">
                      <div className="flex items-center justify-end gap-1">
                        Price
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="text-right p-3">Change</th>
                    <th className="text-right p-3">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSecurities.map((security) => (
                    <tr key={security.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 font-mono text-sm">{security.secid}</td>
                      <td className="p-3">{security.shortname}</td>
                      <td className="p-3 text-right">
                        {formatPrice(security.lastPrice)}
                      </td>
                      <td className="p-3 text-right">
                        <Badge
                          variant={getChangeBadgeColor(security.change)}
                          className="font-mono"
                        >
                          {formatChange(security.change)}
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-mono">
                        {security.volume 
                          ? new Intl.NumberFormat("ru-RU").format(security.volume) 
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Showing {filteredSecurities.length} securities
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={filteredSecurities.length < limit}>
                Load More
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center py-8 text-muted-foreground">
              No securities found matching your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 