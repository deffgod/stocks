# MOEX API Data Types and Formats

This documentation provides detailed information about the data types and formats used in the Moscow Exchange (MOEX) API. It is based on the analysis of the XML structure and defines the expected formats for each field.

## Basic Data Types

Based on the XML schema, the following basic data types are used in the MOEX API:

| XML Type | Description | Example |
|----------|-------------|---------|
| `int32` | 32-bit integer | `1`, `42`, `-10` |
| `string` | Text string | `"stock"`, `"TQBR"` |
| `bytes` | Text string with limited byte length | Fields like `title` with `bytes="765"` |

## Entity Format Specifications

### Trading Engines

Trading engines represent the top-level trading platforms in the MOEX system.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | int32 | Unique identifier | `1` (Stock market) |
| `name` | string | Code name | `"stock"` |
| `title` | string | Full name (Russian) | `"Фондовый рынок и рынок депозитов"` |

### Markets

Markets are trading segments within each trading engine.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | int32 | Unique identifier | `1` (Shares market) |
| `trade_engine_id` | int32 | Parent engine ID | `1` |
| `trade_engine_name` | string | Parent engine code | `"stock"` |
| `trade_engine_title` | string | Parent engine name | `"Фондовый рынок и рынок депозитов"` |
| `market_name` | string | Market code | `"shares"` |
| `market_title` | string | Market name (Russian) | `"Рынок акций"` |
| `market_id` | int32 | Market ID (duplicates `id`) | `1` |
| `marketplace` | string | Associated marketplace code | `"MXSE"` |
| `is_otc` | int32 | Over-the-counter flag (0/1) | `0` |
| `has_history_files` | int32 | History files availability (0/1) | `1` |
| `has_history_trades_files` | int32 | Trade history files availability (0/1) | `1` |
| `has_trades` | int32 | Trades availability (0/1) | `1` |
| `has_history` | int32 | History availability (0/1) | `1` |
| `has_candles` | int32 | Candles availability (0/1) | `1` |
| `has_orderbook` | int32 | Orderbook availability (0/1) | `1` |
| `has_tradingsession` | int32 | Trading session info availability (0/1) | `1` |
| `has_extra_yields` | int32 | Extra yields availability (0/1) | `0` |
| `has_delay` | int32 | Market data delay flag (0/1) | `1` |

### Board Groups

Board groups are collections of trading boards with similar characteristics.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | int32 | Unique identifier | `57` |
| `trade_engine_id` | int32 | Parent engine ID | `1` |
| `trade_engine_name` | string | Parent engine code | `"stock"` |
| `trade_engine_title` | string | Parent engine name | `"Фондовый рынок и рынок депозитов"` |
| `market_id` | int32 | Parent market ID | `1` |
| `market_name` | string | Parent market code | `"shares"` |
| `name` | string | Board group code | `"stock_shares_tplus"` |
| `title` | string | Board group name (Russian) | `"Т+: Основной режим - безадрес."` |
| `is_default` | int32 | Default group flag (0/1) | `1` |
| `board_group_id` | int32 | Board group ID (duplicates `id`) | `57` |
| `is_traded` | int32 | Active trading flag (0/1) | `1` |
| `is_order_driven` | int32 | Order-driven flag (0/1) | `1` |
| `category` | string | Category code | `"main"` |

### Boards

Boards are specific trading modes within markets and board groups.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | int32 | Unique identifier | `129` |
| `board_group_id` | int32 | Parent board group ID | `57` |
| `engine_id` | int32 | Parent engine ID | `1` |
| `market_id` | int32 | Parent market ID | `1` |
| `boardid` | string | Board code (used in API calls) | `"TQBR"` |
| `board_title` | string | Board name (Russian) | `"Т+: Акции и ДР - безадрес."` |
| `is_traded` | int32 | Active trading flag (0/1) | `1` |
| `has_candles` | int32 | Candles availability (0/1) | `1` |
| `is_primary` | int32 | Primary board flag (0/1) | `1` |

### Security Types

Security types define the types of financial instruments that can be traded.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | int32 | Unique identifier | `3` |
| `trade_engine_id` | int32 | Associated engine ID | `1` |
| `trade_engine_name` | string | Associated engine code | `"stock"` |
| `trade_engine_title` | string | Associated engine name | `"Фондовый рынок и рынок депозитов"` |
| `security_type_name` | string | Security type code | `"common_share"` |
| `security_type_title` | string | Security type name (Russian) | `"Акция обыкновенная"` |
| `security_group_name` | string | Associated security group code | `"stock_shares"` |
| `stock_type` | string | Stock type code (if applicable) | `"1"` |

### Security Groups

Security groups are broader categories of security types.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | int32 | Unique identifier | `4` |
| `name` | string | Security group code | `"stock_shares"` |
| `title` | string | Security group name (Russian) | `"Акции"` |
| `is_hidden` | int32 | Hidden flag (0/1) | `0` |

### Security Collections

Security collections are themed groupings of securities.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | int32 | Unique identifier | `3` |
| `name` | string | Collection code | `"stock_shares_all"` |
| `title` | string | Collection name (Russian) | `"Все акции"` |
| `security_group_id` | int32 | Associated security group ID | `4` |

### Durations

Durations define time intervals for data retrieval.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `interval` | int32 | Interval identifier | `1` |
| `duration` | int32 | Duration in seconds | `60` |
| `days` | int32 | Number of days (if applicable) | `null` (for minutes) |
| `title` | string | Duration name (Russian) | `"минута"` |
| `hint` | string | Short hint/code | `"1м"` |

## Flag Values Interpretation

Many fields in the MOEX API use integer flags with values `0` or `1`. Here's how to interpret them:

| Value | Meaning |
|-------|---------|
| `0` | No, False, Disabled, Not Available |
| `1` | Yes, True, Enabled, Available |

## Common Patterns and Naming Conventions

### Board ID Format

Board IDs follow specific patterns that indicate their purpose:

- Prefix `TQ` - T+ mode (partial prefunding)
- Prefix `EQ` - Equity operations
- Prefix `PS` - Negotiated deals (RPS)
- Prefix `PT` - Negotiated deals with CCP (RPS with CCP)
- Suffix `BR` - Shares (Russian)
- Suffix `CB` - Corporate bonds
- Suffix `OB` - Government bonds
- Suffix `IF` - Investment funds
- Suffix `TF` - ETFs
- Suffix `D` - USD denominated
- Suffix `E` - EUR denominated
- Suffix `Y` - CNY denominated
- Suffix `H` - HKD denominated

Example: `TQBR` = T+ mode for Russian shares

### Engine and Market Naming

- Engine names are usually short, single words (e.g., `stock`, `currency`)
- Market names describe the market segment (e.g., `shares`, `bonds`, `repo`)
- Board group names typically follow the pattern `[engine]_[market]_[qualifier]` (e.g., `stock_shares_tplus`)

## API URL Patterns

For reference, MOEX API URLs typically follow this structure:

```
https://iss.moex.com/iss/engines/{engine}/markets/{market}/boards/{board}/securities.{format}
```

where:
- `{engine}` - Trading engine code (e.g., "stock", "currency")
- `{market}` - Market code (e.g., "shares", "bonds")
- `{board}` - Board code (e.g., "TQBR", "EQOB")
- `{format}` - Response format ("json", "xml", "csv")

## Common API Endpoints

The MOEX API provides several key endpoints for retrieving market data:

### Market Structure Information

```
/iss/engines                                # List all trading engines
/iss/engines/{engine}/markets               # List markets for an engine
/iss/engines/{engine}/markets/{market}/boards # List boards for a market
```

### Security Information

```
/iss/securities                             # List all securities
/iss/securities/{ticker}                     # Get information about a specific security
/iss/engines/{engine}/markets/{market}/securities # List securities in a market
/iss/engines/{engine}/markets/{market}/boards/{board}/securities # List securities on a board
```

### Market Data

```
/iss/engines/{engine}/markets/{market}/securities/{ticker}/candles # Get candles for a security
/iss/engines/{engine}/markets/{market}/boards/{board}/securities/{ticker}/trades # Get trades
/iss/engines/{engine}/markets/{market}/boards/{board}/securities/{ticker}/orderbook # Get orderbook
```

### Index Data

```
/iss/engines/stock/markets/index/boards/SNDX/securities # List stock indices
/iss/engines/currency/markets/index/boards/FIXI/securities # List currency indices
```

## HTTP Request Parameters

MOEX API supports several HTTP request parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `lang` | Response language (ru, en) | `lang=en` |
| `start` | Starting record for pagination | `start=100` |
| `limit` | Maximum records to return | `limit=50` |
| `date` | Date for historical data (YYYY-MM-DD) | `date=2023-01-15` |
| `from` | Start date (YYYY-MM-DD) | `from=2023-01-01` |
| `till` | End date (YYYY-MM-DD) | `till=2023-01-31` |
| `interval` | Interval for candles (1, 10, 60, 24, 7, 31, 4) | `interval=24` |

## Response Formats

### JSON Format

JSON responses are structured as follows:

```json
{
  "metadata": {
    "columns": ["COLUMN1", "COLUMN2", ...],
    "types": ["string", "int32", ...]
  },
  "data": [
    ["value1", 123, ...],
    ["value2", 456, ...],
    ...
  ]
}
```

### XML Format

XML responses follow this structure:

```xml
<document>
  <data id="datasetname">
    <metadata>
      <columns>
        <column name="COLUMN1" type="string" />
        <column name="COLUMN2" type="int32" />
        ...
      </columns>
    </metadata>
    <rows>
      <row COLUMN1="value1" COLUMN2="123" ... />
      <row COLUMN1="value2" COLUMN2="456" ... />
      ...
    </rows>
  </data>
</document>
```

## Board ID Naming Standards

The board ID is crucial for API queries. Here's a comprehensive guide to the naming convention:

### First Letter (Trading Mode)
- `T` - T+ settlement (partial prefunding)
- `E` - T0 settlement (full prefunding)
- `P` - Negotiated deals

### Second Letter (Market Type/Operation)
- `Q` - Main trading (quote-driven)
- `S` - Negotiated deals (RPS)
- `T` - Negotiated deals with CCP
- `R` - REPO operations
- `A` - Auctions

### Third and Fourth Letters (Instrument Type)
- `BR` - Russian shares
- `BS` - Second tier shares
- `LV` - Low liquidity shares
- `NL` - Non-listed shares
- `OB` - Government bonds
- `CB` - Corporate bonds
- `IF` - Investment fund units
- `TF` - ETFs
- `RD` - D-level bonds
- `DB` - D-level bonds in negotiated mode

### Suffix (Currency)
- No suffix - Russian ruble (RUB)
- `D` - US dollar (USD)
- `E` - Euro (EUR)
- `Y` - Chinese yuan (CNY)
- `H` - Hong Kong dollar (HKD)

Examples:
- `TQBR` - T+ mode for main Russian shares (most liquid)
- `EQOB` - T0 mode for government bonds
- `PSOB` - Negotiated deals for bonds
- `PTOB` - Negotiated deals with CCP for bonds
- `TQCB` - T+ mode for corporate bonds
- `TQTF` - T+ mode for ETFs
- `TQTD` - T+ mode for USD-denominated ETFs
- `EQRP` - T0 mode for REPO operations

## Data Availability Matrix

Different markets provide different types of data. Here's a reference matrix:

| Data Type | Description | Availability |
|-----------|-------------|--------------|
| `trades` | Executed trades | Most markets with `has_trades=1` |
| `orderbook` | Order book depth | Markets with `has_orderbook=1` |
| `history` | Historical data | Markets with `has_history=1` |
| `candles` | Aggregated price candles | Markets with `has_candles=1` |
| `tradingsession` | Trading session information | Markets with `has_tradingsession=1` |
| `extra_yields` | Additional yield calculations | Only for bond markets with `has_extra_yields=1` |

## Special Considerations

### Securities with Multiple Boards

Some securities may be traded on multiple boards. When retrieving information for such securities, specify the board to get board-specific data:

```
/iss/engines/stock/markets/shares/boards/TQBR/securities/SBER
/iss/engines/stock/markets/shares/boards/SMAL/securities/SBER
```

### Market Data Delays

Some market data may be provided with delays to non-subscribers. The `has_delay` flag indicates if the market has a delay:

- `has_delay=0` - Real-time data
- `has_delay=1` - Delayed data (typically 15-minute delay)

### OTC Markets

Over-the-counter markets (`is_otc=1`) have different characteristics:

- Limited order book data
- May not have real-time trades
- Often use negotiated deals

## Error Handling

The API returns standard HTTP status codes:

| Code | Description | Handling |
|------|-------------|----------|
| 200 | Success | Process the data |
| 400 | Bad Request | Check parameters |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limited, slow down |
| 500 | Server Error | Retry later |

Error responses include detailed messages to help diagnose issues:

```json
{
  "error": {
    "code": 404,
    "message": "Security not found"
  }
}
```

## Security Type Identifiers

Security types have numeric identifiers that can be used in filtering:

| ID | Security Type |
|----|---------------|
| 1 | Preferred share |
| 2 | Corporate bond |
| 3 | Common share |
| 4 | Central bank bond |
| 6 | Futures contract |
| 7 | Open-end mutual fund |
| 8 | Interval mutual fund |
| 9 | Closed-end mutual fund |
| 41 | Regional bond |
| 43 | Exchange bond |
| 51 | Depositary receipt |
| 52 | Option |
| 54 | Government bond (OFZ) |
| 55 | ETF |
| 63 | CCP deposit |

## Further Resources

For more detailed information on the MOEX API:

1. Official ISS API documentation: https://iss.moex.com/iss/reference/
2. MOEX API examples: https://iss.moex.com/iss/reference/iss-examples
3. Market data specifications: https://www.moex.com/a2193