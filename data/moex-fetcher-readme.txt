# MOEX ISS API Fetcher

A comprehensive Python client library for interacting with the Moscow Exchange (MOEX) Informational & Statistical Server (ISS) API. This library provides a robust, type-safe interface for accessing market data, historical quotes, security information, and other trading-related data from MOEX.

## Features

- **Complete API Coverage**: Access all major MOEX ISS API endpoints with a consistent interface
- **Type-Safe Design**: Leverages Python's type hints for better IDE integration and runtime validation
- **Pandas Integration**: Seamlessly convert API responses to pandas DataFrames for data analysis
- **Intelligent Error Handling**: Robust exception hierarchy with informative error messages
- **Rate Limiting**: Built-in rate limiting to prevent API throttling
- **Request Optimization**: Automated pagination handling for large datasets
- **Flexible Authentication**: Support for both anonymous and authenticated requests (if MOEX adds authentication requirements in the future)

## Installation

```bash
# Install from PyPI (not yet available)
# pip install moex-fetcher

# Install from source
git clone https://github.com/yourusername/moex-fetcher.git
cd moex-fetcher
pip install -e .
```

## Quick Start

```python
from moex_fetcher import MoexApiClient
from moex_fetcher.endpoints import get_stock_securities, get_stock_candles

# Initialize the client
client = MoexApiClient()

# Get a list of securities on the main stock board
stocks = get_stock_securities(client)
print(stocks.head())

# Get daily candles for Sberbank (SBER) for the last month
import datetime
end_date = datetime.date.today()
start_date = end_date - datetime.timedelta(days=30)
sber_candles = get_stock_candles(
    client, "SBER", interval="day", start_date=start_date, end_date=end_date
)
print(sber_candles.head())
```

## Architecture

The library is structured with a clear separation of concerns:

- **Core Client** (`client.py`): Low-level HTTP client with request/response handling
- **Endpoints** (`endpoints.py`): High-level functions for common API operations
- **Parsers** (`parsers.py`): Data processing utilities for converting API responses to usable formats
- **Exceptions** (`exceptions.py`): Custom exception hierarchy for meaningful error handling
- **Utilities** (`utils.py`): Helper functions for URL construction, date formatting, etc.

This layered architecture provides flexibility for both simple usage patterns and complex custom implementations.

## Detailed API Reference

### Core Client Methods

The `MoexApiClient` class provides direct access to MOEX ISS API endpoints:

#### General Methods

- `get_engines()`: Get available trading engines
- `get_markets(engine)`: Get markets for a specific engine
- `get_boards(engine, market)`: Get trading boards for a market
- `get_securities(engine, market, board)`: Get securities listing

#### Security-Specific Methods

- `get_security_info(security_id)`: Get detailed security information
- `get_market_data(security_id, engine, market, board)`: Get current market data
- `get_orderbook(security_id, engine, market, board, depth)`: Get current order book
- `get_trades(security_id, engine, market, board, limit)`: Get recent trades

#### Historical Data Methods

- `get_candles(security_id, engine, market, interval, ...)`: Get historical candles
- `get_market_history(security_id, engine, market, ...)`: Get historical market data
- `get_board_history(board, engine, market, date)`: Get historical data for all securities on a board

#### Index Methods

- `get_indices()`: Get available MOEX indices
- `get_index_components(index_id)`: Get components of a specific index

### High-Level Endpoint Functions

The `endpoints.py` module provides simplified interfaces for common operations:

- `get_stock_securities(client, board)`: Get stocks on the specified board
- `get_bond_securities(client, board)`: Get bonds on the specified board
- `get_security_history(client, ticker, ...)`: Get historical data for a security
- `get_stock_candles(client, ticker, interval, ...)`: Get candles with human-friendly interval names
- `get_index_composition(client, index_id)`: Get index components
- `find_security(client, query, ...)`: Search for securities by name/ticker
- `get_market_data_snapshot(client, tickers, ...)`: Get market data for multiple securities
- `get_board_securities_with_market_data(client, ...)`: Get securities with market data
- `get_multi_timeframe_candles(client, ticker, intervals, ...)`: Get candles for multiple timeframes

## Advanced Usage

### Custom API Requests

For endpoints not directly covered by the high-level methods, you can use the lower-level API:

```python
# Make a custom request to an arbitrary API endpoint
data = client.get_data(
    endpoint="/some/custom/endpoint",
    path_params={"param1": "value1"},
    params={"query1": "value1"}
)

# Convert to DataFrame if needed
df = client.get_dataframe(
    endpoint="/some/custom/endpoint",
    path_params={"param1": "value1"},
    params={"query1": "value1"}
)
```

### Custom Response Processing

If you need special handling for API responses:

```python
from moex_fetcher.parsers import parse_json_response, normalize_dataframe

# Get raw JSON response
json_response = client.get_json(endpoint="/some/endpoint")

# Parse the response manually
parsed_data = parse_json_response(json_response)

# Process specific data blocks
if "securities" in parsed_data:
    securities_data = parsed_data["securities"]
    # Custom processing...

# Create and normalize a DataFrame
import pandas as pd
df = pd.DataFrame(securities_data)
normalized_df = normalize_dataframe(
    df,
    date_columns=["TRADEDATE"],
    numeric_columns=["OPEN", "CLOSE", "HIGH", "LOW", "VOLUME"]
)
```

### Error Handling

The library provides a rich exception hierarchy for proper error handling:

```python
from moex_fetcher import MoexApiClient
from moex_fetcher.exceptions import (
    MoexApiError,
    MoexConnectionError,
    MoexResponseError,
    MoexRateLimitError
)

client = MoexApiClient()

try:
    data = client.get_security_info("INVALID_TICKER")
except MoexConnectionError as e:
    # Handle connection issues
    print(f"Connection error: {e}")
except MoexRateLimitError as e:
    # Handle rate limiting
    print(f"Rate limit exceeded. Retry after {e.retry_after} seconds")
except MoexResponseError as e:
    # Handle API response errors
    print(f"API error (status {e.status_code}): {e}")
except MoexApiError as e:
    # Handle other API errors
    print(f"API error: {e}")
```

## Performance Considerations

### Rate Limiting

The library includes built-in rate limiting to prevent API throttling. By default, it enforces a minimum delay of 0.2 seconds between requests (5 requests per second). You can adjust this when creating the client:

```python
# Set a custom rate limit of 10 requests per second
client = MoexApiClient(rate_limit=0.1)
```

### Result Size Optimization

For large datasets, consider specifying only the columns you need:

```python
# Request only specific columns to reduce response size
columns = ["TRADEDATE", "SECID", "OPEN", "CLOSE", "VOLUME"]
history = client.get_market_history(
    security_id="SBER",
    engine="stock",
    market="shares",
    columns=columns
)
```

### Caching

For frequently accessed static data, implement caching at the application level:

```python
import functools

@functools.lru_cache(maxsize=128)
def get_cached_security_info(client, ticker):
    return client.get_security_info(ticker)
```

## Extending the Library

### Adding New API Endpoints

To add support for a new MOEX ISS API endpoint:

1. Add a new method to `MoexApiClient` in `client.py`
2. Add any necessary helper functions in `utils.py`
3. Add specialized endpoint functions in `endpoints.py`

Example:

```python
# In client.py
def get_new_endpoint_data(self, param1, param2):
    return self.get_dataframe(
        endpoint="/new/endpoint/path",
        params={"param1": param1, "param2": param2},
        block_name="data_block"
    )

# In endpoints.py
def get_new_endpoint_simplified(client, param1, param2):
    # Add validation, defaults, etc.
    return client.get_new_endpoint_data(param1, param2)
```

## API Limitations and Known Issues

- Some MOEX ISS API endpoints may have specific limitations on request frequency or data volume
- Historical data availability varies by security and market segment
- The API may return different data structures for different securities or markets
- Some endpoints might require additional parameters not directly exposed by the library

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This library is based on the Moscow Exchange (MOEX) ISS API: https://iss.moex.com/iss/reference/
- Inspired by existing MOEX API client implementations across various languages
