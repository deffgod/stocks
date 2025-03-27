import pandas as pd
from io import StringIO

# Security collections data
security_collections_data = """
id,name,title,security_group_id
72,stock_index_all,Все индексы,12
213,stock_index_shares,Основные индексы акций,12
210,stock_index_shares_sectoral,Отраслевые индексы акций,12
249,stock_index_total_return,Индексы акций полной доходности,12
211,stock_index_shares_thematic,Тематические индексы акций,12
207,stock_index_bonds,Основные индексы облигаций,12
214,stock_index_bonds_state,Индексы государственных облигаций,12
208,stock_index_bonds_corporate,Индексы корпоративных облигаций,12
212,stock_index_bonds_municipal,Индексы муниципальных облигаций,12
209,stock_index_bonds_retiring,Индексы активов пенсионных накоплений,12
328,stock_index_eurobonds,Индексы еврооблигаций,12
215,stock_index_volatility,Российские индексы волатильности,12
259,stock_index_inav,INAV,12
3,stock_shares_all,Все акции,4
160,stock_shares_one,Уровень 1,4
161,stock_shares_two,Уровень 2,4
162,stock_shares_three,Уровень 3,4
7,stock_bonds_all,Все,3
163,stock_bonds_one,Все уровень 1,3
164,stock_bonds_two,Все уровень 2,3
165,stock_bonds_three,Все уровень 3,3
189,stock_bonds_corp_all,Все корпоративные,3
202,stock_bonds_corp_one,Корпоративные уровень 1,3
194,stock_bonds_corp_two,Корпоративные уровень 2,3
188,stock_bonds_corp_three,Корпоративные уровень 3,3
200,stock_bonds_exchange_all,Все биржевые,3
185,stock_exchange_corp_one,Биржевые уровень 1,3
186,stock_bonds_ofz_all,Все ОФЗ,3
193,stock_bonds_cb_all,Все Банка России,3
177,currency_selt_all_spot,Все валюты СПОТ,9
170,currency_selt_all_swap,Все валюты СВОП,9
173,currency_selt_usd_spot,USD/RUB СПОТ,9
174,currency_selt_usd_swap,USD/RUB СВОП,9
172,currency_selt_eur_spot,EUR/RUB СПОТ,9
179,currency_selt_eur_swap,EUR/RUB СВОП,9
181,currency_selt_cny_spot,CNY/RUB СПОТ,9
176,currency_selt_cny_swap,CNY/RUB СВОП,9
227,futures_forts_all,Все фьючерсы,10
226,futures_forts_index,Фьючерсы на индексы,10
224,futures_forts_shares,Фьючерсы на акции,10
225,futures_forts_currency,Фьючерсы на валюты,10
228,futures_forts_interest,Фьючерсы на процентные ставки,10
223,futures_forts_commodity,Фьючерсы на товарные контракты,10
218,futures_options_all,Все опционы,26
222,futures_options_index,Опционы ф. на индекс,26
221,futures_options_shares,Опционы ф. на акции,26
220,futures_options_currency,Опционы ф. на валюты,26
219,futures_options_commodity,Опционы ф. на товарные контракты,26
"""

# Create DataFrame
security_collections_df = pd.read_csv(StringIO(security_collections_data.strip()), sep=",")

# Display the table
print("MOEX Security Collections")
print("=" * 80)
print(security_collections_df.to_string(index=False))

# Group by security group for better readability
grouped_collections = security_collections_df.groupby('security_group_id')

group_names = {
    12: "Indices",
    4: "Stocks",
    3: "Bonds",
    9: "Currencies",
    10: "Futures",
    26: "Options"
}

print("\n\nSecurity Collections by Group")
print("=" * 80)
for group_id, group_data in grouped_collections:
    group_name = group_names.get(group_id, f"Group {group_id}")
    print(f"\n--- {group_name} ---")
    print(group_data[['id', 'name', 'title']].to_string(index=False))

# Create CSV file
security_collections_df.to_csv('moex_security_collections.csv', index=False)
print("\nCSV file 'moex_security_collections.csv' created successfully.")
