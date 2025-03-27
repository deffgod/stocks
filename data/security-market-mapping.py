import pandas as pd
import numpy as np
from io import StringIO

# Create a mapping of security types to markets based on the XML data
# This is a structured representation of which security types are available on each market

# Define market categories (simplified list based on the XML)
markets_data = """
id,name,title,engine_id,engine_name
1,shares,Рынок акций,1,stock
2,bonds,Рынок облигаций,1,stock
3,repo,Рынок сделок РЕПО,1,stock
4,ndm,Режим переговорных сделок,1,stock
5,index,Индексы фондового рынка,1,stock
10,selt,Биржевые сделки с ЦК,3,currency
12,main,Срочные инструменты,4,futures
22,forts,ФОРТС,4,futures
24,options,Опционы ФОРТС,4,futures
27,ccp,РЕПО с ЦК,1,stock
35,deposit,Депозиты с ЦК,1,stock
46,gcc,РЕПО с ЦК с КСУ,1,stock
47,foreignshares,Иностранные ц.б.,1,stock
1013,bonds,Облигации,1012,otc
1257,shares,Акции,1012,otc
"""

# Define security types (simplified list based on the XML)
security_types_data = """
id,name,title,group_id,group_name
3,common_share,Акция обыкновенная,4,stock_shares
1,preferred_share,Акция привилегированная,4,stock_shares
51,depositary_receipt,Депозитарная расписка,18,stock_dr
54,ofz_bond,Государственная облигация,3,stock_bonds
2,corporate_bond,Корпоративная облигация,3,stock_bonds
43,exchange_bond,Биржевая облигация,3,stock_bonds
60,euro_bond,Еврооблигации,6,stock_eurobond
7,public_ppif,Пай открытого ПИФа,5,stock_ppif
55,etf_ppif,ETF,20,stock_etf
44,stock_index,Индекс фондового рынка,12,stock_index
5,currency,Валюта,9,currency_selt
58,gold_metal,Металл золото,24,currency_metal
59,silver_metal,Металл серебро,24,currency_metal
6,futures,Фьючерс,10,futures_forts
52,option,Опцион,26,futures_options
63,stock_deposit,Депозит с ЦК,29,stock_deposit
"""

# Create DataFrames
markets_df = pd.read_csv(StringIO(markets_data.strip()), sep=",")
security_types_df = pd.read_csv(StringIO(security_types_data.strip()), sep=",")

# Define mapping of security types to markets based on XML analysis
# This would normally be extracted from the XML but we're defining it manually for clarity
# Format: (security_type_id, market_id, is_primary)
mappings = [
    # Stock market - shares
    (3, 1, True),    # Common shares on shares market
    (1, 1, True),    # Preferred shares on shares market
    (51, 1, True),   # DRs on shares market
    
    # Stock market - bonds
    (54, 2, True),   # Government bonds on bonds market
    (2, 2, True),    # Corporate bonds on bonds market
    (43, 2, True),   # Exchange bonds on bonds market
    
    # Stock market - foreign shares
    (3, 47, True),   # Common shares on foreign shares market
    (51, 47, True),  # DRs on foreign shares market
    
    # Stock market - indexes
    (44, 5, True),   # Stock indexes on index market
    
    # Stock market - funds
    (7, 1, False),   # Mutual funds on shares market
    (55, 1, False),  # ETFs on shares market
    
    # Currency market
    (5, 10, True),   # Currency on SELT market
    (58, 10, False), # Gold on SELT market
    (59, 10, False), # Silver on SELT market
    
    # Futures market
    (6, 22, True),   # Futures on FORTS market
    
    # Options market
    (52, 24, True),  # Options on options market
    
    # Deposit market
    (63, 35, True),  # Deposits with CCP on deposit market
    
    # REPO markets
    (3, 3, False),   # Common shares on REPO market
    (2, 3, False),   # Corporate bonds on REPO market
    (3, 27, False),  # Common shares on CCP REPO market
    (2, 27, False),  # Corporate bonds on CCP REPO market
    (2, 46, False),  # Corporate bonds on CCP REPO with GCC market
    
    # OTC markets
    (2, 1013, True), # Corporate bonds on OTC bonds market
    (3, 1257, True)  # Common shares on OTC shares market
]

# Create a DataFrame from the mappings
mappings_df = pd.DataFrame(mappings, columns=['security_type_id', 'market_id', 'is_primary'])

# Merge with security types to get names
mappings_df = pd.merge(
    mappings_df, 
    security_types_df[['id', 'name', 'title', 'group_name']], 
    left_on='security_type_id', 
    right_on='id'
)

# Merge with markets to get market names
mappings_df = pd.merge(
    mappings_df,
    markets_df[['id', 'name', 'title', 'engine_id', 'engine_name']],
    left_on='market_id',
    right_on='id',
    suffixes=('_security', '_market')
)

# Rename columns for clarity
mappings_df = mappings_df.rename(columns={
    'name_security': 'security_type_name',
    'title_security': 'security_type_title',
    'name_market': 'market_name',
    'title_market': 'market_title'
})

# Select relevant columns
result_df = mappings_df[[
    'security_type_id', 'security_type_name', 'security_type_title', 'group_name',
    'market_id', 'market_name', 'market_title', 'engine_name', 'is_primary'
]]

# Sort by security type and market
result_df = result_df.sort_values(['group_name', 'security_type_id', 'market_id'])

# Display the mappings
print("Security Type to Market Mappings")
print("=" * 100)
print(result_df.to_string(index=False))

# Create a pivot table to visualize which security types are available on which markets
pivot_df = pd.pivot_table(
    result_df,
    values='is_primary',
    index=['group_name', 'security_type_name', 'security_type_title'],
    columns=['engine_name', 'market_name', 'market_title'],
    aggfunc=lambda x: '✓ Primary' if True in x else '○ Secondary' if x.any() else '',
    fill_value=''
)

# Display the pivot table
print("\n\nSecurity Types Availability by Market")
print("=" * 100)
print(pivot_df)

# Export to CSV
result_df.to_csv('moex_security_market_mappings.csv', index=False)
print("\nCSV file 'moex_security_market_mappings.csv' created successfully.")
