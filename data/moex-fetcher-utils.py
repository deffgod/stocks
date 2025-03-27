"""
Utility functions for the MOEX API client.

This module provides helper functions for URL construction, parameter validation,
date formatting, and other common operations required for interacting with the
MOEX ISS API.
"""

import datetime
from typing import Dict, List, Optional, Union, Any
from urllib.parse import urljoin, urlencode


def build_url(base_url: str, endpoint: str, **path_params) -> str:
    """
    Constructs a URL by joining the base URL with the endpoint and replacing
    path parameters.
    
    Args:
        base_url: The base URL for the API.
        endpoint: The API endpoint (can contain placeholders like '[engine]').
        **path_params: Key-value pairs for replacing placeholders in the endpoint.
    
    Returns:
        A complete URL with path parameters replaced.
    
    Example:
        >>> build_url('https://iss.moex.com/iss', 
                      '/engines/[engine]/markets/[market]/securities',
                      engine='stock', market='shares')
        'https://iss.moex.com/iss/engines/stock/markets/shares/securities'
    """
    # Replace placeholders in the endpoint
    for key, value in path_params.items():
        placeholder = f"[{key}]"
        if placeholder in endpoint:
            endpoint = endpoint.replace(placeholder, str(value))
    
    # Join base URL with endpoint
    return urljoin(base_url, endpoint)


def format_date(date_value: Union[str, datetime.date, datetime.datetime]) -> str:
    """
    Formats a date object or string to the YYYY-MM-DD format required by the MOEX API.
    
    Args:
        date_value: A date object, datetime object, or string in a valid date format.
    
    Returns:
        A string in the format 'YYYY-MM-DD'.
    
    Raises:
        ValueError: If the date_value cannot be parsed.
    """
    if isinstance(date_value, str):
        try:
            # Try parsing as ISO format
            date_obj = datetime.datetime.fromisoformat(date_value)
        except ValueError:
            try:
                # Try common date formats
                for fmt in ('%Y-%m-%d', '%d.%m.%Y', '%m/%d/%Y', '%Y/%m/%d'):
                    try:
                        date_obj = datetime.datetime.strptime(date_value, fmt)
                        break
                    except ValueError:
                        continue
                else:
                    raise ValueError(f"Could not parse date: {date_value}")
            except Exception as e:
                raise ValueError(f"Invalid date format: {date_value}") from e
    elif isinstance(date_value, (datetime.date, datetime.datetime)):
        date_obj = date_value
    else:
        raise ValueError(f"Expected date string or date object, got {type(date_value).__name__}")
    
    return date_obj.strftime('%Y-%m-%d')


def validate_date_range(
    start_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
    end_date: Optional[Union[str, datetime.date, datetime.datetime]] = None,
    max_interval_days: Optional[int] = None
) -> tuple:
    """
    Validates and formats a date range for API requests.
    
    Args:
        start_date: The start date for the range.
        end_date: The end date for the range.
        max_interval_days: Maximum allowed interval in days between start_date and end_date.
    
    Returns:
        A tuple of (formatted_start_date, formatted_end_date).
    
    Raises:
        ValueError: If dates are invalid or the interval exceeds max_interval_days.
    """
    # Set default end_date to today if not provided
    if end_date is None:
        end_date = datetime.date.today()
    
    # Format dates
    formatted_end_date = format_date(end_date)
    
    # If start_date is not provided, set it to end_date
    if start_date is None:
        return (formatted_end_date, formatted_end_date)
    
    formatted_start_date = format_date(start_date)
    
    # Parse the formatted dates back to check the interval
    start_obj = datetime.datetime.strptime(formatted_start_date, '%Y-%m-%d').date()
    end_obj = datetime.datetime.strptime(formatted_end_date, '%Y-%m-%d').date()
    
    # Ensure start_date is not after end_date
    if start_obj > end_obj:
        raise ValueError(f"Start date ({formatted_start_date}) is after end date ({formatted_end_date})")
    
    # Check if interval exceeds max_interval_days
    if max_interval_days is not None:
        days_diff = (end_obj - start_obj).days
        if days_diff > max_interval_days:
            raise ValueError(
                f"Date range exceeds maximum interval of {max_interval_days} days. "
                f"Requested: {days_diff} days ({formatted_start_date} to {formatted_end_date})"
            )
    
    return (formatted_start_date, formatted_end_date)


def build_query_params(params: Dict[str, Any]) -> Dict[str, str]:
    """
    Builds query parameters for API requests, handling special cases like lists.
    
    Args:
        params: Dictionary of parameter names and values.
    
    Returns:
        Dictionary with all values converted to strings as required by the API.
    """
    result = {}
    
    for key, value in params.items():
        if value is None:
            continue
            
        if isinstance(value, list):
            # Convert list to comma-separated string
            result[key] = ','.join(str(item) for item in value)
        elif isinstance(value, bool):
            # Convert bool to integer
            result[key] = '1' if value else '0'
        else:
            # Convert other types to string
            result[key] = str(value)
    
    return result


def parse_iso_datetime(datetime_str: str) -> datetime.datetime:
    """
    Parses an ISO-formatted datetime string from the API response.
    
    Args:
        datetime_str: A string in ISO format (YYYY-MM-DDThh:mm:ss.sssZ).
    
    Returns:
        A datetime object.
    
    Raises:
        ValueError: If the string cannot be parsed.
    """
    try:
        # For full ISO format with microseconds and timezone
        return datetime.datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
    except ValueError:
        try:
            # For YYYY-MM-DDThh:mm:ss format
            if 'T' in datetime_str:
                date_part, time_part = datetime_str.split('T')
                time_part = time_part.split('.')[0]  # Remove microseconds if present
                datetime_str = f"{date_part}T{time_part}"
                return datetime.datetime.fromisoformat(datetime_str)
            # For YYYY-MM-DD format
            return datetime.datetime.fromisoformat(datetime_str)
        except ValueError as e:
            raise ValueError(f"Could not parse datetime: {datetime_str}") from e
