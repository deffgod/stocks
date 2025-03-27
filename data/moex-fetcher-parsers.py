"""
Response parsers for the MOEX API client.

This module provides utilities for parsing and transforming API responses
into useful data structures. It handles the specific format of MOEX ISS API
responses, which typically contain multiple data blocks.
"""

import datetime
from typing import Dict, List, Optional, Union, Any

import pandas as pd

from .exceptions import MoexParsingError


def parse_json_response(response_data: Dict[str, Any]) -> Dict[str, List[Dict[str, Any]]]:
    """
    Parses a JSON response from the MOEX ISS API.
    
    The MOEX ISS API returns data in a specific format with multiple data blocks. 
    Each block has 'columns' defining field names and 'data' containing row values.
    This function transforms that structure into a more usable dictionary of lists.
    
    Args:
        response_data: The JSON response from the API.
    
    Returns:
        A dictionary where keys are block names and values are lists of dictionaries,
        with each dictionary representing a row of data.
    
    Raises:
        MoexParsingError: If the response structure is invalid or cannot be parsed.
    """
    try:
        result = {}
        
        for block_name, block_content in response_data.items():
            # Skip metadata blocks and empty blocks
            if not isinstance(block_content, dict) or 'columns' not in block_content or 'data' not in block_content:
                continue
            
            columns = block_content['columns']
            data = block_content['data']
            
            # Transform rows into dictionaries
            rows = []
            for row in data:
                if len(row) != len(columns):
                    raise MoexParsingError(
                        f"Column count mismatch in block '{block_name}': "
                        f"{len(columns)} columns defined but row has {len(row)} values"
                    )
                
                row_dict = dict(zip(columns, row))
                rows.append(row_dict)
            
            result[block_name] = rows
        
        return result
    
    except (KeyError, TypeError) as e:
        raise MoexParsingError("Failed to parse API response", data=response_data, original_error=e)


def response_to_dataframe(
    parsed_response: Union[Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]]],
    block_name: Optional[str] = None
) -> Union[pd.DataFrame, Dict[str, pd.DataFrame]]:
    """
    Converts a parsed API response into pandas DataFrame(s).
    
    Args:
        parsed_response: Either a dictionary of data blocks or a single data block (list of dictionaries).
        block_name: Name of the specific block to convert (if multiple blocks are present).
    
    Returns:
        Either a single DataFrame if block_name is specified or a dictionary of DataFrames
        where keys are block names.
    
    Raises:
        MoexParsingError: If the specified block_name is not found or the data cannot be converted.
    """
    try:
        # If input is already a list of dictionaries (single block), convert directly
        if isinstance(parsed_response, list):
            return pd.DataFrame(parsed_response)
        
        # If block_name is specified, return only that block as DataFrame
        if block_name is not None:
            if block_name not in parsed_response:
                raise MoexParsingError(f"Block '{block_name}' not found in response")
            return pd.DataFrame(parsed_response[block_name])
        
        # Otherwise, convert all blocks to DataFrames
        result = {}
        for name, data in parsed_response.items():
            if data:  # Skip empty blocks
                result[name] = pd.DataFrame(data)
        
        return result
    
    except Exception as e:
        raise MoexParsingError("Failed to convert response to DataFrame", original_error=e)


def normalize_dataframe(
    df: pd.DataFrame,
    date_columns: Optional[List[str]] = None,
    numeric_columns: Optional[List[str]] = None,
    categorical_columns: Optional[List[str]] = None,
    index_column: Optional[str] = None
) -> pd.DataFrame:
    """
    Normalizes a DataFrame by converting columns to appropriate data types.
    
    Args:
        df: The DataFrame to normalize.
        date_columns: List of column names to convert to datetime.
        numeric_columns: List of column names to convert to numeric.
        categorical_columns: List of column names to convert to categorical.
        index_column: Column to set as the DataFrame index.
    
    Returns:
        The normalized DataFrame.
    """
    df_copy = df.copy()
    
    # Convert date columns
    if date_columns:
        for col in date_columns:
            if col in df_copy.columns:
                df_copy[col] = pd.to_datetime(df_copy[col], errors='coerce')
    
    # Convert numeric columns
    if numeric_columns:
        for col in numeric_columns:
            if col in df_copy.columns:
                df_copy[col] = pd.to_numeric(df_copy[col], errors='coerce')
    
    # Convert categorical columns
    if categorical_columns:
        for col in categorical_columns:
            if col in df_copy.columns:
                df_copy[col] = df_copy[col].astype('category')
    
    # Set index
    if index_column and index_column in df_copy.columns:
        df_copy.set_index(index_column, inplace=True)
    
    return df_copy


def detect_and_convert_types(df: pd.DataFrame) -> pd.DataFrame:
    """
    Automatically detects and converts DataFrame columns to appropriate types.
    
    This function attempts to intelligently convert columns based on their content:
    - Date columns (with strings like 'YYYY-MM-DD')
    - Numeric columns (integers and floats)
    - Boolean columns (with 1/0 values)
    
    Args:
        df: The DataFrame to process.
    
    Returns:
        A new DataFrame with converted data types.
    """
    df_copy = df.copy()
    
    # First pass: identify column types
    date_columns = []
    numeric_columns = []
    boolean_columns = []
    
    for column in df_copy.columns:
        # Skip columns that are already non-object types
        if df_copy[column].dtype != 'object':
            continue
        
        # Check for date columns
        if df_copy[column].str.match(r'^\d{4}-\d{2}-\d{2}$').all(skipna=True):
            date_columns.append(column)
            continue
        
        # Check for numeric columns
        if pd.to_numeric(df_copy[column], errors='coerce').notna().all():
            numeric_columns.append(column)
            continue
        
        # Check for boolean columns (1/0)
        if df_copy[column].isin(['0', '1', 0, 1]).all(skipna=True):
            boolean_columns.append(column)
            continue
    
    # Convert date columns
    for col in date_columns:
        df_copy[col] = pd.to_datetime(df_copy[col])
    
    # Convert numeric columns
    for col in numeric_columns:
        df_copy[col] = pd.to_numeric(df_copy[col])
    
    # Convert boolean columns
    for col in boolean_columns:
        df_copy[col] = df_copy[col].isin(['1', 1, True])
    
    return df_copy
