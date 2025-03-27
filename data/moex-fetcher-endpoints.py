"""
Higher-level endpoint functions for the MOEX ISS API.

This module provides specialized functions that build on the core MoexApiClient
to offer more targeted data retrieval operations with simplified interfaces.
"""

import datetime
from typing import Dict, List, Optional, Union, Any, Tuple

import pandas as pd

from .client import MoexApiClient
from .exceptions import MoexApiError
from .utils import format_date, validate_date_range


def get_stock_securities(client: MoexApiClient, board: str = "TQBR") -> pd.DataFrame:
    """
    Gets a list of stock securities from the main board.
    
    This is a convenience function for the most common use case of getting
    a list of main-board stocks.
    
    Args:
        client: An initialized MoexApiClient.
        board: Board ID (defaults to "TQBR", which is the main board for stocks).
        
    Returns:
        A DataFrame with stock information.
    """
    return client.get_securities(engine="stock", market="shares", board=board)


def get_bond_securities(client: MoexApiClient, board: str = "TQOB") -> pd.DataFrame:
    """
    Gets a list of bond securities from the main board.
    
    Args:
        client: An initialized MoexApiClient.
        board: Board ID (defaults to "TQOB", which is the main bond board).
        
    Returns:
        A DataFrame with bond information.
    """
    return client.get_securities(engine="stock", market="bonds", board=board)


def get_security_history(
    client: MoexApiClient,
    ticker: str,
    start_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
    end_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
    board: str = "TQBR",
    engine: str = "stock",
    market: str = "shares",
    market_data: bool = True,
) -> pd.DataFrame:
    """
    Gets historical trading data for a specific security.
    
    This is a convenience function for retrieving historical data with defaults
    for common securities.
    
    Args:
        client: An initialized MoexApiClient.
        ticker: The security ticker symbol.
        start_date: Start date for the data range.
        end_date: End date for the data range.
        board: Board ID (defaults to TQBR, the main stock board).
        engine: Trading engine ID (defaults to 'stock').
        market: Market ID (defaults to 'shares').
        market_data: Whether to include market data (prices, volumes) or only security info.
        
    Returns:
        A DataFrame with historical trading data.
    """
    # Determine whether we need historical market data or just security information
    if market_data:
        return client.get_market_history(
            security_id=ticker,
            engine=engine,
            market=market,
            board=board,
            start_date=start_date,
            end_date=end_date,
        )
    else:
        return client.get_security_info(security_id=ticker)


def get_stock_candles(
    client: MoexApiClient,
    ticker: str,
    interval: str = "day",
    start_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
    end_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
    board: str = "TQBR",
) -> pd.DataFrame:
    """
    Gets historical candles for a stock security with human-friendly interval names.
    
    This is a convenience function that converts human-readable interval names
    to the numeric codes required by the API.
    
    Args:
        client: An initialized MoexApiClient.
        ticker: The security ticker symbol.
        interval: Time interval in human-readable form:
                  'min' or '1min' - 1 minute
                  '10min' - 10 minutes
                  'hour' - 1 hour
                  'day' - 1 day
                  'week' - 1 week
                  'month' - 1 month
                  'quarter' - 1 quarter
        start_date: Start date for the data range.
        end_date: End date for the data range.
        board: Board ID (defaults to TQBR, the main stock board).
        
    Returns:
        A DataFrame with candle data (open, high, low, close, volume).
        
    Raises:
        ValueError: If the interval name is not recognized.
    """
    # Map human-readable interval names to API interval codes
    interval_map = {
        "min": 1, "1min": 1,
        "10min": 10,
        "hour": 60,
        "day": 24,
        "week": 7,
        "month": 31,
        "quarter": 4,
    }
    
    if interval not in interval_map:
        raise ValueError(
            f"Invalid interval: '{interval}'. "
            f"Valid intervals are: {', '.join(interval_map.keys())}"
        )
    
    interval_code = interval_map[interval]
    
    return client.get_candles(
        security_id=ticker,
        engine="stock",
        market="shares",
        board=board,
        interval=interval_code,
        start_date=start_date,
        end_date=end_date,
    )


def get_index_composition(
    client: MoexApiClient,
    index_id: str = "IMOEX",
) -> pd.DataFrame:
    """
    Gets the composition (component securities) of a MOEX index.
    
    Args:
        client: An initialized MoexApiClient.
        index_id: The index ID (defaults to "IMOEX", the Moscow Exchange Index).
        
    Returns:
        A DataFrame with index component securities and their weights.
    """
    return client.get_index_components(index_id)


def find_security(
    client: MoexApiClient,
    query: str,
    engine: Optional[str] = None,
    market: Optional[str] = None,
) -> pd.DataFrame:
    """
    Searches for securities by name or ticker.
    
    Args:
        client: An initialized MoexApiClient.
        query: Search query string.
        engine: Optional filter by engine ID.
        market: Optional filter by market ID (requires engine to be specified).
        
    Returns:
        A DataFrame with matching securities.
    """
    if engine and market:
        # Search within a specific engine and market
        securities = client.get_securities(engine=engine, market=market)
        # Filter by query (case-insensitive search in ticker or name)
        return securities[
            securities["SECID"].str.contains(query, case=False) |
            securities["SHORTNAME"].str.contains(query, case=False)
        ]
    else:
        # General search using the API's search endpoint
        return client.get_securities(query=query)


def get_market_data_snapshot(
    client: MoexApiClient,
    tickers: List[str],
    board: str = "TQBR",
    engine: str = "stock",
    market: str = "shares",
) -> pd.DataFrame:
    """
    Gets current market data for multiple securities in a single DataFrame.
    
    Args:
        client: An initialized MoexApiClient.
        tickers: List of security ticker symbols.
        board: Board ID (defaults to TQBR, the main stock board).
        engine: Trading engine ID (defaults to 'stock').
        market: Market ID (defaults to 'shares').
        
    Returns:
        A DataFrame with current market data for all requested securities.
    """
    # Create an empty list to store data for each ticker
    all_data = []
    
    # Fetch data for each ticker
    for ticker in tickers:
        try:
            ticker_data = client.get_market_data(
                security_id=ticker,
                engine=engine,
                market=market,
                board=board,
            )
            
            # Add the ticker to identify rows
            ticker_data["TICKER"] = ticker
            
            # Append to the list
            all_data.append(ticker_data)
        
        except MoexApiError as e:
            # Skip tickers that return errors
            print(f"Error fetching data for {ticker}: {str(e)}")
            continue
    
    # Combine all data into a single DataFrame
    if not all_data:
        # Return empty DataFrame with appropriate columns if no data was fetched
        return pd.DataFrame(columns=["TICKER", "LAST", "CHANGE", "VOLTODAY", "OPEN", "LOW", "HIGH"])
    
    return pd.concat(all_data, ignore_index=True)


def get_board_securities_with_market_data(
    client: MoexApiClient,
    board: str = "TQBR",
    engine: str = "stock",
    market: str = "shares",
) -> pd.DataFrame:
    """
    Gets a list of securities on a board with their current market data.
    
    This function combines security listing and market data in a single DataFrame.
    
    Args:
        client: An initialized MoexApiClient.
        board: Board ID (defaults to TQBR, the main stock board).
        engine: Trading engine ID (defaults to 'stock').
        market: Market ID (defaults to 'shares').
        
    Returns:
        A DataFrame with securities and their current market data.
    """
    # Get securities list
    securities = client.get_securities(engine=engine, market=market, board=board)
    
    # Extract just the ticker column for use in market data query
    tickers = securities["SECID"].tolist()
    
    # Get market data for these tickers
    market_data = get_market_data_snapshot(
        client=client,
        tickers=tickers,
        board=board,
        engine=engine,
        market=market,
    )
    
    # Merge securities info with market data
    if not market_data.empty:
        result = pd.merge(
            securities,
            market_data,
            left_on="SECID",
            right_on="TICKER",
            how="left",
        )
        
        # Drop the duplicate ticker column
        if "TICKER" in result.columns:
            result = result.drop(columns=["TICKER"])
        
        return result
    
    return securities


def get_multi_timeframe_candles(
    client: MoexApiClient,
    ticker: str,
    intervals: List[str],
    start_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
    end_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
    board: str = "TQBR",
) -> Dict[str, pd.DataFrame]:
    """
    Gets candles for multiple timeframes for a single security.
    
    Args:
        client: An initialized MoexApiClient.
        ticker: The security ticker symbol.
        intervals: List of interval names ('min', 'hour', 'day', etc.)
        start_date: Start date for the data range.
        end_date: End date for the data range.
        board: Board ID (defaults to TQBR, the main stock board).
        
    Returns:
        A dictionary mapping interval names to DataFrames with candle data.
    """
    result = {}
    
    for interval in intervals:
        try:
            candles = get_stock_candles(
                client=client,
                ticker=ticker,
                interval=interval,
                start_date=start_date,
                end_date=end_date,
                board=board,
            )
            
            result[interval] = candles
        
        except ValueError as e:
            # Skip invalid intervals
            print(f"Error with interval '{interval}': {str(e)}")
            continue
        
        except MoexApiError as e:
            # Skip intervals that fail with API errors
            print(f"API error for interval '{interval}': {str(e)}")
            continue
    
    return result
