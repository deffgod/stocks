"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create mock data
const MOCK_SECURITIES = [
  {
    _id: { table: "securities", id: "1" },
    _creationTime: Date.now(),
    secid: "SBER",
    shortname: "Сбербанк",
    type: "shares",
    engine: "stock",
    market: "shares",
    lastPrice: 285.92,
    change: 1.23,
    volume: 5628900,
    updateTime: new Date().toISOString(),
    lastUpdated: Date.now(),
  },
  {
    _id: { table: "securities", id: "2" },
    _creationTime: Date.now(),
    secid: "GAZP",
    shortname: "Газпром",
    type: "shares",
    engine: "stock",
    market: "shares",
    lastPrice: 168.44,
    change: -0.67,
    volume: 3421500,
    updateTime: new Date().toISOString(),
    lastUpdated: Date.now(),
  },
  {
    _id: { table: "securities", id: "3" },
    _creationTime: Date.now(),
    secid: "LKOH",
    shortname: "Лукойл",
    type: "shares",
    engine: "stock",
    market: "shares",
    lastPrice: 6784.00,
    change: 0.42,
    volume: 782300,
    updateTime: new Date().toISOString(),
    lastUpdated: Date.now(),
  },
  {
    _id: { table: "securities", id: "4" },
    _creationTime: Date.now(),
    secid: "RIH4",
    shortname: "РТС-3.24",
    type: "futures",
    engine: "futures",
    market: "forts",
    lastPrice: 165430,
    change: 2.15,
    volume: 1245720,
    updateTime: new Date().toISOString(),
    lastUpdated: Date.now(),
  },
  {
    _id: { table: "securities", id: "5" },
    _creationTime: Date.now(),
    secid: "SiH4",
    shortname: "USD-3.24",
    type: "futures",
    engine: "futures",
    market: "forts",
    lastPrice: 89742,
    change: -0.83,
    volume: 3567800,
    updateTime: new Date().toISOString(),
    lastUpdated: Date.now(),
  },
];

const MOCK_FUNDS_FLOW = [
  {
    _id: { table: "fundsFlow", id: "1" },
    _creationTime: Date.now(),
    date: new Date().toISOString().split("T")[0],
    entityType: "individual",
    secid: "SBER",
    market: "shares",
    amount: 125000000,
    direction: "inflow",
    lastUpdated: Date.now(),
  },
  {
    _id: { table: "fundsFlow", id: "2" },
    _creationTime: Date.now(),
    date: new Date().toISOString().split("T")[0],
    entityType: "legal",
    secid: "SBER",
    market: "shares",
    amount: 87000000,
    direction: "outflow",
    lastUpdated: Date.now(),
  },
  {
    _id: { table: "fundsFlow", id: "3" },
    _creationTime: Date.now(),
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    entityType: "individual",
    secid: "GAZP",
    market: "shares",
    amount: 58000000,
    direction: "inflow",
    lastUpdated: Date.now() - 86400000,
  },
  {
    _id: { table: "fundsFlow", id: "4" },
    _creationTime: Date.now(),
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    entityType: "legal",
    secid: "GAZP",
    market: "shares",
    amount: 102000000,
    direction: "inflow",
    lastUpdated: Date.now() - 86400000,
  },
];

const MOCK_NOTIFICATIONS = [
  {
    _id: { table: "notifications", id: "1" },
    _creationTime: Date.now(),
    userId: "user123",
    secid: "SBER",
    message: "Цена Сбербанк изменилась на +5.23%",
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    _id: { table: "notifications", id: "2" },
    _creationTime: Date.now(),
    userId: "user123",
    secid: "GAZP",
    message: "Цена Газпром изменилась на -3.18%",
    timestamp: Date.now() - 7200000,
    read: false,
  },
  {
    _id: { table: "notifications", id: "3" },
    _creationTime: Date.now(),
    userId: "user123",
    secid: "LKOH",
    message: "Цена Лукойл изменилась на +2.75%",
    timestamp: Date.now() - 86400000,
    read: true,
  },
];

// Create mock context
const MockConvexContext = createContext<{
  useQuery: <T>(queryFn: string, args: any) => T | null;
  useMutation: (mutationFn: any) => (args: any) => Promise<any>;
}>({
  useQuery: () => null,
  useMutation: () => () => Promise.resolve(),
});

// Create mock hooks
export function useMockQuery<T>(queryFn: string, args: any): T | null {
  const [data, setData] = useState<T | null>(null);
  
  useEffect(() => {
    // Simulate network delay
    const timeout = setTimeout(() => {
      // Mock query responses based on the query function
      if (queryFn === 'api.queries.getSecuritiesFiltered') {
        const { filters, limit } = args;
        let filteredSecurities = [...MOCK_SECURITIES];
        
        if (filters?.type) {
          filteredSecurities = filteredSecurities.filter(s => s.type === filters.type);
        }
        
        if (filters?.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          filteredSecurities = filteredSecurities.filter(
            s => s.secid.toLowerCase().includes(term) || s.shortname.toLowerCase().includes(term)
          );
        }
        
        const limitedSecurities = filteredSecurities.slice(0, limit || 10);
        
        setData({
          securities: limitedSecurities,
          continuationToken: filteredSecurities.length > (limit || 10) ? "mock-token" : undefined,
          filters,
        } as T);
      } 
      else if (queryFn === 'api.queries.getFundsFlow') {
        const { entityType, dateFrom, dateTo, limit } = args;
        let filteredFundsFlow = [...MOCK_FUNDS_FLOW];
        
        if (entityType) {
          filteredFundsFlow = filteredFundsFlow.filter(f => f.entityType === entityType);
        }
        
        if (dateFrom) {
          filteredFundsFlow = filteredFundsFlow.filter(f => f.date >= dateFrom);
        }
        
        if (dateTo) {
          filteredFundsFlow = filteredFundsFlow.filter(f => f.date <= dateTo);
        }
        
        setData(filteredFundsFlow.slice(0, limit || 50) as T);
      }
      else if (queryFn === 'api.queries.getUserNotifications') {
        const { userId, unreadOnly, limit } = args;
        let notifications = [...MOCK_NOTIFICATIONS];
        
        if (unreadOnly) {
          notifications = notifications.filter(n => !n.read);
        }
        
        setData(notifications.slice(0, limit || 10) as T);
      }
      else if (queryFn === 'api.queries.getSecuritiesTypeStats') {
        // Calculate stats from mock securities
        const stats = MOCK_SECURITIES.reduce((acc, security) => {
          const type = security.type;
          if (!acc[type]) {
            acc[type] = 0;
          }
          acc[type]++;
          return acc;
        }, {});
        
        // Convert to array format expected by the component
        setData(Object.entries(stats).map(([type, count]) => ({
          type,
          count,
        })) as T);
      }
    }, 500); // Simulate network delay
    
    return () => clearTimeout(timeout);
  }, [queryFn, JSON.stringify(args)]);
  
  return data;
}

export function useMockMutation(mutationFn) {
  return async (args) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (mutationFn === 'api.mutations.markNotificationAsRead') {
      const notification = MOCK_NOTIFICATIONS.find(n => n._id.id === args.notificationId.id);
      if (notification) {
        notification.read = true;
        return { success: true, id: notification._id };
      }
    }
    else if (mutationFn === 'api.mutations.markAllNotificationsAsRead') {
      const unreadNotifications = MOCK_NOTIFICATIONS.filter(n => n.userId === args.userId && !n.read);
      unreadNotifications.forEach(n => { n.read = true; });
      return { success: true, count: unreadNotifications.length };
    }
    
    return { success: true };
  };
}

// Create provider component
export function MockConvexProvider({ children }) {
  const value = {
    useQuery: useMockQuery,
    useMutation: useMockMutation,
  };
  
  return (
    <MockConvexContext.Provider value={value}>
      {children}
    </MockConvexContext.Provider>
  );
}

// Create hook to use the mock context
export function useMockConvex() {
  return useContext(MockConvexContext);
} 