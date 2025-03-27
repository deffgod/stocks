import pandas as pd
from io import StringIO

# Security types data
security_types_data = """
id,trade_engine_id,trade_engine_name,security_type_name,security_type_title,security_group_name
3,1,stock,common_share,Акция обыкновенная,stock_shares
1,1,stock,preferred_share,Акция привилегированная,stock_shares
51,1,stock,depositary_receipt,Депозитарная расписка,stock_dr
54,1,stock,ofz_bond,Государственная облигация,stock_bonds
4,1,stock,cb_bond,Облигация центрального банка,stock_bonds
41,1,stock,subfederal_bond,Региональная облигация,stock_bonds
45,1,stock,municipal_bond,Муниципальная облигация,stock_bonds
2,1,stock,corporate_bond,Корпоративная облигация,stock_bonds
43,1,stock,exchange_bond,Биржевая облигация,stock_bonds
42,1,stock,ifi_bond,Облигация МФО,stock_bonds
60,1,stock,euro_bond,Еврооблигации,stock_eurobond
7,1,stock,public_ppif,Пай открытого ПИФа,stock_ppif
8,1,stock,interval_ppif,Пай интервального ПИФа,stock_ppif
9,1,stock,private_ppif,Пай закрытого ПИФа,stock_ppif
74,1,stock,exchange_ppif,Пай биржевого ПИФа,stock_ppif
55,1,stock,etf_ppif,ETF,stock_etf
44,1,stock,stock_index,Индекс фондового рынка,stock_index
53,1,stock,rts_index,Индекс РТС,stock_index
63,1,stock,stock_deposit,Депозит с ЦК,stock_deposit
5,3,currency,currency,Валюта,currency_selt
58,3,currency,gold_metal,Металл золото,currency_metal
59,3,currency,silver_metal,Металл серебро,currency_metal
73,3,currency,currency_fixing,Валютный фиксинг,currency_selt
75,3,currency,currency_index,Валютный фиксинг,currency_indices
6,4,futures,futures,Фьючерс,futures_forts
52,4,futures,option,Опцион,futures_options
1031,4,futures,option_on_shares,Опцион на акции,futures_options
1291,4,futures,option_on_currency,Опцион на валюту,futures_options
1293,4,futures,option_on_indices,Опцион на индексы,futures_options
1295,4,futures,option_on_commodities,Опцион на товары,futures_options
"""

# Create DataFrame for security types
security_types_df = pd.read_csv(StringIO(security_types_data.strip()), sep=",")

# Security groups data
security_groups_data = """
id,name,title,is_hidden
12,stock_index,Индексы,0
4,stock_shares,Акции,0
3,stock_bonds,Облигации,0
9,currency_selt,Валюта,0
10,futures_forts,Фьючерсы,0
26,futures_options,Опционы,0
18,stock_dr,Депозитарные расписки,0
33,stock_foreign_shares,Иностранные ц.б.,0
6,stock_eurobond,Еврооблигации,0
5,stock_ppif,Паи ПИФов,0
20,stock_etf,Биржевые фонды,0
24,currency_metal,Драгоценные металлы,0
21,stock_qnv,Квал. инвесторы,0
27,stock_gcc,Клиринговые сертификаты участия,0
29,stock_deposit,Депозиты с ЦК,0
28,currency_futures,Валютный фьючерс,0
31,currency_indices,Валютные фиксинги,0
"""

# Create DataFrame for security groups
security_groups_df = pd.read_csv(StringIO(security_groups_data.strip()), sep=",")

# Display security types table
print("MOEX Security Types")
print("=" * 100)
print(security_types_df.to_string(index=False))

# Display security groups table
print("\n\nMOEX Security Groups")
print("=" * 70)
print(security_groups_df.to_string(index=False))

# Create CSV files
security_types_df.to_csv('moex_security_types.csv', index=False)
security_groups_df.to_csv('moex_security_groups.csv', index=False)
print("\nCSV files 'moex_security_types.csv' and 'moex_security_groups.csv' created successfully.")
