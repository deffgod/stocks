import React, { useState } from 'react';

// Tree node component
const TreeNode = ({ 
  node, 
  depth = 0, 
  expanded,
  onToggle, 
  selectedNode, 
  onSelect 
}) => {
  const isExpanded = expanded[node.id];
  const isSelected = selectedNode && selectedNode.id === node.id;
  const hasChildren = node.children && node.children.length > 0;
  
  // Generate indentation
  const indent = depth * 24;
  
  // Node colors based on type
  const getNodeColor = (nodeType) => {
    switch(nodeType) {
      case 'engine': return 'bg-blue-100 border-blue-300';
      case 'market': return 'bg-green-100 border-green-300';
      case 'boardGroup': return 'bg-yellow-100 border-yellow-300';
      case 'board': return 'bg-indigo-50 border-indigo-200';
      default: return 'bg-gray-100 border-gray-300';
    }
  };
  
  // Icon based on type
  const getNodeIcon = (nodeType) => {
    switch(nodeType) {
      case 'engine': return '🏛️';
      case 'market': return '🏪';
      case 'boardGroup': return '📋';
      case 'board': return '📝';
      default: return '📄';
    }
  };

  return (
    <div className="select-none">
      <div 
        className={`flex items-center border rounded-md mb-1 ${getNodeColor(node.type)} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        style={{ marginLeft: `${indent}px` }}
      >
        <div 
          className={`flex-shrink-0 w-6 text-center ${hasChildren ? 'cursor-pointer' : 'opacity-0'}`}
          onClick={() => hasChildren && onToggle(node.id)}
        >
          {hasChildren && (isExpanded ? '▼' : '►')}
        </div>
        <div 
          className="flex-grow py-2 px-2 cursor-pointer flex items-center"
          onClick={() => onSelect(node)}
        >
          <span className="mr-2">{getNodeIcon(node.type)}</span>
          <span className="font-medium">{node.name}</span>
          {node.id && <span className="text-gray-500 text-sm ml-2">(ID: {node.id})</span>}
          {node.code && <span className="text-blue-500 text-sm ml-2">«{node.code}»</span>}
        </div>
      </div>
      
      {isExpanded && hasChildren && (
        <div>
          {node.children.map(child => (
            <TreeNode
              key={`${child.type}-${child.id}`}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              selectedNode={selectedNode}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main component
const MarketTreeViz = () => {
  // Tree data with hierarchical structure of the MOEX market
  const treeData = {
    id: 'root',
    name: 'Moscow Exchange',
    type: 'root',
    children: [
      {
        id: 1,
        name: 'Stock and Deposit Market',
        code: 'stock',
        type: 'engine',
        children: [
          {
            id: 1,
            name: 'Shares Market',
            code: 'shares',
            type: 'market',
            children: [
              {
                id: 57,
                name: 'T+: Main Mode - Anonymous',
                code: 'stock_shares_tplus',
                type: 'boardGroup',
                children: [
                  { id: 129, name: 'Shares and DRs', code: 'TQBR', type: 'board' },
                  { id: 130, name: 'A2-Shares and Units', code: 'TQBS', type: 'board' },
                  { id: 177, name: 'Fund Units', code: 'TQIF', type: 'board' },
                  { id: 178, name: 'ETFs', code: 'TQTF', type: 'board' }
                ]
              },
              {
                id: 156,
                name: 'T+: Main Mode (USD) - Anonymous',
                code: 'stock_shares_tplus_usd',
                type: 'boardGroup',
                children: [
                  { id: 225, name: 'ETFs (USD)', code: 'TQTD', type: 'board' },
                  { id: 429, name: 'Fund Units (USD)', code: 'TQFD', type: 'board' }
                ]
              },
              {
                id: 157,
                name: 'T+: Main Mode (EUR) - Anonymous',
                code: 'stock_shares_tplus_eur',
                type: 'boardGroup',
                children: [
                  { id: 313, name: 'Shares and DRs (EUR)', code: 'TQBE', type: 'board' },
                  { id: 314, name: 'ETFs (EUR)', code: 'TQTE', type: 'board' }
                ]
              },
              {
                id: 21,
                name: 'Odd Lots - Anonymous',
                code: 'stock_shares_sm',
                type: 'boardGroup',
                children: [
                  { id: 36, name: 'Odd Lots (Shares)', code: 'SMAL', type: 'board' }
                ]
              }
            ]
          },
          {
            id: 2,
            name: 'Bonds Market',
            code: 'bonds',
            type: 'market',
            children: [
              {
                id: 58,
                name: 'T+: Main Mode - Anonymous',
                code: 'stock_bonds_tplus',
                type: 'boardGroup',
                children: [
                  { id: 135, name: 'Government Bonds', code: 'TQOB', type: 'board' },
                  { id: 349, name: 'Corporate Bonds', code: 'TQCB', type: 'board' },
                  { id: 361, name: 'D-Level Bonds', code: 'TQRD', type: 'board' }
                ]
              },
              {
                id: 193,
                name: 'T+: Main Mode (USD) - Anonymous',
                code: 'stock_bonds_tplus_usd',
                type: 'boardGroup',
                children: [
                  { id: 226, name: 'Bonds (USD)', code: 'TQOD', type: 'board' },
                  { id: 363, name: 'D-Level Bonds (USD)', code: 'TQUD', type: 'board' }
                ]
              },
              {
                id: 207,
                name: 'T+: Bonds (EUR) - Anonymous',
                code: 'stock_bonds_tplus_eur',
                type: 'boardGroup',
                children: [
                  { id: 357, name: 'Bonds (EUR)', code: 'TQOE', type: 'board' }
                ]
              }
            ]
          },
          {
            id: 5,
            name: 'Stock Market Indices',
            code: 'index',
            type: 'market',
            children: [
              {
                id: 9,
                name: 'Indices',
                code: 'stock_index',
                type: 'boardGroup',
                children: [
                  { id: 44, name: 'Stock Market Indices', code: 'SNDX', type: 'board' },
                  { id: 102, name: 'RTS Indices', code: 'RTSI', type: 'board' }
                ]
              },
              {
                id: 104,
                name: 'INAV',
                code: 'stock_index_inav',
                type: 'boardGroup',
                children: [
                  { id: 265, name: 'INAV', code: 'INAV', type: 'board' }
                ]
              }
            ]
          },
          {
            id: 27,
            name: 'REPO with CCP',
            code: 'ccp',
            type: 'market',
            children: [
              {
                id: 50,
                name: 'REPO with CCP 1 Day - Anonymous',
                code: 'stock_ccp',
                type: 'boardGroup',
                children: [
                  { id: 123, name: 'REPO with CCP 1 Day', code: 'EQRP', type: 'board' }
                ]
              },
              {
                id: 65,
                name: 'REPO with CCP - Addressed',
                code: 'stock_ccp_ndm',
                type: 'boardGroup',
                children: [
                  { id: 125, name: 'REPO with CCP', code: 'PSRP', type: 'board' }
                ]
              }
            ]
          },
          {
            id: 47,
            name: 'Foreign Securities',
            code: 'foreignshares',
            type: 'market',
            children: [
              {
                id: 265,
                name: 'T+ Foreign Shares',
                code: 'stock_foreign_shares',
                type: 'boardGroup',
                children: [
                  { id: 415, name: 'T+ Foreign Shares and DRs', code: 'FQBR', type: 'board' }
                ]
              },
              {
                id: 292,
                name: 'T+: Foreign Shares (USD)',
                code: 'stock_foreignshares_tplus_usd',
                type: 'boardGroup',
                children: [
                  { id: 224, name: 'T+: Foreign Shares and DRs (USD)', code: 'TQBD', type: 'board' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 3,
        name: 'Currency Market',
        code: 'currency',
        type: 'engine',
        children: [
          {
            id: 10,
            name: 'Exchange Trades with CCP',
            code: 'selt',
            type: 'market',
            children: [
              {
                id: 13,
                name: 'Currency',
                code: 'currency',
                type: 'boardGroup',
                children: [
                  { id: 21, name: 'System Trades', code: 'CETS', type: 'board' },
                  { id: 351, name: 'Large Trades', code: 'SDBP', type: 'board' }
                ]
              },
              {
                id: 46,
                name: 'Currency Negotiated Trades',
                code: 'currency_ndm',
                type: 'boardGroup',
                children: [
                  { id: 116, name: 'Off-system Trades', code: 'CNGD', type: 'board' }
                ]
              }
            ]
          },
          {
            id: 41,
            name: 'Currency Fixing',
            code: 'index',
            type: 'market',
            children: [
              {
                id: 165,
                name: 'Currency Fixing',
                code: 'currency_index',
                type: 'boardGroup',
                children: [
                  { id: 321, name: 'Currency Fixing', code: 'FIXI', type: 'board' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 4,
        name: 'Derivatives Market',
        code: 'futures',
        type: 'engine',
        children: [
          {
            id: 22,
            name: 'FORTS',
            code: 'forts',
            type: 'market',
            children: [
              {
                id: 45,
                name: 'Futures',
                code: 'futures_forts',
                type: 'boardGroup',
                children: [
                  { id: 101, name: 'Futures', code: 'RFUD', type: 'board' }
                ]
              }
            ]
          },
          {
            id: 24,
            name: 'FORTS Options',
            code: 'options',
            type: 'market',
            children: [
              {
                id: 35,
                name: 'Options',
                code: 'futures_options',
                type: 'boardGroup',
                children: [
                  { id: 103, name: 'Options', code: 'ROPD', type: 'board' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 1326,
        name: 'Money Market',
        code: 'money',
        type: 'engine',
        children: [
          {
            id: 1327,
            name: 'Federal Treasury Deposits',
            code: 'deposit',
            type: 'market',
            children: [
              {
                id: 1329,
                name: 'FT Deposits - closed form',
                code: 'money_deposit',
                type: 'boardGroup',
                children: [
                  { id: 1330, name: 'FT Deposits, closed form', code: 'DPFK', type: 'board' },
                  { id: 1331, name: 'FT Deposits, open form', code: 'DPFO', type: 'board' }
                ]
              }
            ]
          },
          {
            id: 1328,
            name: 'Federal Treasury REPO',
            code: 'repo',
            type: 'market',
            children: [
              {
                id: 1332,
                name: 'REPO with FT',
                code: 'money_repo',
                type: 'boardGroup',
                children: [
                  { id: 1333, name: 'REPO with FT: closed form', code: 'RPFC', type: 'board' },
                  { id: 1334, name: 'REPO with FT: open form', code: 'RPFO', type: 'board' }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
  
  // State for expanded nodes
  const [expanded, setExpanded] = useState({
    root: true,  // Root is expanded by default
    1: true,     // Stock market expanded by default
  });
  
  // State for selected node details
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Toggle node expansion
  const toggleNode = (nodeId) => {
    setExpanded({
      ...expanded,
      [nodeId]: !expanded[nodeId]
    });
  };
  
  // Select a node to display details
  const selectNode = (node) => {
    setSelectedNode(node);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">MOEX Market Structure Hierarchy</h2>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3 border rounded-lg p-4 overflow-auto max-h-96">
          <h3 className="font-semibold mb-2">Market Hierarchy Tree</h3>
          <div className="text-sm mb-4 text-gray-600">
            Click on an item to view details. Use ► to expand/collapse nodes.
          </div>
          
          <TreeNode
            node={treeData}
            expanded={expanded}
            onToggle={toggleNode}
            selectedNode={selectedNode}
            onSelect={selectNode}
          />
        </div>
        
        <div className="lg:w-1/3 border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Node Details</h3>
          
          {selectedNode ? (
            <div>
              <div className="bg-gray-50 p-3 rounded-md mb-3">
                <div className="font-medium text-blue-800">{selectedNode.name}</div>
                {selectedNode.code && (
                  <div className="text-sm mt-1">Code: <span className="font-mono bg-blue-50 px-1 rounded">{selectedNode.code}</span></div>
                )}
                <div className="text-sm mt-1">ID: {selectedNode.id}</div>
                <div className="text-sm mt-1">Type: {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}</div>
              </div>
              
              {selectedNode.type === 'board' && (
                <div className="text-sm text-gray-600 mt-3">
                  <p className="font-medium">API Endpoint:</p>
                  <div className="bg-gray-50 p-2 mt-1 rounded font-mono text-xs overflow-x-auto">
                    /iss/engines/{getParentCode(selectedNode, 'engine')}/markets/{getParentCode(selectedNode, 'market')}/boards/{selectedNode.code}
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-sm">
                {getNodeDescription(selectedNode)}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic">
              Select a node from the tree to view details
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded border text-sm">
        <p className="font-medium">Understanding the MOEX Market Structure</p>
        <p className="mt-1">
          This hierarchical visualization shows the relationship between trading engines, 
          markets, board groups, and boards in the Moscow Exchange (MOEX) system.
        </p>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li><span className="text-blue-700">Trading Engines</span> (🏛️) are main trading platforms (stock, currency, futures)</li>
          <li><span className="text-green-700">Markets</span> (🏪) are segments within each engine (shares, bonds, REPO)</li>
          <li><span className="text-yellow-700">Board Groups</span> (📋) are collections of trading boards with similar characteristics</li>
          <li><span className="text-indigo-700">Boards</span> (📝) are specific trading modes (TQBR, EQRP, CETS)</li>
        </ul>
      </div>
    </div>
  );
  
  // Helper function to get the code of a parent node of specific type
  function getParentCode(node, type) {
    // This is a simplified implementation for the demo
    // In a real application, you would traverse up the tree to find the parent
    
    if (type === 'engine') {
      if (node.code === 'TQBR' || node.code === 'TQCB' || node.code === 'FQBR') return 'stock';
      if (node.code === 'CETS' || node.code === 'FIXI') return 'currency';
      if (node.code === 'RFUD' || node.code === 'ROPD') return 'futures';
      if (node.code === 'DPFK' || node.code === 'RPFC') return 'money';
      return 'stock'; // Default
    }
    
    if (type === 'market') {
      if (node.code === 'TQBR' || node.code === 'TQTF') return 'shares';
      if (node.code === 'TQCB' || node.code === 'TQOB') return 'bonds';
      if (node.code === 'SNDX') return 'index';
      if (node.code === 'EQRP') return 'ccp';
      if (node.code === 'FQBR') return 'foreignshares';
      if (node.code === 'CETS') return 'selt';
      if (node.code === 'FIXI') return 'index';
      if (node.code === 'RFUD') return 'forts';
      if (node.code === 'ROPD') return 'options';
      if (node.code === 'DPFK') return 'deposit';
      if (node.code === 'RPFC') return 'repo';
      return 'shares'; // Default
    }
    
    return 'unknown';
  }
  
  // Helper function to get description based on node type
  function getNodeDescription(node) {
    switch(node.type) {
      case 'engine':
        return `A trading engine in MOEX represents a major trading platform. The ${node.name} (${node.code}) is one of the main divisions of the exchange, hosting multiple markets with different types of securities and trading modes.`;
      
      case 'market':
        return `A market is a segment within a trading engine. The ${node.name} (${node.code}) defines a specific area of trading with its own rules, securities, and trading modes.`;
      
      case 'boardGroup':
        return `A board group is a collection of trading boards with similar characteristics. The ${node.name} (${node.code}) groups together boards that share common trading rules, settlement procedures, or security types.`;
        
      case 'board':
        return `A board is a specific trading mode with defined parameters. The ${node.name} (${node.code}) board defines exact trading conditions including settlement cycle, order types, trading hours, and lot sizes. This is the most granular level used in API queries.`;
        
      default:
        return `${node.name} is the root node of the MOEX market structure, containing all trading engines, markets, board groups, and boards.`;
    }
  }
}