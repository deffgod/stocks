import pandas as pd
from io import StringIO
import matplotlib.pyplot as plt

# Sample of boards data
boards_data = """
id,board_group_id,engine_id,market_id,boardid,board_title,is_traded,has_candles,is_primary
177,57,1,1,TQIF,Т+: Паи - безадрес.,1,1,1
178,57,1,1,TQTF,Т+: ETF - безадрес.,1,1,1
129,57,1,1,TQBR,Т+: Акции и ДР - безадрес.,1,1,1
130,57,1,1,TQBS,Т+: А2-Акции и паи - безадрес.,0,1,1
131,57,1,1,TQNL,Т+: Б-Акции и паи - безадрес.,0,1,1
132,57,1,1,TQLV,Т+: В-Акции и ДР - безадрес.,0,1,1
225,156,1,1,TQTD,Т+: ETF (USD) - безадрес.,1,1,0
429,156,1,1,TQFD,Т+: ПАИ (USD) - безадрес.,1,1,0
313,157,1,1,TQBE,Т+: Акции и ДР (EUR) - безадрес.,0,1,0
314,157,1,1,TQTE,Т+: ETF (EUR) - безадрес.,1,1,0
1216,1215,1,1,TQTY,Т+: ПАИ (CNY) - безадрес.,1,1,0
1239,1238,1,1,TQTH,Т+: ПАИ (HKD) - безадрес.,1,1,0
135,58,1,2,TQOB,Т+: Гособлигации - безадрес.,1,1,1
349,58,1,2,TQCB,Т+: Облигации - безадрес.,1,1,1
361,58,1,2,TQRD,Т+: Облигации Д - безадрес.,1,1,1
226,193,1,2,TQOD,Т+: Облигации (USD) - безадрес.,1,1,0
363,193,1,2,TQUD,Т+: Облигации Д (USD) - безадрес.,1,1,0
357,207,1,2,TQOE,Т+: Облигации (EUR) - безадрес.,1,1,0
1101,245,1,2,TQOY,Т+: Облигации (CNY) - безадрес.,1,1,0
142,59,1,4,PTEQ,РПС с ЦК: Акции и ДР - адрес.,1,0,0
148,282,1,4,PTOB,РПС с ЦК: Облигации - адрес.,1,0,0
232,283,1,4,PTOD,РПС с ЦК: Облигации (USD) - адрес.,1,0,0
359,209,1,4,PTOE,РПС с ЦК: Облигации (EUR) - адрес.,1,0,0
1151,249,1,4,PTOY,РПС с ЦК: Облигации (CNY) - адрес.,1,0,0
11,8,1,4,PSEQ,РПС: Акции - адрес.,1,0,1
17,284,1,4,PSOB,РПС: Облигации - адрес.,1,0,0
30,285,1,4,PSEU,РПС: Облигации (USD) - адрес.,1,0,0
160,286,1,4,PSEO,РПС: Облигации (EUR) - адрес.,1,0,0
236,247,1,4,PSYO,РПС: Облигации (CNY) - адрес.,1,0,0
98,107,1,4,PSAU,Размещение - адрес.,1,0,0
120,108,1,4,PSBB,Выкуп - адрес.,1,0,0
282,126,1,4,OTCB,Анонимный РПС - адрес.,1,0,0
44,9,1,5,SNDX,Индексы фондового рынка,1,1,1
102,9,1,5,RTSI,Индексы РТС,1,1,1
265,104,1,5,INAV,INAV,1,1,0
312,155,1,5,MMIX,Money Market IndeX,1,1,0
1029,1028,1,5,AGRO,Индексы НТБ,1,1,0
123,50,1,27,EQRP,РЕПО с ЦК 1 день - безадрес.,1,1,1
239,92,1,27,EQRD,РЕПО с ЦК 1 день (USD) - безадрес.,1,1,0
240,93,1,27,EQRE,РЕПО с ЦК 1 день (EUR) - безадрес.,1,1,0
309,152,1,27,EQRY,РЕПО с ЦК 1 день (CNY) - безадрес.,1,1,0
125,65,1,27,PSRP,РЕПО с ЦК - адрес.,1,1,0
21,13,3,10,CETS,Системные сделки - безадрес.,1,1,1
351,13,3,10,SDBP,Крупные сделки - безадрес.,1,1,1
261,100,3,10,FIXS,Фиксинг системный - безадрес.,1,1,0
116,46,3,10,CNGD,Внесистемные сделки- адрес.,1,1,0
308,151,3,10,LICU,Внесистемные сделки урегулирования - безадрес.,1,1,0
262,101,3,10,FIXN,Фиксинг внесистемный- адрес.,1,1,0
182,70,3,10,AUCB,Аукцион ЦБР - адрес.,1,1,0
256,88,3,34,FUTS,Фьючерсы системные - безадрес.,0,1,1
257,89,3,34,FUTN,Фьючерсы внесистемные- адрес.,0,1,0
321,165,3,41,FIXI,Валютный фиксинг,1,1,1
101,45,4,22,RFUD,Фьючерсы,1,1,1
103,35,4,24,ROPD,Опционы,1,1,1
1333,1332,1326,1328,RPFC,РЕПО с ФК: закрытая форма,1,0,1
1334,1332,1326,1328,RPFO,РЕПО с ФК: открытая форма,1,0,1
1330,1329,1326,1327,DPFK,Депозиты ФК, закрытая форма,1,0,1
1331,1329,1326,1327,DPFO,Депозиты ФК, открытая форма,1,0,1
"""

# Create DataFrame
boards_df = pd.read_csv(StringIO(boards_data.strip()), sep=",")

# Analyze by engine
engine_counts = boards_df['engine_id'].value_counts().reset_index()
engine_counts.columns = ['engine_id', 'board_count']

# Analyze by market
market_counts = boards_df['market_id'].value_counts().reset_index()
market_counts.columns = ['market_id', 'board_count']

# Analyze trading mode prefixes
# Extract prefixes (first 2 characters of boardid)
boards_df['prefix'] = boards_df['boardid'].str[:2]
prefix_counts = boards_df['prefix'].value_counts().reset_index()
prefix_counts.columns = ['prefix', 'count']

# Analyze active boards
active_counts = boards_df['is_traded'].value_counts().reset_index()
active_counts.columns = ['is_traded', 'count']
active_percent = active_counts['count'][1] / boards_df.shape[0] * 100

# Analyze primary boards
primary_counts = boards_df['is_primary'].value_counts().reset_index()
primary_counts.columns = ['is_primary', 'count']
primary_percent = primary_counts['count'][1] / boards_df.shape[0] * 100

# Analyze candles availability
candles_counts = boards_df['has_candles'].value_counts().reset_index()
candles_counts.columns = ['has_candles', 'count']
candles_percent = candles_counts['count'][1] / boards_df.shape[0] * 100

# Parse currency information from board titles
def extract_currency(title):
    if '(USD)' in title:
        return 'USD'
    elif '(EUR)' in title:
        return 'EUR'
    elif '(CNY)' in title:
        return 'CNY'
    elif '(HKD)' in title:
        return 'HKD'
    elif '(GBP)' in title:
        return 'GBP'
    else:
        return 'RUB'

boards_df['currency'] = boards_df['board_title'].apply(extract_currency)
currency_counts = boards_df['currency'].value_counts().reset_index()
currency_counts.columns = ['currency', 'count']

# Display stats
print("MOEX Board Analysis")
print("=" * 80)
print(f"Total Boards: {boards_df.shape[0]}")
print(f"Active Boards: {active_counts['count'][1]} ({active_percent:.1f}%)")
print(f"Primary Boards: {primary_counts['count'][1]} ({primary_percent:.1f}%)")
print(f"Boards with Candles: {candles_counts['count'][1]} ({candles_percent:.1f}%)")

print("\nBoards by Trading Engine:")
for i, row in engine_counts.iterrows():
    print(f"  Engine {row['engine_id']}: {row['board_count']} boards")

print("\nBoards by Market (Top 10):")
for i, row in market_counts.head(10).iterrows():
    print(f"  Market {row['market_id']}: {row['board_count']} boards")

print("\nBoards by Prefix (Top 10):")
for i, row in prefix_counts.head(10).iterrows():
    print(f"  {row['prefix']}: {row['count']} boards")

print("\nBoards by Currency:")
for i, row in currency_counts.iterrows():
    print(f"  {row['currency']}: {row['count']} boards")

# Function to categorize boards by their type
def categorize_board(title):
    title = title.lower()
    if 'т+:' in title:
        return 'T+'
    elif 'т0:' in title:
        return 'T0'
    elif 'репо' in title:
        return 'REPO'
    elif 'рпс' in title:
        return 'Negotiated'
    elif 'аукцион' in title:
        return 'Auction'
    elif 'индекс' in title:
        return 'Index'
    elif 'фиксинг' in title:
        return 'Fixing'
    else:
        return 'Other'

boards_df['category'] = boards_df['board_title'].apply(categorize_board)
category_counts = boards_df['category'].value_counts().reset_index()
category_counts.columns = ['category', 'count']

print("\nBoards by Category:")
for i, row in category_counts.iterrows():
    print(f"  {row['category']}: {row['count']} boards")

# Create CSV file
boards_df.to_csv('moex_boards_analysis.csv', index=False)
print("\nCSV file 'moex_boards_analysis.csv' created successfully.")
