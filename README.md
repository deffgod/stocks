## Stocks tracking app

https://github.com/DariusLukasukas/stocks/assets/64962012/d81789c6-18ee-4217-ba2d-c67130a08239

![CleanShot 2024-04-06 at 15 14 39@2x](https://github.com/DariusLukasukas/stocks/assets/64962012/336da93c-4c09-4b9c-8af1-96618c02e482)
![CleanShot 2024-04-15 at 13 52 01@2x](https://github.com/DariusLukasukas/stocks/assets/64962012/c2d75cdd-f1bd-40f7-bbeb-1d8c12ccc4e7)
![CleanShot 2024-04-06 at 15 09 13@2x](https://github.com/DariusLukasukas/stocks/assets/64962012/28548d68-6066-4c5b-9cd3-476aadf41108)

## Key Features

- Robust Stock Search and Screening: Quickly find relevant stocks using intuitive search tools and apply filters based on key metrics.
- In-depth Company Information:
  - Real-time stock quotes and historical pricing data
  - Comprehensive financial statements (income statement, balance sheet, cash flow)
  - Key ratios and fundamental metrics
  - Detailed company profiles and summaries
- Interactive Charting Tools:
  - Customizable Visx area charts for visualizing market trends and patterns
  - Adjustable timeframes (intraday, daily, weekly, monthly, etc.)
- Market News Integration:
  - Curated feed of relevant news articles and analysis
  - Ability to filter news sources by relevance and sector

## Development Roadmap:

- Personalized stock watchlists
- Support for technical indicators (moving averages, Bollinger Bands, RSI, etc.)
- Dedicated news section
- User preferences and settings

## Technical Overview

Frontend: Next.js, React.js, TailwindCSS
Data Source: Yahoo-Finance2
Charting: Visx, d3.js
UI Components: Radix UI, Shadcn.

## Contributions and Feedback

If you have bug reports, feature suggestions, or want to get involved in development, please open an issue or submit a pull request.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## MOEX Streaming Service with Convex

This project includes a real-time streaming service for Moscow Exchange (MOEX) data, implemented using Convex as the backend platform. The service automatically fetches and updates data from the MOEX API, making it available to clients in real-time.

### Features

- **Real-time Data Streaming**: Live data updates pushed to all connected clients
- **Automated Data Collection**: Scheduled jobs fetch and update data regularly
- **Type-safe API**: Full TypeScript support for backend and frontend
- **Filtering & Search**: Advanced filtering capabilities for securities
- **User Favorites**: Save securities to your favorites list
- **Notifications**: Get notified when prices change significantly

### Data Types

The service provides the following data:

- **Futures**: Updated every 5 minutes during trading hours
- **Options**: Updated every 5 minutes during trading hours
- **Shares**: Complete list of companies traded on MOEX
- **Funds Flow**: Daily data on funds movement by individual and institutional investors

### Technology Stack

- **Frontend**: Next.js + React
- **Backend**: Convex (serverless backend with real-time capabilities)
- **API Integration**: MOEX ISS API client
- **Styling**: Tailwind CSS + shadcn/ui

### Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables:
   - Create `.env.local` with your Convex deployment URL
4. Start the development server:
   ```
   npm run dev
   ```
5. Navigate to `/moex/streaming` to see the real-time data interface

### Project Structure

- `convex/` - Convex backend code
  - `schema.ts` - Database schema definition
  - `moexApi.ts` - MOEX API integration actions
  - `mutations.ts` - Database mutation functions
  - `queries.ts` - Database query functions
  - `crons.ts` - Scheduled job definitions
  - `cronActions.ts` - Actions for scheduled jobs
  - `http.ts` - HTTP endpoints for integration

- `app/components/` - React components
  - `ConvexMoexExample.tsx` - Example component for displaying streaming data

- `lib/moex-api/` - MOEX API client library
