#!/usr/bin/env python
"""
Advanced usage examples for the MOEX ISS API Fetcher.

This script demonstrates more complex usage patterns including:
- Batch processing multiple securities
- Multi-timeframe analysis
- Data visualization
- Custom data filtering and transformation
- Parallel processing
- Performance optimization techniques
"""

import concurrent.futures
import datetime
import functools
import time
from typing import Dict, List, Optional, Tuple

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.dates import DateFormatter

from moex_fetcher import MoexApiClient
from moex_fetcher.endpoints import (
    get_stock_securities,
    get_stock_candles,
    get_market_data_snapshot,
    get_multi_timeframe_candles,
    get_index_composition,
)


# Cache frequently accessed data
@functools.lru_cache(maxsize=128)
def get_cached_security_history(
    client, ticker, interval, start_date, end_date, board
):
    """
    Cache security history data to improve performance for repeated calls.
    
    Args:
        client: MoexApiClient instance
        ticker: Security ticker
        interval: Candle interval
        start_date: Start date (as string)
        end_date: End date (as string)
        board: Trading board
        
    Returns:
        DataFrame with security history
    """
    return get_stock_candles(
        client, ticker, interval, start_date, end_date, board
    )


def get_multiple_securities_data(
    client: MoexApiClient,
    tickers: List[str],
    interval: str = "day",
    days_back: int = 90,
    max_workers: int = 4,
) -> Dict[str, pd.DataFrame]:
    """
    Fetch historical data for multiple securities in parallel.
    
    Args:
        client: MoexApiClient instance
        tickers: List of security tickers
        interval: Candle interval (min, hour, day, etc.)
        days_back: Number of days of history to fetch
        max_workers: Maximum number of parallel workers
        
    Returns:
        Dictionary mapping tickers to their respective DataFrame history
    """
    # Calculate date range
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=days_back)
    
    # Format dates as strings for caching
    start_str = start_date.strftime('%Y-%m-%d')
    end_str = end_date.strftime('%Y-%m-%d')
    
    # Define worker function
    def fetch_security(ticker):
        try:
            return ticker, get_cached_security_history(
                client, ticker, interval, start_str, end_str, "TQBR"
            )
        except Exception as e:
            print(f"Error fetching data for {ticker}: {str(e)}")
            return ticker, None
    
    # Use ThreadPoolExecutor for parallel fetching
    results = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        for ticker, data in executor.map(fetch_security, tickers):
            if data is not None:
                results[ticker] = data
    
    return results


def compare_securities(
    client: MoexApiClient,
    tickers: List[str],
    days_back: int = 365,
    base_value: float = 100.0,
):
    """
    Compare the relative performance of multiple securities.
    
    Args:
        client: MoexApiClient instance
        tickers: List of security tickers to compare
        days_back: Number of days to look back
        base_value: Starting value for normalization (e.g., 100 for percentage)
    """
    # Fetch data for all tickers
    securities_data = get_multiple_securities_data(
        client, tickers, interval="day", days_back=days_back
    )
    
    # Prepare figure
    plt.figure(figsize=(14, 8))
    
    # Process each security
    for ticker, df in securities_data.items():
        if df is None or df.empty:
            continue
        
        # Calculate relative performance
        if 'close' not in df.columns:
            continue
            
        # Normalize to base_value
        first_close = df['close'].iloc[0]
        normalized = (df['close'] / first_close) * base_value
        
        # Plot
        plt.plot(df['begin'], normalized, label=ticker)
    
    # Add chart elements
    plt.title(f"Relative Performance (Base {base_value})")
    plt.xlabel("Date")
    plt.ylabel(f"Value (Base {base_value})")
    plt.legend()
    plt.grid(True)
    
    # Format x-axis dates
    plt.gca().xaxis.set_major_formatter(DateFormatter('%Y-%m-%d'))
    plt.xticks(rotation=45)
    
    plt.tight_layout()
    plt.savefig("securities_comparison.png")
    print("Chart saved to 'securities_comparison.png'")


def calculate_metrics(
    client: MoexApiClient,
    tickers: List[str],
    days_back: int = 252,  # Approximately 1 trading year
) -> pd.DataFrame:
    """
    Calculate key performance metrics for a list of securities.
    
    Args:
        client: MoexApiClient instance
        tickers: List of security tickers
        days_back: Number of days to analyze
        
    Returns:
        DataFrame with metrics for each security
    """
    # Fetch data
    securities_data = get_multiple_securities_data(
        client, tickers, interval="day", days_back=days_back
    )
    
    # Prepare results
    metrics = []
    
    # Process each security
    for ticker, df in securities_data.items():
        if df is None or df.empty or len(df) < 20:
            continue
        
        # Calculate returns
        df['return'] = df['close'].pct_change()
        
        # Calculate metrics
        try:
            # Skip first row with NaN return
            returns = df['return'].iloc[1:].dropna()
            
            # Only calculate if we have enough data
            if len(returns) < 20:
                continue
                
            volatility = returns.std() * np.sqrt(252)  # Annualized volatility
            sharpe = (returns.mean() * 252) / volatility  # Annualized Sharpe ratio
            max_drawdown = calculate_max_drawdown(df['close'])
            
            # Latest price and 52-week range
            latest_price = df['close'].iloc[-1]
            high_52w = df['high'].max()
            low_52w = df['low'].min()
            
            # Prepare metrics row
            metrics.append({
                'ticker': ticker,
                'latest_price': latest_price,
                'change_percent': (df['close'].iloc[-1] / df['close'].iloc[0] - 1) * 100,
                'volatility': volatility * 100,  # As percentage
                'sharpe_ratio': sharpe,
                'max_drawdown': max_drawdown * 100,  # As percentage
                'high_52w': high_52w,
                'low_52w': low_52w,
                'high_52w_percent': (latest_price / high_52w - 1) * 100,  # % from 52w high
                'low_52w_percent': (latest_price / low_52w - 1) * 100,  # % from 52w low
            })
            
        except Exception as e:
            print(f"Error calculating metrics for {ticker}: {str(e)}")
    
    # Convert to DataFrame
    metrics_df = pd.DataFrame(metrics)
    
    # Sort by change percent
    if not metrics_df.empty:
        metrics_df.sort_values(by='change_percent', ascending=False, inplace=True)
    
    return metrics_df


def calculate_max_drawdown(prices: pd.Series) -> float:
    """
    Calculate the maximum drawdown for a price series.
    
    Args:
        prices: Series of prices
        
    Returns:
        Maximum drawdown as a decimal (not percentage)
    """
    # Calculate cumulative maximum
    rolling_max = prices.cummax()
    
    # Calculate drawdowns
    drawdowns = (prices / rolling_max) - 1
    
    # Find maximum drawdown
    max_drawdown = drawdowns.min()
    
    return max_drawdown


def analyze_index_stocks(client: MoexApiClient, index_id: str = "IMOEX") -> pd.DataFrame:
    """
    Analyze the performance of stocks in a given index.
    
    Args:
        client: MoexApiClient instance
        index_id: Index identifier (default: IMOEX - Moscow Exchange Index)
        
    Returns:
        DataFrame with performance analysis
    """
    # Get index composition
    composition = get_index_composition(client, index_id)
    
    # Extract tickers
    if 'ticker' in composition.columns:
        tickers = composition['ticker'].tolist()
    else:
        print("Unexpected index composition format")
        return pd.DataFrame()
    
    # Calculate metrics
    metrics = calculate_metrics(client, tickers)
    
    # Merge with index weights
    if not metrics.empty:
        result = pd.merge(
            metrics,
            composition[['ticker', 'weight']],
            left_on='ticker',
            right_on='ticker',
            how='left'
        )
        
        # Calculate weighted return contribution
        result['return_contribution'] = result['change_percent'] * result['weight'] / 100
        
        return result
    
    return metrics


def plot_security_with_volume(
    client: MoexApiClient,
    ticker: str,
    days_back: int = 180,
):
    """
    Create a price chart with volume bars for a security.
    
    Args:
        client: MoexApiClient instance
        ticker: Security ticker
        days_back: Number of days to display
    """
    # Fetch data
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=days_back)
    df = get_stock_candles(
        client, ticker, interval="day", 
        start_date=start_date, end_date=end_date
    )
    
    if df is None or df.empty:
        print(f"No data available for {ticker}")
        return
        
    # Create figure with two subplots sharing x-axis
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10), gridspec_kw={'height_ratios': [3, 1]}, sharex=True)
    
    # Plot price
    ax1.plot(df['begin'], df['close'], label='Close')
    
    # Add moving averages
    if len(df) >= 20:
        df['ma20'] = df['close'].rolling(window=20).mean()
        ax1.plot(df['begin'], df['ma20'], label='20-day MA', linestyle='--')
    
    if len(df) >= 50:
        df['ma50'] = df['close'].rolling(window=50).mean()
        ax1.plot(df['begin'], df['ma50'], label='50-day MA', linestyle='-.')
    
    # Configure price chart
    ax1.set_title(f"{ticker} Price Chart")
    ax1.set_ylabel("Price")
    ax1.legend()
    ax1.grid(True)
    
    # Plot volume
    ax2.bar(df['begin'], df['volume'], width=0.8, alpha=0.7, color='navy')
    
    # Calculate average volume
    avg_volume = df['volume'].mean()
    ax2.axhline(avg_volume, color='red', linestyle='--', label=f'Avg: {avg_volume:.0f}')
    
    # Configure volume chart
    ax2.set_ylabel("Volume")
    ax2.set_xlabel("Date")
    ax2.grid(True)
    
    # Format x-axis dates
    ax2.xaxis.set_major_formatter(DateFormatter('%Y-%m-%d'))
    plt.xticks(rotation=45)
    
    plt.tight_layout()
    plt.savefig(f"{ticker}_price_volume.png")
    print(f"Chart saved to '{ticker}_price_volume.png'")


def perform_index_analysis(client: MoexApiClient):
    """
    Perform comprehensive analysis of index components.
    """
    # Analyze MOEX index
    print("\n=== Moscow Exchange Index Analysis ===")
    index_analysis = analyze_index_stocks(client, "IMOEX")
    
    if index_analysis.empty:
        print("Failed to retrieve index analysis")
        return
    
    # Display top 5 performers
    print("\nTop 5 Performers:")
    print(index_analysis.nlargest(5, 'change_percent')[
        ['ticker', 'change_percent', 'weight', 'return_contribution']
    ])
    
    # Display bottom 5 performers
    print("\nBottom 5 Performers:")
    print(index_analysis.nsmallest(5, 'change_percent')[
        ['ticker', 'change_percent', 'weight', 'return_contribution']
    ])
    
    # Display top contributors to index performance
    print("\nTop 5 Contributors to Index Performance:")
    print(index_analysis.nlargest(5, 'return_contribution')[
        ['ticker', 'change_percent', 'weight', 'return_contribution']
    ])
    
    # Save full analysis to CSV
    index_analysis.to_csv("imoex_analysis.csv", index=False)
    print("\nFull analysis saved to 'imoex_analysis.csv'")


def perform_multi_timeframe_security_analysis(
    client: MoexApiClient,
    ticker: str = "SBER",
):
    """
    Perform multi-timeframe analysis for a security.
    """
    print(f"\n=== Multi-timeframe Analysis for {ticker} ===")
    
    # Get data for different timeframes
    timeframes = {
        "day": 365,    # 1 year of daily data
        "week": 520,   # 10 years of weekly data
        "month": 1560  # 30 years of monthly data (if available)
    }
    
    # Fetch multiple timeframes
    data = {}
    end_date = datetime.date.today()
    
    for interval, days in timeframes.items():
        start_date = end_date - datetime.timedelta(days=days)
        try:
            df = get_stock_candles(
                client, ticker, interval=interval, 
                start_date=start_date, end_date=end_date
            )
            if df is not None and not df.empty:
                data[interval] = df
                print(f"  {interval.capitalize()} data: {len(df)} periods")
        except Exception as e:
            print(f"  Error fetching {interval} data: {str(e)}")
    
    # Calculate key metrics for each timeframe
    for interval, df in data.items():
        if df is None or df.empty:
            continue
            
        # Add returns
        df['return'] = df['close'].pct_change()
        
        # Calculate metrics
        returns = df['return'].dropna()
        
        if not returns.empty:
            volatility = returns.std() * np.sqrt(252)  # Annualized
            total_return = (df['close'].iloc[-1] / df['close'].iloc[0] - 1) * 100
            
            print(f"\n{interval.capitalize()} metrics for {ticker}:")
            print(f"  Total Return: {total_return:.2f}%")
            print(f"  Annualized Volatility: {volatility * 100:.2f}%")
            print(f"  Sharpe Ratio: {(returns.mean() * 252) / volatility:.2f}")
            print(f"  Max Drawdown: {calculate_max_drawdown(df['close']) * 100:.2f}%")


def main():
    """Run the advanced example script."""
    # Initialize the API client
    client = MoexApiClient()
    
    try:
        # Example 1: Compare multiple securities
        print("\n=== Example 1: Comparing Blue-Chip Stocks ===")
        blue_chips = ["SBER", "GAZP", "LKOH", "GMKN", "YNDX", "ROSN", "MTSS"]
        compare_securities(client, blue_chips, days_back=365)
        
        # Example 2: Create detailed price/volume chart
        print("\n=== Example 2: Detailed Price and Volume Analysis ===")
        plot_security_with_volume(client, "SBER", days_back=180)
        
        # Example 3: Index analysis
        perform_index_analysis(client)
        
        # Example 4: Multi-timeframe analysis
        perform_multi_timeframe_security_analysis(client, "SBER")
        
    except Exception as e:
        print(f"Error in main execution: {str(e)}")


if __name__ == "__main__":
    main()
