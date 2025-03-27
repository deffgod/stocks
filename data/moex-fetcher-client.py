"""
Core client implementation for the MOEX ISS API.

This module provides the primary interface for interacting with the Moscow Exchange
Informational & Statistical Server (ISS) API. It handles request construction,
response parsing, error handling, and rate limiting.
"""

import datetime
import json
import time
from typing import Dict, List, Optional, Union, Any, Tuple

import requests
import pandas as pd

from .exceptions import (
    MoexApiError,
    MoexConnectionError,
    MoexResponseError,
    MoexAuthError,
    MoexRateLimitError,
    MoexParsingError,
)
from .parsers import parse_json_response, response_to_dataframe, normalize_dataframe
from .utils import build_url, validate_date_range, build_query_params


class MoexApiClient:
    """
    Client for the Moscow Exchange (MOEX) ISS API.
    
    This class provides methods to access market data, historical quotes,
    security information, and other trading-related data from the Moscow Exchange.
    
    Attributes:
        base_url: The base URL for the MOEX ISS API.
        session: The requests Session used for making HTTP requests.
        rate_limit: The minimum seconds between API requests (for rate limiting).
        last_request_time: Timestamp of the last request (for rate limiting).
    """
    
    # Constants
    BASE_URL = "https://iss.moex.com/iss"
    DEFAULT_FORMAT = "json"
    RATE_LIMIT = 0.2  # Seconds between requests (5 requests per second)
    
    def __init__(
        self,
        session: Optional[requests.Session] = None,
        rate_limit: Optional[float] = None,
        timeout: Optional[int] = 30,
    ):
        """
        Initializes the MOEX API client.
        
        Args:
            session: An existing requests.Session (a new one is created if None).
            rate_limit: Minimum seconds between requests (for rate limiting).
            timeout: Default timeout for requests in seconds.
        """
        self.base_url = self.BASE_URL
        self.session = session or requests.Session()
        self.rate_limit = rate_limit or self.RATE_LIMIT
        self.timeout = timeout
        self.last_request_time = 0.0
    
    def _enforce_rate_limit(self):
        """Enforces rate limiting by waiting if necessary."""
        if self.rate_limit:
            elapsed = time.time() - self.last_request_time
            if elapsed < self.rate_limit:
                time.sleep(self.rate_limit - elapsed)
    
    def _make_request(
        self,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        path_params: Optional[Dict[str, str]] = None,
        method: str = "GET",
        timeout: Optional[int] = None,
        format_type: str = DEFAULT_FORMAT,
    ) -> requests.Response:
        """
        Makes an HTTP request to the MOEX ISS API.
        
        Args:
            endpoint: The API endpoint path.
            params: Query parameters for the request.
            path_params: Parameters to be substituted in the endpoint path.
            method: HTTP method (GET, POST, etc.).
            timeout: Request timeout in seconds.
            format_type: Response format (json, xml, etc.).
        
        Returns:
            The HTTP response object.
        
        Raises:
            MoexConnectionError: If a connection error occurs.
            MoexResponseError: If the API returns an error response.
            MoexAuthError: If authentication fails.
            MoexRateLimitError: If rate limits are exceeded.
        """
        # Enforce rate limiting
        self._enforce_rate_limit()
        
        # Process path parameters
        path_params = path_params or {}
        url = build_url(self.base_url, endpoint, **path_params)
        
        # Process query parameters
        query_params = {"iss.json": "extended", "iss.meta": "off"}
        if format_type:
            if not endpoint.endswith(f".{format_type}"):
                url = f"{url}.{format_type}"
        if params:
            query_params.update(build_query_params(params))
        
        # Set timeout
        timeout = timeout or self.timeout
        
        try:
            # Make the request
            if method.upper() == "GET":
                response = self.session.get(url, params=query_params, timeout=timeout)
            elif method.upper() == "POST":
                response = self.session.post(url, data=query_params, timeout=timeout)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            # Record the request time for rate limiting
            self.last_request_time = time.time()
            
            # Check for HTTP errors
            if response.status_code == 429:
                retry_after = int(response.headers.get("Retry-After", "60"))
                raise MoexRateLimitError(
                    "Rate limit exceeded", 
                    status_code=response.status_code,
                    response=response,
                    retry_after=retry_after
                )
            if response.status_code == 401 or response.status_code == 403:
                raise MoexAuthError(
                    "Authentication failed", 
                    status_code=response.status_code, 
                    response=response
                )
            if response.status_code >= 400:
                raise MoexResponseError(
                    f"API returned error response: {response.status_code}", 
                    status_code=response.status_code,
                    response=response
                )
            
            return response
        
        except requests.exceptions.RequestException as e:
            raise MoexConnectionError(
                "Failed to connect to MOEX API", 
                original_error=e
            )
    
    def get_json(
        self,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        path_params: Optional[Dict[str, str]] = None,
        method: str = "GET",
        timeout: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Makes a request to the MOEX ISS API and returns the JSON response.
        
        Args:
            endpoint: The API endpoint path.
            params: Query parameters for the request.
            path_params: Parameters to be substituted in the endpoint path.
            method: HTTP method (GET, POST, etc.).
            timeout: Request timeout in seconds.
        
        Returns:
            The parsed JSON response.
        
        Raises:
            MoexApiError: If the request fails or the response is invalid.
        """
        response = self._make_request(
            endpoint=endpoint,
            params=params,
            path_params=path_params,
            method=method,
            timeout=timeout,
            format_type="json",
        )
        
        try:
            return response.json()
        except json.JSONDecodeError as e:
            raise MoexParsingError(
                "Failed to parse JSON response", 
                data=response.text,
                original_error=e
            )
    
    def get_data(
        self,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        path_params: Optional[Dict[str, str]] = None,
        method: str = "GET",
        timeout: Optional[int] = None,
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Makes a request to the MOEX ISS API and returns the parsed data.
        
        This method parses the MOEX ISS response format, which typically contains
        multiple data blocks with 'columns' and 'data' arrays.
        
        Args:
            endpoint: The API endpoint path.
            params: Query parameters for the request.
            path_params: Parameters to be substituted in the endpoint path.
            method: HTTP method (GET, POST, etc.).
            timeout: Request timeout in seconds.
        
        Returns:
            A dictionary with parsed data blocks.
        
        Raises:
            MoexApiError: If the request fails or the response is invalid.
        """
        json_response = self.get_json(
            endpoint=endpoint,
            params=params,
            path_params=path_params,
            method=method,
            timeout=timeout,
        )
        
        return parse_json_response(json_response)
    
    def get_dataframe(
        self,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        path_params: Optional[Dict[str, str]] = None,
        method: str = "GET",
        timeout: Optional[int] = None,
        block_name: Optional[str] = None,
        normalize: bool = True,
    ) -> Union[pd.DataFrame, Dict[str, pd.DataFrame]]:
        """
        Makes a request to the MOEX ISS API and returns the response as pandas DataFrame(s).
        
        Args:
            endpoint: The API endpoint path.
            params: Query parameters for the request.
            path_params: Parameters to be substituted in the endpoint path.
            method: HTTP method (GET, POST, etc.).
            timeout: Request timeout in seconds.
            block_name: Specific data block to return (returns all blocks if None).
            normalize: Whether to normalize the DataFrame columns (convert types).
        
        Returns:
            Either a single DataFrame or a dictionary of DataFrames for each data block.
        
        Raises:
            MoexApiError: If the request fails or the response is invalid.
        """
        parsed_data = self.get_data(
            endpoint=endpoint,
            params=params,
            path_params=path_params,
            method=method,
            timeout=timeout,
        )
        
        result = response_to_dataframe(parsed_data, block_name)
        
        if normalize:
            if isinstance(result, pd.DataFrame):
                return normalize_dataframe(result)
            else:
                return {name: normalize_dataframe(df) for name, df in result.items()}
        
        return result
    
    # --- API Endpoints ---
    
    def get_engines(self) -> pd.DataFrame:
        """
        Gets a list of trading engines available on MOEX.
        
        Returns:
            A DataFrame with information about trading engines.
        """
        return self.get_dataframe(
            endpoint="/engines",
            block_name="engines",
        )
    
    def get_markets(self, engine: str) -> pd.DataFrame:
        """
        Gets a list of markets for a specific trading engine.
        
        Args:
            engine: Trading engine ID (e.g., 'stock', 'futures', 'currency').
            
        Returns:
            A DataFrame with information about available markets within the specified engine.
        """
        return self.get_dataframe(
            endpoint="/engines/[engine]/markets",
            path_params={"engine": engine},
            block_name="markets",
        )
    
    def get_boards(self, engine: str, market: str) -> pd.DataFrame:
        """
        Gets trading boards for a specific market.
        
        Args:
            engine: Trading engine ID (e.g., 'stock', 'futures').
            market: Market ID (e.g., 'shares', 'bonds', 'index').
            
        Returns:
            A DataFrame with information about trading boards.
        """
        return self.get_dataframe(
            endpoint="/engines/[engine]/markets/[market]/boards",
            path_params={"engine": engine, "market": market},
            block_name="boards",
        )
    
    def get_securities(
        self,
        engine: Optional[str] = None,
        market: Optional[str] = None,
        board: Optional[str] = None,
        query: Optional[str] = None,
    ) -> pd.DataFrame:
        """
        Gets a list of securities based on specified criteria.
        
        This method can retrieve securities at different levels:
        - All securities on MOEX if no parameters are provided
        - Securities within a specific engine/market/board combination
        - Securities matching a search query
        
        Args:
            engine: Trading engine ID (optional).
            market: Market ID (optional, requires engine).
            board: Board ID (optional, requires engine and market).
            query: Search query to filter securities (optional).
            
        Returns:
            A DataFrame with security information.
        """
        if query:
            # Search for securities by name/code
            params = {"q": query}
            endpoint = "/securities"
            path_params = {}
        elif engine and market and board:
            # Get securities for a specific board
            endpoint = "/engines/[engine]/markets/[market]/boards/[board]/securities"
            path_params = {"engine": engine, "market": market, "board": board}
            params = {}
        elif engine and market:
            # Get securities for a specific market
            endpoint = "/engines/[engine]/markets/[market]/securities"
            path_params = {"engine": engine, "market": market}
            params = {}
        else:
            # Get all securities
            endpoint = "/securities"
            path_params = {}
            params = {}
        
        return self.get_dataframe(
            endpoint=endpoint,
            path_params=path_params,
            params=params,
            block_name="securities",
        )
    
    def get_security_info(self, security_id: str) -> Dict[str, pd.DataFrame]:
        """
        Gets detailed information about a specific security.
        
        Args:
            security_id: The security ID (ticker).
            
        Returns:
            A dictionary of DataFrames with security information, description,
            boards where it's traded, and other related data.
        """
        return self.get_dataframe(
            endpoint="/securities/[security]",
            path_params={"security": security_id},
        )
    
    def get_market_data(
        self,
        security_id: str,
        engine: Optional[str] = None,
        market: Optional[str] = None,
        board: Optional[str] = None,
    ) -> pd.DataFrame:
        """
        Gets current market data for a specific security.
        
        This method provides real-time quotes, volumes, and other market data
        for the specified security.
        
        Args:
            security_id: The security ID (ticker).
            engine: Trading engine ID (optional for some securities).
            market: Market ID (optional for some securities).
            board: Board ID (optional for some securities).
            
        Returns:
            A DataFrame with current market data.
        """
        if engine and market and board:
            endpoint = "/engines/[engine]/markets/[market]/boards/[board]/securities/[security]"
            path_params = {
                "engine": engine,
                "market": market,
                "board": board,
                "security": security_id
            }
        else:
            # Try to get market data without specifying engine/market/board
            endpoint = "/securities/[security]/marketdata"
            path_params = {"security": security_id}
        
        return self.get_dataframe(
            endpoint=endpoint,
            path_params=path_params,
            block_name="marketdata",
        )
    
    def get_orderbook(
        self,
        security_id: str,
        engine: str,
        market: str,
        board: str,
        depth: int = 20,
    ) -> pd.DataFrame:
        """
        Gets the current orderbook (order queue) for a specific security.
        
        Args:
            security_id: The security ID (ticker).
            engine: Trading engine ID.
            market: Market ID.
            board: Board ID.
            depth: Orderbook depth (number of price levels).
            
        Returns:
            A DataFrame with bid and ask orders at different price levels.
        """
        return self.get_dataframe(
            endpoint="/engines/[engine]/markets/[market]/boards/[board]/securities/[security]/orderbook",
            path_params={
                "engine": engine,
                "market": market,
                "board": board,
                "security": security_id
            },
            params={"depth": depth},
            block_name="orderbook",
        )
    
    def get_trades(
        self,
        security_id: str,
        engine: str,
        market: str,
        board: Optional[str] = None,
        limit: int = 50,
    ) -> pd.DataFrame:
        """
        Gets recent trades for a specific security.
        
        Args:
            security_id: The security ID (ticker).
            engine: Trading engine ID.
            market: Market ID.
            board: Board ID (optional).
            limit: Maximum number of trades to return.
            
        Returns:
            A DataFrame with recent trades.
        """
        if board:
            endpoint = "/engines/[engine]/markets/[market]/boards/[board]/securities/[security]/trades"
            path_params = {
                "engine": engine,
                "market": market,
                "board": board,
                "security": security_id
            }
        else:
            endpoint = "/engines/[engine]/markets/[market]/securities/[security]/trades"
            path_params = {
                "engine": engine,
                "market": market,
                "security": security_id
            }
        
        return self.get_dataframe(
            endpoint=endpoint,
            path_params=path_params,
            params={"limit": limit},
            block_name="trades",
        )
    
    def get_candles(
        self,
        security_id: str,
        engine: str,
        market: str,
        interval: int = 24,
        start_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
        end_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
        board: Optional[str] = None,
        board_group: Optional[str] = None,
    ) -> pd.DataFrame:
        """
        Gets historical candles (OHLCV) for a specific security.
        
        Args:
            security_id: The security ID (ticker).
            engine: Trading engine ID.
            market: Market ID.
            interval: Candle interval code:
                      1 - 1 minute
                      10 - 10 minutes
                      60 - 1 hour
                      24 - 1 day
                      7 - 1 week
                      31 - 1 month
                      4 - 1 quarter
            start_date: Start date for data range.
            end_date: End date for data range.
            board: Board ID (optional - one of board or board_group must be provided).
            board_group: Board group ID (optional - one of board or board_group must be provided).
            
        Returns:
            A DataFrame with candle data (open, high, low, close, volume).
            
        Raises:
            ValueError: If neither board nor board_group is provided.
        """
        # Validate date range (if provided)
        if start_date or end_date:
            from_date, till_date = validate_date_range(start_date, end_date)
            date_params = {"from": from_date, "till": till_date}
        else:
            date_params = {}
        
        # Build common parameters
        params = {
            "interval": interval,
            **date_params
        }
        
        # Determine the endpoint based on board or board_group
        if board:
            endpoint = "/engines/[engine]/markets/[market]/boards/[board]/securities/[security]/candles"
            path_params = {
                "engine": engine,
                "market": market,
                "board": board,
                "security": security_id
            }
        elif board_group:
            endpoint = "/engines/[engine]/markets/[market]/boardgroups/[boardgroup]/securities/[security]/candles"
            path_params = {
                "engine": engine,
                "market": market,
                "boardgroup": board_group,
                "security": security_id
            }
        else:
            # Use default endpoint for the security
            endpoint = "/engines/[engine]/markets/[market]/securities/[security]/candles"
            path_params = {
                "engine": engine,
                "market": market,
                "security": security_id
            }
        
        return self.get_dataframe(
            endpoint=endpoint,
            path_params=path_params,
            params=params,
            block_name="candles",
        )
    
    def get_market_history(
        self,
        security_id: str,
        engine: str,
        market: str,
        start_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
        end_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
        board: Optional[str] = None,
        columns: Optional[List[str]] = None,
    ) -> pd.DataFrame:
        """
        Gets historical trading data for a specific security.
        
        Unlike candles, this method provides additional market statistics beyond OHLCV data.
        
        Args:
            security_id: The security ID (ticker).
            engine: Trading engine ID.
            market: Market ID.
            start_date: Start date for data range.
            end_date: End date for data range.
            board: Board ID (optional).
            columns: Specific columns to request (optional).
            
        Returns:
            A DataFrame with historical trading data.
        """
        # Validate date range (if provided)
        if start_date or end_date:
            from_date, till_date = validate_date_range(start_date, end_date)
            date_params = {"from": from_date, "till": till_date}
        else:
            date_params = {}
        
        # Build common parameters
        params = date_params.copy()
        
        # Add columns parameter if provided
        if columns:
            params["columns"] = columns
        
        # Determine the endpoint based on whether board is provided
        if board:
            endpoint = "/history/engines/[engine]/markets/[market]/boards/[board]/securities/[security]"
            path_params = {
                "engine": engine,
                "market": market,
                "board": board,
                "security": security_id
            }
        else:
            endpoint = "/history/engines/[engine]/markets/[market]/securities/[security]"
            path_params = {
                "engine": engine,
                "market": market,
                "security": security_id
            }
        
        return self.get_dataframe(
            endpoint=endpoint,
            path_params=path_params,
            params=params,
            block_name="history",
        )
    
    def get_board_history(
        self,
        board: str,
        engine: str = "stock",
        market: str = "shares",
        date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
    ) -> pd.DataFrame:
        """
        Gets historical trading data for all securities on a specific board for a single date.
        
        Args:
            board: Board ID.
            engine: Trading engine ID.
            market: Market ID.
            date: The specific date to get data for (defaults to the latest trading date).
            
        Returns:
            A DataFrame with historical trading data for all securities on the board.
        """
        params = {}
        if date:
            params["date"] = format_date(date)
        
        endpoint = "/history/engines/[engine]/markets/[market]/boards/[board]/securities"
        path_params = {
            "engine": engine,
            "market": market,
            "board": board
        }
        
        return self.get_dataframe(
            endpoint=endpoint,
            path_params=path_params,
            params=params,
            block_name="history",
        )
    
    def get_indices(self) -> pd.DataFrame:
        """
        Gets a list of indices calculated by MOEX.
        
        Returns:
            A DataFrame with index information.
        """
        return self.get_dataframe(
            endpoint="/statistics/engines/stock/markets/index/analytics",
            block_name="indices",
        )
    
    def get_index_components(self, index_id: str) -> pd.DataFrame:
        """
        Gets the components (constituents) of a specific MOEX index.
        
        Args:
            index_id: The index ID (e.g., 'IMOEX', 'RTSI').
            
        Returns:
            A DataFrame with index component securities and their weights.
        """
        return self.get_dataframe(
            endpoint="/statistics/engines/stock/markets/index/analytics/[indexid]/tickers",
            path_params={"indexid": index_id},
            block_name="tickers",
        )