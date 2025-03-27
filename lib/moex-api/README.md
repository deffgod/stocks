# MOEX API Client Library

A comprehensive TypeScript client library for the Moscow Exchange (MOEX) Information & Statistical Server (ISS) API.

## Overview

This library provides a modern, type-safe interface to the MOEX ISS API. It includes:

- A comprehensive set of API endpoints
- Type definitions for MOEX data structures
- Support for both GET and POST requests
- Helper methods for common data operations
- Utility functions for working with specific data types

## API Structure

The MOEX API is structured around several core concepts:

- **Engines**: Trading systems (stock, futures, currency, etc.)
- **Markets**: Specific markets within each engine (shares, bonds, options, etc.)
- **Boards**: Trading modes (TQBR for T+2 shares, TQTF for ETFs, etc.)
- **Board Groups**: Groups of trading modes
- **Securities**: Financial instruments (stocks, bonds, futures, etc.)

## Usage Examples

### Basic Usage

```typescript
import { moexAPI } from '@/lib/moex-api/moexAPI';

// Fetch a list of securities
const securities = await moexAPI.getSecurities({ 
  lang: 'en',
  limit: 20
});

// Get details for a specific security
const sberbank = await moexAPI.getSecurityById('SBER');

// Get candles for a security
const candles = await moexAPI.getSecurityCandles(
  'SBER',
  'stock',
  'shares',
  '24' // daily candles
);
```

### Advanced Usage

```typescript
import { moexAPI } from '@/lib/moex-api/moexAPI';
import { ENGINES, MARKETS, BOARDS, MOEXCandleInterval } from '@/lib/moex-api/constants';

// Fetch securities from a specific market
const bonds = await moexAPI.getMarketSecurities(
  ENGINES.STOCK,
  MARKETS.BONDS,
  { limit: 50 }
);

// Get recent trades for a security
const trades = await moexAPI.getSecurityTrades(
  'GAZP',
  ENGINES.STOCK,
  MARKETS.SHARES
);

// Get orderbook for a security
const orderbook = await moexAPI.getSecurityOrderbook(
  'LKOH',
  ENGINES.STOCK,
  MARKETS.SHARES
);

// Get historical data with date range
const historicalData = await moexAPI.getSecurityByBoardHistory(
  'SBER',
  BOARDS.TQBR,
  {
    from: '2023-01-01',
    till: '2023-12-31'
  }
);
```

## Available Methods

The API client includes methods for accessing all major MOEX ISS endpoints:

### Securities Methods
- `getSecurities()` - Get list of securities
- `getSecurityById()` - Get security details by ID
- `getSecurityIndices()` - Get indices that include a security

### Engine and Market Methods
- `getEngines()` - Get list of trading engines
- `getEngineById()` - Get engine details by ID
- `getMarkets()` - Get markets for a specific engine
- `getMarketById()` - Get market details by ID

### Board and Board Group Methods
- `getBoards()` - Get boards for a specific market
- `getBoardGroups()` - Get board groups for a specific market

### Trading Data Methods
- `getMarketTrades()` - Get trades for a specific market
- `getSecurityTrades()` - Get trades for a specific security
- `getSecurityOrderbook()` - Get orderbook for a specific security
- `getSecurityCandles()` - Get candles for a specific security

### Analytics and Statistics Methods
- `getAnalytics()` - Get market analytics
- `getAnalyticsByIndex()` - Get analytics for a specific index
- `getSectorPerformance()` - Get sector performance data

### Turnovers Methods
- `getTurnovers()` - Get market turnovers
- `getEngineTurnovers()` - Get turnovers for a specific engine

### Currency Methods
- `getCurrencyRates()` - Get currency rates
- `getCurrencyFixing()` - Get currency fixing data

### Futures and Options Methods
- `getFuturesSeries()` - Get futures series
- `getOptionsAssets()` - Get options assets
- `getOptionsAssetById()` - Get options asset by ID

### Historical Data Methods
- `getSecuritiesHistory()` - Get historical securities data
- `getSecuritiesByBoardHistory()` - Get historical securities data by board
- `getSecurityByBoardHistory()` - Get historical data for a specific security by board

## Data Types

The library includes TypeScript interfaces for all MOEX data structures:

- `MOEXSecurity` - Security data
- `MOEXTrade` - Trade data
- `MOEXOrderbook` - Orderbook data
- `MOEXCandle` - Candle data
- `MOEXAnalytics` - Analytics data
- `MOEXEngine` - Engine data
- `MOEXMarket` - Market data
- `MOEXBoard` - Board data
- `MOEXBoardGroup` - Board group data
- `MOEXTurnover` - Turnover data
- `MOEXCurrencyRate` - Currency rate data
- `MOEXFuturesSeries` - Futures series data
- `MOEXOptionsAsset` - Options asset data

## Reference

For detailed documentation on the MOEX ISS API, see:
- [MOEX ISS API Reference](https://iss.moex.com/iss/reference/) 