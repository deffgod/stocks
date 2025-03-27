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

// Import either the real or mock hooks based on environment
import { useMockQuery as useQuery } from "./MockProvider";

/**
 * Example component for displaying MOEX securities data from Convex
 */
export default function ConvexMoexExample() {
  // State for filters
  const [securityType, setSecurityType] = useState("futures");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(20);
  
  // Get securities with filters
  const securitiesData = useQuery('api.queries.getSecuritiesFiltered', {
    filters: {
      type: securityType,
      searchTerm: searchTerm.length > 0 ? searchTerm : undefined,
    },
    limit,
    skip: 0,
  });
  
  // Get stats for types of securities
  const typeStats = useQuery('api.queries.getSecuritiesTypeStats');
  
  // Format price for display
  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return "N/A";
    return new Intl.NumberFormat("ru-RU", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };
  
  // Format percentage change
  const formatChange = (change: number | null | undefined) => {
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
  const getChangeBadgeColor = (change: number | null | undefined) => {
    if (!change) return "secondary";
    return change > 0 ? "green" : change < 0 ? "destructive" : "secondary";
  };

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>MOEX Securities Data</CardTitle>
        <CardDescription>
          Live data from Moscow Exchange via Convex
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
      {typeStats && (
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
      )}
      
      {/* Loading state */}
      {!securitiesData && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
            <p className="text-center pt-4 text-muted-foreground">
              Loading securities data...
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* No results */}
      {securitiesData && securitiesData.securities.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center py-8 text-muted-foreground">
              No securities found matching your filters.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Securities table */}
      {securitiesData && securitiesData.securities.length > 0 && (
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
                  {securitiesData.securities.map((security) => (
                    <tr key={security._id.id} className="border-b hover:bg-muted/50">
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
              Showing {securitiesData.securities.length} securities
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={!securitiesData.continuationToken}>
                Load More
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 