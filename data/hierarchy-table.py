import pandas as pd
from io import StringIO

# Hierarchical relationship data
hierarchy_data = """
engine_id,engine_name,engine_title,market_id,market_name,market_title,board_group_id,board_group_name,board_group_title,is_default
1,stock,Фондовый рынок и рынок депозитов,1,shares,Рынок акций,57,stock_shares_tplus,Т+: Основной режим - безадрес.,1
1,stock,Фондовый рынок и рынок депозитов,1,shares,Рынок акций,156,stock_shares_tplus_usd,Т+: Основной режим (USD) - безадрес.,0
1,stock,Фондовый рынок и рынок депозитов,1,shares,Рынок акций,157,stock_shares_tplus_eur,Т+: Основной режим (EUR) - безадрес.,0
1,stock,Фондовый рынок и рынок депозитов,1,shares,Рынок акций,1215,stock_shares_tplus_cny,Т+: Основной режим (CNY) - безадрес.,0
1,stock,Фондовый рынок и рынок депозитов,2,bonds,Рынок облигаций,58,stock_bonds_tplus,Т+: Основной режим - безадрес.,1
1,stock,Фондовый рынок и рынок депозитов,2,bonds,Рынок облигаций,193,stock_bonds_tplus_usd,Т+: Основной режим (USD) - безадрес.,0
1,stock,Фондовый рынок и рынок депозитов,2,bonds,Рынок облигаций,207,stock_bonds_tplus_eur,Т+: Облигации (EUR) - безадрес.,0
1,stock,Фондовый рынок и рынок депозитов,2,bonds,Рынок облигаций,245,stock_bonds_tplus_cny,Т+: Облигации (CNY) - безадрес.,0
1,stock,Фондовый рынок и рынок депозитов,5,index,Индексы фондового рынка,9,stock_index,Индексы,1
3,currency,Валютный рынок,10,selt,Биржевые сделки с ЦК,13,currency,Системные сделки - безадрес.,1
3,currency,Валютный рынок,41,index,Валютный фиксинг,165,currency_index,Валютный фиксинг,1
3,currency,Валютный рынок,1341,otcindices,Внебиржевые индексы,1342,currency_otcindices_fixing,Внебиржевые индикаторы - фиксинги,1
4,futures,Срочный рынок,22,forts,ФОРТС,45,futures_forts,Фьючерсы,1
4,futures,Срочный рынок,24,options,Опционы ФОРТС,35,futures_options,Опционы,1
9,agro,Агро,51,sugar,Торги сахаром,271,agro_sugar_all,Агро: Сахар,1
1326,money,Денежный рынок,1327,deposit,Депозиты ФК,1329,money_deposit,Депозиты ФК, закрытая форма,1
1326,money,Денежный рынок,1328,repo,РЕПО ФК,1332,money_repo,РЕПО с ФК: закрытая форма,1
"""

# Create DataFrame
hierarchy_df = pd.read_csv(StringIO(hierarchy_data.strip()), sep=",")

# Display the table
print("MOEX Market Hierarchy")
print("=" * 100)
print(hierarchy_df.to_string(index=False))

# Create CSV file
hierarchy_df.to_csv('moex_hierarchy.csv', index=False)
print("\nCSV file 'moex_hierarchy.csv' created successfully.")
