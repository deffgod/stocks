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

// Import either the real or mock hooks based on environment
import { useMockQuery as useQuery, useMockMutation as useMutation } from "./MockProvider";

export default function MoexNotifications() {
  // Hard-coded user ID for demo purposes
  // In a real app, this would come from authentication
  const userId = "user123";
  const [showRead, setShowRead] = useState(false);
  
  // Get user notifications
  const notifications = useQuery('api.queries.getUserNotifications', {
    userId,
    unreadOnly: !showRead,
    limit: 50,
  });
  
  // Mutation to mark notification as read
  const markAsRead = useMutation('api.mutations.markNotificationAsRead');
  
  // Mutation to mark all notifications as read
  const markAllAsRead = useMutation('api.mutations.markAllNotificationsAsRead');
  
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
  
  const handleMarkAllAsRead = async () => {
    if (notifications?.length > 0) {
      await markAllAsRead({ userId });
    }
  };
  
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
            disabled={!notifications || notifications.length === 0}
          >
            Mark All as Read
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {!notifications ? (
          <Card>
            <CardContent className="py-10 flex justify-center items-center">
              <div className="animate-pulse text-muted-foreground">
                Loading notifications...
              </div>
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="py-10 flex justify-center items-center">
              <div className="text-muted-foreground">
                No {!showRead ? "unread " : ""}notifications found
              </div>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => {
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
                        onClick={() => markAsRead({ notificationId: notification._id })}
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