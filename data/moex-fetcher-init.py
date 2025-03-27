"""
MOEX ISS API Fetcher

A comprehensive client for the Moscow Exchange (MOEX) Informational & Statistical Server (ISS) API.
This package provides tools to access market data, historical quotes, security information,
and other trading-related data from the Moscow Exchange.

Usage:
    from moex_fetcher import MoexApiClient

    # Initialize client
    client = MoexApiClient()

    # Get securities listing
    securities = client.get_securities()
"""

__version__ = "0.1.0"

from .client import MoexApiClient
from .exceptions import (
    MoexApiError,
    MoexConnectionError,
    MoexResponseError,
    MoexAuthError,
)

__all__ = [
    "MoexApiClient",
    "MoexApiError",
    "MoexConnectionError",
    "MoexResponseError",
    "MoexAuthError",
]
