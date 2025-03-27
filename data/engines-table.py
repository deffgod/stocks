import pandas as pd
import re
import xml.etree.ElementTree as ET
from io import StringIO

# Sample data for engines
engines_data = """
id,name,title
1,stock,Фондовый рынок и рынок депозитов
2,state,Рынок ГЦБ (размещение)
3,currency,Валютный рынок
4,futures,Срочный рынок
5,commodity,Товарный рынок
6,interventions,Товарные интервенции
7,offboard,ОТС-система
9,agro,Агро
1012,otc,ОТС с ЦК
1282,quotes,Квоты
1326,money,Денежный рынок
"""

# Create DataFrame
engines_df = pd.read_csv(StringIO(engines_data.strip()), sep=",")

# Display the table
print("MOEX Trading Engines")
print("=" * 80)
print(engines_df.to_string(index=False))

# Create CSV file
engines_df.to_csv('moex_engines.csv', index=False)
print("\nCSV file 'moex_engines.csv' created successfully.")
