"""
Custom exceptions for the MOEX Fetcher.

This module defines a hierarchy of exceptions that provide meaningful error information
for different failure scenarios when interacting with the MOEX ISS API.
"""

class MoexApiError(Exception):
    """Base exception for all MOEX API errors."""
    
    def __init__(self, message=None, status_code=None, response=None):
        self.message = message or "An error occurred with the MOEX API request"
        self.status_code = status_code
        self.response = response
        super().__init__(self.message)
        
    def __str__(self):
        if self.status_code:
            return f"{self.message} (Status code: {self.status_code})"
        return self.message


class MoexConnectionError(MoexApiError):
    """Raised when a connection to the MOEX API cannot be established."""
    
    def __init__(self, message=None, original_error=None):
        message = message or "Failed to connect to MOEX API"
        self.original_error = original_error
        super().__init__(message)
        
    def __str__(self):
        if self.original_error:
            return f"{self.message}: {str(self.original_error)}"
        return self.message


class MoexResponseError(MoexApiError):
    """Raised when the MOEX API returns an invalid or unexpected response."""
    
    def __init__(self, message=None, status_code=None, response=None):
        message = message or "Received an invalid response from MOEX API"
        super().__init__(message, status_code, response)


class MoexAuthError(MoexApiError):
    """Raised when there is an authentication issue with the MOEX API."""
    
    def __init__(self, message=None, status_code=None, response=None):
        message = message or "Authentication with MOEX API failed"
        super().__init__(message, status_code, response)


class MoexRateLimitError(MoexApiError):
    """Raised when API rate limits are exceeded."""
    
    def __init__(self, message=None, status_code=None, response=None, retry_after=None):
        message = message or "MOEX API rate limit exceeded"
        self.retry_after = retry_after
        super().__init__(message, status_code, response)
        
    def __str__(self):
        if self.retry_after:
            return f"{self.message} (Retry after: {self.retry_after} seconds)"
        return super().__str__()


class MoexParsingError(MoexApiError):
    """Raised when there is an error parsing the API response."""
    
    def __init__(self, message=None, data=None, original_error=None):
        message = message or "Failed to parse MOEX API response"
        self.data = data
        self.original_error = original_error
        super().__init__(message)
        
    def __str__(self):
        if self.original_error:
            return f"{self.message}: {str(self.original_error)}"
        return self.message
