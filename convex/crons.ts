import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

/**
 * Scheduled Cron Jobs for the MOEX API integration
 * 
 * Automatically updates data from the Moscow Exchange (MOEX) API at regular intervals.
 * - Futures and options data are updated every 5 minutes during trading hours
 * - Funds flow data is updated daily
 * - Periodic cleanup of old notifications
 */

// Define cron jobs
const crons = cronJobs();

// Update futures data every 5 minutes during trading hours on weekdays
crons.interval(
  "update-futures-data",
  { minutes: 5 },
  internal.cronActions.updateFuturesData,
  // Only execute during trading hours on weekdays
  {
    timezone: "Europe/Moscow",
    onlyDuringHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], // 9 AM to 11:59 PM Moscow time
    onlyDuringDaysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
  }
);

// Update options data every 5 minutes during trading hours on weekdays
crons.interval(
  "update-options-data",
  { minutes: 5 },
  internal.cronActions.updateOptionsData,
  // Only execute during trading hours on weekdays
  {
    timezone: "Europe/Moscow",
    onlyDuringHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], // 9 AM to 11:59 PM Moscow time
    onlyDuringDaysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
  }
);

// Update shares (stocks) data every 5 minutes during trading hours on weekdays
crons.interval(
  "update-shares-data",
  { minutes: 5 },
  internal.cronActions.updateSharesData,
  // Only execute during trading hours on weekdays
  {
    timezone: "Europe/Moscow",
    onlyDuringHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], // 9 AM to 7:59 PM Moscow time
    onlyDuringDaysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
  }
);

// Update funds flow data once per day (after market close)
crons.interval(
  "update-funds-flow-data",
  { hours: 24 },
  internal.cronActions.updateFundsFlowData,
  // Execute once daily after market close
  {
    timezone: "Europe/Moscow",
    onlyDuringHours: [20], // 8 PM Moscow time, after market close
    onlyDuringDaysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
  }
);

// Clean up old notifications (keep only last 30 days)
crons.interval(
  "cleanup-old-notifications",
  { days: 1 },
  internal.cronActions.cleanupOldNotifications
);

// Export the cron jobs
export default crons; 