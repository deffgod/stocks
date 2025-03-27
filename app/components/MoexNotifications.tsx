"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Bell, ArrowUp, ArrowDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Mock notifications data
const MOCK_NOTIFICATIONS = [
  {
    _id: { id: "1" },
    secid: "SBER",
    message: "Цена Сбербанк изменилась на +5.23%",
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    _id: { id: "2" },
    secid: "GAZP",
    message: "Цена Газпром изменилась на -3.18%",
    timestamp: Date.now() - 7200000,
    read: false,
  },
  {
    _id: { id: "3" },
    secid: "LKOH",
    message: "Цена Лукойл изменилась на +2.75%",
    timestamp: Date.now() - 86400000,
    read: true,
  },
  {
    _id: { id: "4" },
    secid: "YNDX",
    message: "Цена Яндекс изменилась на -1.45%",
    timestamp: Date.now() - 172800000,
    read: true,
  },
  {
    _id: { id: "5" },
    secid: "ROSN",
    message: "Цена Роснефть изменилась на +0.87%",
    timestamp: Date.now() - 259200000,
    read: true,
  },
];

export default function MoexNotifications() {
  const [showRead, setShowRead] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  // Format the timestamp to a human-readable format
  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return "Unknown time";
    }
  };
  
  // Extract the price change value from the message
  const extractPriceChange = (message) => {
    const regex = /изменилась на (\+?-?\d+\.?\d*)%/;
    const match = message?.match(regex);
    return match?.[1] ? parseFloat(match[1]) : null;
  };
  
  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif._id.id === notificationId ? { ...notif, read: true } : notif
    ));
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  
  // Filter notifications based on read status
  const filteredNotifications = showRead 
    ? notifications 
    : notifications.filter(n => !n.read);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </div>
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowRead(!showRead)}
          >
            {showRead ? "Hide Read" : "Show All"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={filteredNotifications.length === 0}
          >
            Mark All as Read
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-10 flex justify-center items-center">
              <div className="text-muted-foreground">
                No {!showRead ? "unread " : ""}notifications found
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const priceChange = extractPriceChange(notification.message);
            const isPositive = priceChange !== null && priceChange > 0;
            return (
              <Card 
                key={notification._id.id} 
                className={notification.read ? "opacity-70" : ""}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{notification.secid}</span>
                      {priceChange !== null && (
                        <Badge 
                          variant={isPositive ? "default" : "destructive"}
                          className="ml-2 flex items-center gap-1"
                        >
                          {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                          {Math.abs(priceChange).toFixed(2)}%
                        </Badge>
                      )}
                    </div>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={() => handleMarkAsRead(notification._id.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <CardDescription>
                    {formatTimestamp(notification.timestamp)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{notification.message}</p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
} 