"""
Unit tests for the MOEX API Client.

This module contains comprehensive tests for the core MOEX API client functionality,
covering request construction, response parsing, error handling, and rate limiting.
"""

import datetime
import json
import unittest
from unittest.mock import patch, MagicMock

import pandas as pd
import requests

from moex_fetcher.client import MoexApiClient
from moex_fetcher.exceptions import (
    MoexApiError,
    MoexConnectionError,
    MoexResponseError,
    MoexAuthError,
    MoexRateLimitError,
    MoexParsingError,
)


class MockResponse:
    """Mock HTTP response for testing."""
    
    def __init__(self, status_code, data, headers=None):
        self.status_code = status_code
        self._data = data
        self.headers = headers or {}
        self.text = json.dumps(data) if isinstance(data, (dict, list)) else str(data)
    
    def json(self):
        """Return response data as JSON."""
        if isinstance(self._data, (dict, list)):
            return self._data
        raise json.JSONDecodeError("Invalid JSON", "", 0)


class TestMoexApiClient(unittest.TestCase):
    """Test cases for the MoexApiClient class."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.client = MoexApiClient()
        
        # Sample API responses
        self.engines_response = {
            "engines": {
                "columns": ["id", "name", "title"],
                "data": [
                    ["stock", "stock", "Фондовый рынок и рынок депозитов"],
                    ["currency", "currency", "Валютный рынок"],
                    ["futures", "futures", "Срочный рынок"],
                ]
            }
        }
        
        self.securities_response = {
            "securities": {
                "columns": ["SECID", "BOARDID", "SHORTNAME", "LOTSIZE", "PREVPRICE"],
                "data": [
                    ["SBER", "TQBR", "Сбербанк", 10, 250.4],
                    ["GAZP", "TQBR", "ГАЗПРОМ ао", 10, 175.6],
                ]
            }
        }
    
    @patch("requests.Session.get")
    def test_get_engines(self, mock_get):
        """Test retrieving trading engines."""
        # Setup mock response
        mock_get.return_value = MockResponse(200, self.engines_response)
        
        # Call the method
        engines = self.client.get_engines()
        
        # Verify the request
        mock_get.assert_called_once()
        self.assertIn("/engines", mock_get.call_args[0][0])
        
        # Verify the response processing
        self.assertIsInstance(engines, pd.DataFrame)
        self.assertEqual(len(engines), 3)
        self.assertIn("id", engines.columns)
        self.assertEqual(engines.iloc[0]["id"], "stock")
    
    @patch("requests.Session.get")
    def test_get_securities(self, mock_get):
        """Test retrieving securities listing."""
        # Setup mock response
        mock_get.return_value = MockResponse(200, self.securities_response)
        
        # Call the method
        securities = self.client.get_securities(engine="stock", market="shares", board="TQBR")
        
        # Verify the request
        mock_get.assert_called_once()
        url_called = mock_get.call_args[0][0]
        self.assertIn("/engines/stock/markets/shares/boards/TQBR/securities", url_called)
        
        # Verify the response processing
        self.assertIsInstance(securities, pd.DataFrame)
        self.assertEqual(len(securities), 2)
        self.assertIn("SECID", securities.columns)
        self.assertEqual(securities.iloc[0]["SECID"], "SBER")
        self.assertEqual(securities.iloc[1]["SECID"], "GAZP")
    
    @patch("requests.Session.get")
    def test_connection_error(self, mock_get):
        """Test handling of connection errors."""
        # Setup mock to raise a connection error
        mock_get.side_effect = requests.exceptions.ConnectionError("Connection refused")
        
        # Verify exception is caught and re-raised as MoexConnectionError
        with self.assertRaises(MoexConnectionError) as context:
            self.client.get_engines()
        
        # Verify error message
        self.assertIn("Failed to connect", str(context.exception))
    
    @patch("requests.Session.get")
    def test_http_error(self, mock_get):
        """Test handling of HTTP errors."""
        # Setup mock to return a 404 error
        mock_get.return_value = MockResponse(404, {"error": "Not found"})
        
        # Verify exception is caught and re-raised as MoexResponseError
        with self.assertRaises(MoexResponseError) as context:
            self.client.get_engines()
        
        # Verify error message and status code
        self.assertEqual(context.exception.status_code, 404)
        self.assertIn("API returned error response", str(context.exception))
    
    @patch("requests.Session.get")
    def test_auth_error(self, mock_get):
        """Test handling of authentication errors."""
        # Setup mock to return a 401 error
        mock_get.return_value = MockResponse(401, {"error": "Unauthorized"})
        
        # Verify exception is caught and re-raised as MoexAuthError
        with self.assertRaises(MoexAuthError) as context:
            self.client.get_engines()
        
        # Verify error message and status code
        self.assertEqual(context.exception.status_code, 401)
        self.assertIn("Authentication failed", str(context.exception))
    
    @patch("requests.Session.get")
    def test_rate_limit_error(self, mock_get):
        """Test handling of rate limit errors."""
        # Setup mock to return a 429 error
        mock_get.return_value = MockResponse(
            429, 
            {"error": "Too many requests"}, 
            headers={"Retry-After": "60"}
        )
        
        # Verify exception is caught and re-raised as MoexRateLimitError
        with self.assertRaises(MoexRateLimitError) as context:
            self.client.get_engines()
        
        # Verify error message, status code, and retry_after value
        self.assertEqual(context.exception.status_code, 429)
        self.assertIn("Rate limit exceeded", str(context.exception))
        self.assertEqual(context.exception.retry_after, 60)
    
    @patch("requests.Session.get")
    def test_invalid_json(self, mock_get):
        """Test handling of invalid JSON responses."""
        # Setup mock to return an invalid JSON response
        mock_get.return_value = MockResponse(200, "This is not JSON")
        
        # Verify exception is caught and re-raised as MoexParsingError
        with self.assertRaises(MoexParsingError) as context:
            self.client.get_engines()
        
        # Verify error message
        self.assertIn("Failed to parse JSON", str(context.exception))
    
    @patch("time.sleep")
    @patch("time.time")
    @patch("requests.Session.get")
    def test_rate_limiting(self, mock_get, mock_time, mock_sleep):
        """Test that rate limiting is applied between requests."""
        # Setup mocks
        mock_get.return_value = MockResponse(200, self.engines_response)
        mock_time.side_effect = [0, 0.1]  # First call returns 0, second 0.1
        
        # Set a rate limit of 0.5 seconds
        self.client.rate_limit = 0.5
        
        # Make request
        self.client.get_engines()
        
        # Verify sleep was called
        mock_sleep.assert_called_once()
        sleep_time = mock_sleep.call_args[0][0]
        self.assertAlmostEqual(sleep_time, 0.4, places=1)  # Should sleep for 0.5 - 0.1 = 0.4s


if __name__ == "__main__":
    unittest.main()
