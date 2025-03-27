#!/usr/bin/env python
"""
Example usage of the MOEX ISS API Fetcher.

This script demonstrates various ways to use the fetcher to retrieve and analyze
data from the Moscow Exchange.
"""

import datetime
import pandas as pd
import matplotlib.pyplot as plt
from moex_fetcher import MoexApiClient
from moex_fetcher.endpoints import (
    get_stock_securities,
    get_security_history,
    get_stock_candles,
    get_market_data_snapshot,
)


def main():
    """Run the example script."""
    # Initialize the API client
    client = MoexApiClient()
    
    # Example 1: Get a list of available securities on the main stock board
    print("\n=== Example 1: List of Main Board Stocks ===")
    stocks = get_stock_securities(client)
    print(f"Found {len(stocks)} stocks on the main board")
    print(stocks.head())
    
    # Example 2: Get market data for a few large-cap stocks
    print("\n=== Example 2: Current Market Data for Large-Cap Stocks ===")
    large_caps = ["SBER", "GAZP", "LKOH", "GMKN", "ROSN"]
    market_data = get_market_data_snapshot(client, large_caps)
    print(market_data)
    
    # Example 3: Get historical data for Sberbank
    print("\n=== Example 3: Historical Data for Sberbank (SBER) ===")
    # Get data for the last 30 days
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=30)
    sber_history = get_security_history(
        client, "SBER", start_date=start_date, end_date=end_date
    )
    print(sber_history.head())
    
    # Example 4: Get daily candles for Gazprom
    print("\n=== Example 4: Daily Candles for Gazprom (GAZP) ===")
    # Get data for the last 90 days
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=90)
    gazp_candles = get_stock_candles(
        client, "GAZP", interval="day", start_date=start_date, end_date=end_date
    )
    print(gazp_candles.head())
    
    # Example 5: Plot the closing prices for Sberbank
    print("\n=== Example 5: Plotting Sberbank Price Chart ===")
    try:
        # Get daily candles for the last 365 days
        end_date = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=365)
        sber_candles = get_stock_candles(
            client, "SBER", interval="day", start_date=start_date, end_date=end_date
        )
        
        # Plot closing prices
        plt.figure(figsize=(12, 6))
        plt.plot(sber_candles["begin"], sber_candles["close"])
        plt.title("Sberbank (SBER) - Daily Closing Prices")
        plt.xlabel("Date")
        plt.ylabel("Price")
        plt.grid(True)
        plt.tight_layout()
        
        # Save the chart to a file
        plt.savefig("sber_price_chart.png")
        print("Chart saved to 'sber_price_chart.png'")
    
    except Exception as e:
        print(f"Error plotting chart: {str(e)}")
    
    # Example 6: Direct API access using the client
    print("\n=== Example 6: Direct API Access - Market Engines ===")
    engines = client.get_engines()
    print(engines)


if __name__ == "__main__":
    main()
