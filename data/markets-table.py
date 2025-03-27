import pandas as pd
from io import StringIO

# Selected markets data (limited sample for brevity)
markets_data = """
id,trade_engine_id,trade_engine_name,market_name,market_title,marketplace,is_otc
1,1,stock,shares,Рынок акций,MXSE,0
2,1,stock,bonds,Рынок облигаций,MXSE,0
3,1,stock,repo,Рынок сделок РЕПО,,0
4,1,stock,ndm,Режим переговорных сделок,,0
5,1,stock,index,Индексы фондового рынка,INDICES,0
10,3,currency,selt,Биржевые сделки с ЦК,MXCX,0
12,4,futures,main,Срочные инструменты,,0
22,4,futures,forts,ФОРТС,FORTS,0
24,4,futures,options,Опционы ФОРТС,OPTIONS,0
27,1,stock,ccp,РЕПО с ЦК,MXSE,0
33,1,stock,moexboard,MOEX Board,,0
35,1,stock,deposit,Депозиты с ЦК,,0
36,1,stock,mamc,Мультивалютный рынок смешанных активов,,0
41,3,currency,index,Валютный фиксинг,FIXING,0
45,3,currency,otc,Внебиржевой,MXCX,0
46,1,stock,gcc,РЕПО с ЦК с КСУ,MXSE,0
47,1,stock,foreignshares,Иностранные ц.б.,MXSE,0
49,1,stock,foreignndm,Иностранные ц.б. РПС,,0
51,9,agro,sugar,Торги сахаром,,0
54,1,stock,credit,Рынок кредитов,,0
1013,1012,otc,bonds,Облигации,,1
1014,1012,otc,ndm,Облигации c ЦК,,1
1257,1012,otc,shares,Акции,,1
1262,1012,otc,sharesndm,Акции с ЦК,,1
1279,1282,quotes,bonds,Квоты облигации,,1
1327,1326,money,deposit,Депозиты ФК,MONEY,0
1328,1326,money,repo,РЕПО ФК,MONEY,0
1341,3,currency,otcindices,Внебиржевые индексы,INDICES,1
"""

# Create DataFrame
markets_df = pd.read_csv(StringIO(markets_data.strip()), sep=",")

# Display the table
print("MOEX Markets Structure")
print("=" * 80)
print(markets_df.to_string(index=False))

# Create CSV file
markets_df.to_csv('moex_markets.csv', index=False)
print("\nCSV file 'moex_markets.csv' created successfully.")
