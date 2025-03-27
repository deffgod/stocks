"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Card className="bg-card">
      <CardContent className="p-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for securities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="default">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchBar; 