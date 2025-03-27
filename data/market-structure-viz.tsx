import React, { useState } from 'react';

const MarketStructureViz = () => {
  const [expandedEngines, setExpandedEngines] = useState({});
  const [expandedMarkets, setExpandedMarkets] = useState({});

  // Market structure data
  const marketStructure = [
    {
      id: 1,
      name: 'stock',
      title: 'Фондовый рынок и рынок депозитов',
      markets: [
        {
          id: 1,
          name: 'shares',
          title: 'Рынок акций',
          boardGroups: [
            { id: 57, name: 'stock_shares_tplus', title: 'Т+: Основной режим - безадрес.', isDefault: true },
            { id: 156, name: 'stock_shares_tplus_usd', title: 'Т+: Основной режим (USD) - безадрес.', isDefault: false },
            { id: 157, name: 'stock_shares_tplus_eur', title: 'Т+: Основной режим (EUR) - безадрес.', isDefault: false }
          ]
        },
        {
          id: 2,
          name: 'bonds',
          title: 'Рынок облигаций',
          boardGroups: [
            { id: 58, name: 'stock_bonds_tplus', title: 'Т+: Основной режим - безадрес.', isDefault: true },
            { id: 193, name: 'stock_bonds_tplus_usd', title: 'Т+: Основной режим (USD) - безадрес.', isDefault: false }
          ]
        },
        {
          id: 5,
          name: 'index',
          title: 'Индексы фондового рынка',
          boardGroups: [
            { id: 9, name: 'stock_index', title: 'Индексы', isDefault: true }
          ]
        },
        {
          id: 47,
          name: 'foreignshares',
          title: 'Иностранные ц.б.',
          boardGroups: [
            { id: 265, name: 'stock_foreign_shares', title: 'Т+ Ин.Акции и ДР - безадрес.', isDefault: true }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'currency',
      title: 'Валютный рынок',
      markets: [
        {
          id: 10,
          name: 'selt',
          title: 'Биржевые сделки с ЦК',
          boardGroups: [
            { id: 13, name: 'currency', title: 'Системные сделки - безадрес.', isDefault: true }
          ]
        },
        {
          id: 41,
          name: 'index',
          title: 'Валютный фиксинг',
          boardGroups: [
            { id: 165, name: 'currency_index', title: 'Валютный фиксинг', isDefault: true }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'futures',
      title: 'Срочный рынок',
      markets: [
        {
          id: 22,
          name: 'forts',
          title: 'ФОРТС',
          boardGroups: [
            { id: 45, name: 'futures_forts', title: 'Фьючерсы', isDefault: true }
          ]
        },
        {
          id: 24,
          name: 'options',
          title: 'Опционы ФОРТС',
          boardGroups: [
            { id: 35, name: 'futures_options', title: 'Опционы', isDefault: true }
          ]
        }
      ]
    }
  ];

  const toggleEngine = (engineId) => {
    setExpandedEngines({
      ...expandedEngines,
      [engineId]: !expandedEngines[engineId]
    });
  };

  const toggleMarket = (marketId) => {
    setExpandedMarkets({
      ...expandedMarkets,
      [marketId]: !expandedMarkets[marketId]
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">MOEX Market Structure</h2>
      
      <div className="space-y-6">
        {marketStructure.map(engine => (
          <div key={engine.id} className="border rounded-lg overflow-hidden">
            <div 
              className="flex justify-between items-center bg-blue-100 p-3 cursor-pointer"
              onClick={() => toggleEngine(engine.id)}
            >
              <div className="font-semibold">
                <span className="text-blue-800">{engine.id}: {engine.name}</span> - {engine.title}
              </div>
              <div className="text-blue-600">
                {expandedEngines[engine.id] ? '▼' : '►'}
              </div>
            </div>
            
            {expandedEngines[engine.id] && (
              <div className="p-3 pl-8 space-y-4">
                {engine.markets.map(market => (
                  <div key={market.id} className="border rounded-lg">
                    <div 
                      className="flex justify-between items-center bg-blue-50 p-2 cursor-pointer"
                      onClick={() => toggleMarket(market.id)}
                    >
                      <div className="font-medium">
                        <span className="text-blue-700">{market.id}: {market.name}</span> - {market.title}
                      </div>
                      <div className="text-blue-500">
                        {expandedMarkets[market.id] ? '▼' : '►'}
                      </div>
                    </div>
                    
                    {expandedMarkets[market.id] && (
                      <div className="p-2 pl-6">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="p-2 text-left">ID</th>
                              <th className="p-2 text-left">Name</th>
                              <th className="p-2 text-left">Title</th>
                              <th className="p-2 text-center">Default</th>
                            </tr>
                          </thead>
                          <tbody>
                            {market.boardGroups.map(group => (
                              <tr key={group.id} className="border-t">
                                <td className="p-2">{group.id}</td>
                                <td className="p-2">{group.name}</td>
                                <td className="p-2">{group.title}</td>
                                <td className="p-2 text-center">
                                  {group.isDefault ? 
                                    <span className="inline-block w-4 h-4 bg-green-500 rounded-full"></span> : 
                                    <span className="inline-block w-4 h-4 bg-gray-300 rounded-full"></span>
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded border text-sm">
        <p className="font-medium mb-2">Interactive visualization of the MOEX market structure.</p>
        <p>Click on an engine or market to expand/collapse. This shows the hierarchical relationship between:</p>
        <ul className="list-disc ml-5 mt-2">
          <li>Trading engines (platforms)</li>
          <li>Markets (segments)</li>
          <li>Board groups (trading modes)</li>
        </ul>
      </div>
    </div>
  );
};

export default MarketStructureViz;
