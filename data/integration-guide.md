# MOEX API Integration Guide

This comprehensive guide explains how to integrate with the Moscow Exchange (MOEX) API using the structured data provided in the accompanying CSV files and JSON schema.

## Introduction

The Moscow Exchange (MOEX) offers a rich API that provides access to market data, trading information, and reference data. This guide will help you understand the hierarchical structure of MOEX and implement integration with its API efficiently.

## Understanding MOEX Structure

MOEX has a hierarchical structure consisting of:

1. **Trading Engines** - Major platforms (Stock, Currency, Derivatives, etc.)
2. **Markets** - Segments within engines (Shares, Bonds, REPO, etc.)
3. **Board Groups** - Collections of trading boards (T+ modes, T0 modes, etc.)
4. **Boards** - Specific trading modes (TQBR, CETS, RFUD, etc.)
5. **Securities** - Financial instruments traded on the boards

This hierarchy is important to understand as API endpoints follow this structure.

## Key Resources Provided

The following resources have been created to help you navigate and use the MOEX API:

### CSV Files

1. **moex_engines.csv** - List of all trading engines
2. **moex_markets.csv** - List of markets with their properties
3. **moex_hierarchy.csv** - Relationships between engines, markets, and board groups
4. **moex_security_types.csv** - Types of securities available for trading
5. **moex_security_groups.csv** - Groupings of security types
6. **moex_security_collections.csv** - Thematic collections of securities
7. **moex_boards_analysis.csv** - Detailed analysis of trading boards
8. **moex_security_market_mappings.csv** - Mapping between security types and markets

### JSON Schema

The `moex_api_schema.json` file provides a complete schema definition for MOEX API responses, useful for validation and code generation.

### Visualizations

Interactive visualizations to help understand the market structure:

1. **MOEX Market Structure Visualization** - Shows engines, markets, and board relationships
2. **MOEX Data Durations Visualization** - Displays available time intervals for data retrieval
3. **MOEX Market Hierarchical Tree** - Tree view of the complete market structure

## Getting Started with the API

### 1. Basic API Pattern

MOEX API follows a RESTful pattern with hierarchical URLs:

```
https://iss.moex.com/iss/engines/{engine}/markets/{market}/boards/{board}/securities.{format}
```

Where:
- `{engine}` - Engine code (e.g., "stock", "currency")
- `{market}` - Market code (e.g., "shares", "bonds")
- `{board}` - Board code (e.g., "TQBR", "CETS")
- `{format}` - Response format ("json", "xml", "csv")

### 2. Finding the Right Endpoint

To find the right endpoint for your needs:

1. **Identify the trading engine** using `moex_engines.csv`
2. **Find the appropriate market** using `moex_markets.csv`
3. **Select a board group and board** using `moex_hierarchy.csv` and `moex_boards_analysis.csv`

Example: To get data for Sberbank shares:
1. Engine: stock
2. Market: shares
3. Board: TQBR (from T+ main board group)

API endpoint: `/iss/engines/stock/markets/shares/boards/TQBR/securities/SBER`

### 3. Common API Operations

#### List all securities on a board

```
/iss/engines/stock/markets/shares/boards/TQBR/securities
```

#### Get candles (OHLC) for a security

```
/iss/engines/stock/markets/shares/boards/TQBR/securities/SBER/candles?from=2023-01-01&till=2023-01-31&interval=24
```

#### Get current orderbook

```
/iss/engines/stock/markets/shares/boards/TQBR/securities/SBER/orderbook
```

#### Get trading status

```
/iss/engines/stock/markets/shares/boards/TQBR/securities/SBER/status
```

## Practical Integration Examples

### Example 1: Fetching List of Available Shares

```python
import requests
import pandas as pd

# Get all securities on the main shares board
url = "https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities.json"
response = requests.get(url)
data = response.json()

# Convert to DataFrame
securities_df = pd.DataFrame(data['securities']['data'], columns=data['securities']['columns'])
print(securities_df[['SECID', 'SHORTNAME', 'PREVPRICE']])
```

### Example 2: Historical Data for Analysis

```python
import requests
import pandas as pd
from datetime import datetime, timedelta

# Get one month of daily candles for Sberbank
ticker = "SBER"
end_date = datetime.now()
start_date = end_date - timedelta(days=30)

url = f"https://iss.moex.com/iss/engines/stock/markets/shares/boards/TQBR/securities/{ticker}/candles.json"
params = {
    "from": start_date.strftime("%Y-%m-%d"),
    "till": end_date.strftime("%Y-%m-%d"),
    "interval": 24  # Daily candles
}

response = requests.get(url, params=params)
data = response.json()

# Convert to DataFrame
candles_df = pd.DataFrame(data['candles']['data'], columns=data['candles']['columns'])
candles_df['DATE'] = pd.to_datetime(candles_df['begin'])
candles_df.set_index('DATE', inplace=True)

# Perform technical analysis
candles_df['SMA_5'] = candles_df['close'].rolling(5).mean()
print(candles_df[['open', 'high', 'low', 'close', 'value', 'SMA_5']])
```

### Example 3: Real-time Market Data Monitoring

```python
import requests
import time
import pandas as pd

def monitor_market(board_id, update_interval=60):
    url = f"https://iss.moex.com/iss/engines/stock/markets/shares/boards/{board_id}/securities.json"
    
    while True:
        response = requests.get(url)
        data = response.json()
        
        securities_df = pd.DataFrame(data['securities']['data'], columns=data['securities']['columns'])
        marketdata_df = pd.DataFrame(data['marketdata']['data'], columns=data['marketdata']['columns'])
        
        # Merge security static info with real-time market data
        merged_df = pd.merge(
            securities_df[['SECID', 'SHORTNAME']], 
            marketdata_df[['SECID', 'BID', 'OFFER', 'LAST', 'CHANGE', 'VALUE']],
            on='SECID'
        )
        
        # Display market snapshot
        print(f"\nMarket snapshot at {pd.Timestamp.now()}")
        print(merged_df.sort_values('VALUE', ascending=False).head(10))
        
        # Wait for next update
        time.sleep(update_interval)

# Monitor main shares board with 1-minute updates
monitor_market("TQBR", 60)
```

## Advanced Integration Techniques

### Working with Multiple Boards

Some securities are traded on multiple boards with different conditions. Use the mapping files to identify which boards to query for a specific security type.

```python
# Example of finding all boards where Sberbank is traded
url = "https://iss.moex.com/iss/securities/SBER/boards.json"
response = requests.get(url)
data = response.json()

boards_df = pd.DataFrame(data['boards']['data'], columns=data['boards']['columns'])
print(boards_df[['boardid', 'board_title', 'market_name']])
```

### Historical Data Retrieval Optimization

For large historical datasets, use pagination and chunking:

```python
import requests
import pandas as pd
from datetime import datetime, timedelta

def get_all_candles(ticker, board, interval, start_date, end_date):
    all_candles = []
    chunk_size = timedelta(days=30)  # MOEX sometimes limits response size
    
    current_start = start_date
    while current_start < end_date:
        current_end = min(current_start + chunk_size, end_date)
        
        url = f"https://iss.moex.com/iss/engines/stock/markets/shares/boards/{board}/securities/{ticker}/candles.json"
        params = {
            "from": current_start.strftime("%Y-%m-%d"),
            "till": current_end.strftime("%Y-%m-%d"),
            "interval": interval
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        chunk_candles = data['candles']['data']
        all_candles.extend(chunk_candles)
        
        current_start = current_end + timedelta(days=1)
    
    # Convert to DataFrame
    columns = data['candles']['columns']
    candles_df = pd.DataFrame(all_candles, columns=columns)
    return candles_df

# Example usage
start_date = datetime(2022, 1, 1)
end_date = datetime(2022, 12, 31)
candles = get_all_candles("SBER", "TQBR", 24, start_date, end_date)
```

### Market Data Subscription

For continuous monitoring, implement a polling strategy with appropriate intervals:

```python
import requests
import time
import pandas as pd
from datetime import datetime

class MarketMonitor:
    def __init__(self, engine, market, board):
        self.engine = engine
        self.market = market
        self.board = board
        self.base_url = f"https://iss.moex.com/iss/engines/{engine}/markets/{market}/boards/{board}"
        self.last_update = datetime.now()
    
    def get_securities(self):
        url = f"{self.base_url}/securities.json"
        response = requests.get(url)
        return response.json()
    
    def get_orderbook(self, ticker, depth=10):
        url = f"{self.base_url}/securities/{ticker}/orderbook.json?depth={depth}"
        response = requests.get(url)
        return response.json()
    
    def monitor(self, tickers, interval=5):
        while True:
            print(f"\nUpdate at {datetime.now()} - Last update: {self.last_update}")
            
            # Get market data for all securities
            market_data = self.get_securities()
            all_data = pd.DataFrame(market_data['marketdata']['data'], 
                                    columns=market_data['marketdata']['columns'])
            
            # Filter for our tickers of interest
            ticker_data = all_data[all_data['SECID'].isin(tickers)]
            print(ticker_data[['SECID', 'LAST', 'CHANGE', 'BID', 'OFFER', 'VALUE']])
            
            # Get orderbook for first ticker
            if tickers:
                orderbook = self.get_orderbook(tickers[0])
                depths = pd.DataFrame(orderbook['orderbook']['data'], 
                                    columns=orderbook['orderbook']['columns'])
                print(f"\nOrderbook for {tickers[0]}:")
                print(depths[['BUYSELL', 'PRICE', 'QUANTITY']])
            
            self.last_update = datetime.now()
            time.sleep(interval)

# Usage
monitor = MarketMonitor("stock", "shares", "TQBR")
monitor.monitor(["SBER", "GAZP", "LKOH"], interval=30)
```

## Security Considerations

### Authentication

MOEX's public API doesn't require authentication for most operations, but it has rate limits. For higher quotas, contact MOEX for API key access.

### Rate Limiting

Implement appropriate delays between requests to avoid hitting rate limits:

```python
import requests
import time

def rate_limited_request(url, max_retries=3, delay=1):
    for attempt in range(max_retries):
        response = requests.get(url)
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 429:  # Too Many Requests
            # Exponential backoff
            sleep_time = delay * (2 ** attempt)
            print(f"Rate limited, waiting {sleep_time} seconds...")
            time.sleep(sleep_time)
        else:
            print(f"Error: {response.status_code}")
            return None
    
    print("Max retries exceeded")
    return None
```

## Conclusion

The MOEX API provides extensive market data and functionality for trading applications, analysis tools, and monitoring systems. By using the provided structured data files, you can quickly identify the correct endpoints and parameters for your specific requirements.

For further information, refer to:

1. MOEX ISS API Documentation: https://iss.moex.com/iss/reference/
2. MOEX API Examples: https://iss.moex.com/iss/reference/iss-examples
3. ISS API Swagger: https://iss.moex.com/iss/reference/swagger-ui.html

The structured data files and visualization tools provided with this guide will help you navigate the complex MOEX structure and implement robust integration with minimal effort.
