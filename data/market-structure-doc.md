# Moscow Exchange (MOEX) Market Structure Documentation

This document explains the structure of the Moscow Exchange (MOEX) trading system based on the data extracted from the XML file. The structure has been organized into several CSV files for easy reference and analysis.

## Hierarchical Structure Overview

The MOEX trading system is organized in a hierarchical structure consisting of:

1. **Trading Engines** - Top-level trading platforms
2. **Markets** - Segments within each trading engine
3. **Board Groups** - Collections of trading boards with similar characteristics
4. **Boards** - Specific trading modes with defined parameters
5. **Securities** - Financial instruments traded on the boards

```
Trading Engine → Market → Board Group → Board → Security
```

## Generated CSV Files

The following CSV files have been generated from the XML data:

### 1. moex_engines.csv
Contains the main trading engines available on MOEX:
- `id` - Unique identifier for the engine
- `name` - Engine code name
- `title` - Full name of the engine in Russian

### 2. moex_markets.csv
Contains the markets available within each trading engine:
- `id` - Unique identifier for the market
- `trade_engine_id` - Reference to the parent trading engine
- `trade_engine_name` - Name of the parent trading engine
- `market_name` - Market code name
- `market_title` - Full name of the market in Russian
- `marketplace` - Associated marketplace code
- `is_otc` - Flag indicating if this is an over-the-counter market

### 3. moex_hierarchy.csv
Shows the hierarchical relationship between engines, markets, and board groups:
- `engine_id`, `engine_name`, `engine_title` - Information about the trading engine
- `market_id`, `market_name`, `market_title` - Information about the market
- `board_group_id`, `board_group_name`, `board_group_title` - Information about the board group
- `is_default` - Flag indicating if this is the default board group for the market

### 4. moex_security_types.csv
Lists the types of securities available for trading:
- `id` - Unique identifier for the security type
- `trade_engine_id`, `trade_engine_name` - Reference to the associated trading engine
- `security_type_name` - Code name of the security type
- `security_type_title` - Full name of the security type in Russian
- `security_group_name` - Reference to the associated security group

### 5. moex_security_groups.csv
Contains groupings of security types:
- `id` - Unique identifier for the security group
- `name` - Code name of the security group
- `title` - Full name of the security group in Russian
- `is_hidden` - Flag indicating if the group is hidden in the interface

## Key Trading Engines

1. **Stock Market (stock)** - Main trading platform for equities, bonds, ETFs, and mutual funds
2. **Currency Market (currency)** - Platform for trading foreign currencies
3. **Derivatives Market (futures)** - Platform for trading futures and options
4. **Government Securities Market (state)** - Platform for government bond auctions
5. **Commodity Market (commodity)** - Platform for commodity futures
6. **Money Market (money)** - New platform for monetary operations
7. **OTC Market (otc)** - Over-the-counter trading with central counterparty

## Key Markets

### Stock Market (ID: 1)
- **Shares (shares)** - Trading in stocks and depositary receipts
- **Bonds (bonds)** - Trading in corporate, municipal, and government bonds
- **REPO (repo)** - Repurchase agreements
- **Negotiated Deals (ndm)** - Off-order book trading
- **Indices (index)** - Stock market indices
- **Foreign Shares (foreignshares)** - Foreign securities

### Currency Market (ID: 3)
- **SELT (selt)** - Main currency trading
- **Indices (index)** - Currency fixings
- **OTC Indices (otcindices)** - OTC currency indicators

### Derivatives Market (ID: 4)
- **FORTS (forts)** - Futures contracts
- **Options (options)** - Option contracts

## Trading Modes (Board Groups)

Trading modes define specific rules for trading:

- **T+ Modes** - Modes with partial prefunding (e.g., `stock_shares_tplus`)
- **T0 Modes** - Modes with full prefunding (e.g., `stock_shares`)
- **Dark Pools** - Anonymous trading (e.g., `stock_shares_darkpool`)
- **REPO Modes** - Various REPO operations (e.g., `stock_ccp`)
- **Negotiated Deal Modes** - For direct deals between parties (e.g., `stock_ndm`)

## Usage Examples

### Find all markets for a specific engine
```python
# Filter markets CSV to find all markets for the Stock Engine (ID=1)
stock_markets = markets_df[markets_df['trade_engine_id'] == 1]
```

### Find all board groups for a specific market
```python
# Filter hierarchy CSV to find all board groups for the Shares Market (ID=1)
shares_board_groups = hierarchy_df[hierarchy_df['market_id'] == 1]
```

### Find security types available on a specific engine
```python
# Filter security types CSV to find all types for the Currency Engine (ID=3)
currency_security_types = security_types_df[security_types_df['trade_engine_id'] == 3]
```

## Visualization

The interactive visualization provides a clear view of the hierarchical relationship between engines, markets, and board groups. Use it to:

1. Click on a trading engine to expand/collapse its markets
2. Click on a market to expand/collapse its board groups
3. See detailed information about each board group, including its ID, name, title, and default status
