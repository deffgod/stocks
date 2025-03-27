# MOEX ISS API Fetcher Examples

This directory contains usage examples demonstrating various capabilities of the MOEX ISS API Fetcher library.

## Basic Usage Example

Run the basic example to get started:

```bash
python example_usage.py
```

This example demonstrates:
- Retrieving a list of securities
- Fetching current market data
- Getting historical data
- Creating a simple price chart

## Advanced Usage Example

The advanced example shows more complex functionality:

```bash
python advanced_usage.py
```

This example demonstrates:
- Parallel fetching of multiple securities
- Performance comparison between securities
- Multi-timeframe analysis
- Advanced visualization techniques
- Index component analysis
- Performance metrics calculation

## Custom Implementation

To implement your own custom analysis:

1. Import the necessary components:
   ```python
   from moex_fetcher import MoexApiClient
   from moex_fetcher.endpoints import get_stock_candles, get_security_history
   ```

2. Initialize the client:
   ```python
   client = MoexApiClient()
   ```

3. Fetch and analyze data:
   ```python
   # Get historical data for a security
   candles = get_stock_candles(client, "SBER", interval="day", 
                              start_date="2022-01-01", end_date="2022-12-31")
   
   # Perform your custom analysis
   # ...
   ```

## Performance Considerations

When running examples with large datasets or multiple securities, consider:

1. Using the client's rate limiting capabilities to avoid API throttling
2. Implementing caching for frequently accessed data
3. Using parallel processing for fetching multiple securities
4. Limiting the date range to reduce data volume

## Troubleshooting

If you encounter issues while running the examples:

1. Ensure you have installed all dependencies from requirements.txt
2. Check your internet connection
3. Verify that the MOEX ISS API is accessible (https://iss.moex.com/iss/reference/)
4. Check for error messages in the console output
