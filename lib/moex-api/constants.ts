// MOEX API base URL
export const MOEX_API_BASE_URL = "https://iss.moex.com/iss"

// Candle intervals (also defined in types/moex-api.ts)
export enum MOEXCandleInterval {
  MIN1 = '1',      // 1 minute
  MIN10 = '10',    // 10 minutes
  HOUR1 = '60',    // 1 hour
  DAY1 = '24',     // 1 day
  WEEK1 = '7',     // 1 week
  MONTH1 = '31',   // 1 month
}

// MOEX API endpoints
export const ENDPOINTS = {
  // Securities data
  SECURITIES: "/securities",
  SECURITY_BY_ID: "/securities/{security}",
  SECURITY_INDICES: "/securities/{security}/indices",
  SECURITY_AGGREGATES: "/securities/{security}/aggregates",
  
  // Historical securities data
  SECURITIES_HISTORY: "/history/engines/stock/totals/securities",
  SECURITIES_BY_BOARD_HISTORY: "/history/engines/stock/totals/boards/{board}/securities",
  SECURITY_BY_BOARD_HISTORY: "/history/engines/stock/totals/boards/{board}/securities/{security}",
  
  // Engine and market data
  ENGINES: "/engines",
  ENGINE_BY_ID: "/engines/{engine}",
  MARKETS: "/engines/{engine}/markets",
  MARKET_BY_ID: "/engines/{engine}/markets/{market}",
  
  // Boards and board groups
  BOARDS: "/engines/{engine}/markets/{market}/boards",
  BOARD_BY_ID: "/engines/{engine}/markets/{market}/boards/{board}",
  BOARDGROUPS: "/engines/{engine}/markets/{market}/boardgroups",
  BOARDGROUP_BY_ID: "/engines/{engine}/markets/{market}/boardgroups/{boardgroup}",

  // Market securities data
  MARKET_SECURITIES: "/engines/{engine}/markets/{market}/securities",
  MARKET_SECURITY_BY_ID: "/engines/{engine}/markets/{market}/securities/{security}",
  BOARD_SECURITIES: "/engines/{engine}/markets/{market}/boards/{board}/securities",
  BOARD_SECURITY_BY_ID: "/engines/{engine}/markets/{market}/boards/{board}/securities/{security}",
  BOARDGROUP_SECURITIES: "/engines/{engine}/markets/{market}/boardgroups/{boardgroup}/securities",
  BOARDGROUP_SECURITY_BY_ID: "/engines/{engine}/markets/{market}/boardgroups/{boardgroup}/securities/{security}",
  
  // Trades data
  MARKET_TRADES: "/engines/{engine}/markets/{market}/trades",
  SECURITY_TRADES: "/engines/{engine}/markets/{market}/securities/{security}/trades",
  BOARD_TRADES: "/engines/{engine}/markets/{market}/boards/{board}/trades",
  BOARD_SECURITY_TRADES: "/engines/{engine}/markets/{market}/boards/{board}/securities/{security}/trades",
  BOARDGROUP_TRADES: "/engines/{engine}/markets/{market}/boardgroups/{boardgroup}/trades",
  BOARDGROUP_SECURITY_TRADES: "/engines/{engine}/markets/{market}/boardgroups/{boardgroup}/securities/{security}/trades",
  
  // Orderbook data
  MARKET_ORDERBOOK: "/engines/{engine}/markets/{market}/orderbook",
  SECURITY_ORDERBOOK: "/engines/{engine}/markets/{market}/securities/{security}/orderbook",
  BOARD_ORDERBOOK: "/engines/{engine}/markets/{market}/boards/{board}/orderbook",
  BOARD_SECURITY_ORDERBOOK: "/engines/{engine}/markets/{market}/boards/{board}/securities/{security}/orderbook",
  BOARDGROUP_ORDERBOOK: "/engines/{engine}/markets/{market}/boardgroups/{boardgroup}/orderbook",
  BOARDGROUP_SECURITY_ORDERBOOK: "/engines/{engine}/markets/{market}/boardgroups/{boardgroup}/securities/{security}/orderbook",
  
  // Candles data
  SECURITY_CANDLES: "/engines/{engine}/markets/{market}/securities/{security}/candles",
  BOARD_SECURITY_CANDLES: "/engines/{engine}/markets/{market}/boards/{board}/securities/{security}/candles",
  BOARDGROUP_SECURITY_CANDLES: "/engines/{engine}/markets/{market}/boardgroups/{boardgroup}/securities/{security}/candles",
  
  // Analytics and statistics
  ANALYTICS: "/statistics/engines/stock/markets/index/analytics",
  ANALYTICS_BY_INDEX: "/statistics/engines/stock/markets/index/analytics/{indexid}",
  SECTOR_PERFORMANCE: "/statistics/engines/stock/deviationcoeffs",
  MARKET_DATA: "/statistics/engines/stock/currentprices",
  CAPITALIZATION: "/statistics/engines/stock/capitalization",
  
  // Futures and options
  FUTURES_SERIES: "/statistics/engines/futures/markets/forts/series",
  OPTIONS_ASSETS: "/statistics/engines/futures/markets/options/assets",
  OPTIONS_ASSET_BY_ID: "/statistics/engines/futures/markets/options/assets/{asset}",
  OPTIONS_SERIES: "/statistics/engines/futures/markets/options/series",
  OPTIONS_SERIES_BY_NAME: "/statistics/engines/futures/markets/options/series/{series_name}/securities",
  
  // Currency and rates
  CURRENCY_RATES: "/statistics/engines/currency/markets/selt/rates",
  CURRENCY_FIXING: "/statistics/engines/currency/markets/fixing",
  CURRENCY_FIXING_BY_ID: "/statistics/engines/currency/markets/fixing/{security}",
  
  // Reference data
  REFERENCE_SECURITIES: "/referencedata/engines/stock/markets/all/securities",
  REFERENCE_SECURITIES_LISTING: "/referencedata/engines/stock/markets/all/securitieslisting",
  REFERENCE_FUTURES_SECURITIES: "/referencedata/engines/futures/markets/{market}/securities",
  
  // Turnovers
  TURNOVERS: "/turnovers",
  ENGINE_TURNOVERS: "/engines/{engine}/turnovers",
  MARKET_TURNOVERS: "/engines/{engine}/markets/{market}/turnovers",
  
  // Index (global references)
  INDEX: "/index",
}

// Default format options
export const DEFAULT_FORMAT = "json"

// Common query parameters
export const DEFAULT_QUERY_PARAMS = {
  lang: "en",
}

// Available boards
export const BOARDS = {
  TQBR: "TQBR", // T+2 shares
  TQTF: "TQTF", // T+2 ETFs
  FQBR: "FQBR", // Foreign shares
  EQTF: "EQTF", // Currency ETFs
  TQIF: "TQIF", // Investment funds
  TQIR: "TQIR", // Russian investment funds
  TQKF: "TQKF", // Credit funds
  TQQI: "TQQI", // Mortgage funds
  TQQU: "TQQU", // Municipal funds
}

// Available trading engines
export const ENGINES = {
  STOCK: "stock",      // Stock market
  CURRENCY: "currency", // Currency market
  FUTURES: "futures",   // Futures market
  COMMODITY: "commodity", // Commodity market
  INTERVENTIONS: "interventions", // Interventions
  OFFBOARD: "offboard", // OTC market
  OTC: "otc",          // OTC market
  STATE: "state",      // Government securities
}

// Available markets
export const MARKETS = {
  // Stock markets
  SHARES: "shares",
  BONDS: "bonds",
  INDEXES: "index",
  NDMZ: "ndm",         // Non-negotiated direct market
  OTCZ: "otc",         // OTC Market
  
  // Futures markets
  FORTS: "forts",
  OPTIONS: "options",
  
  // Currency markets
  SELT: "selt",
  FOREX: "forex",
}

// Common Russian market indices
export const INDICES = {
  MOEX: "IMOEX",       // MOEX Russia Index
  RTS: "RTSI",         // RTS Index
  BLUE_CHIPS: "MOEXBC", // Blue Chip Index
  BROAD_MARKET: "MOEXBMI", // Broad Market Index
  SMALL_CAP: "MOEXSM", // Small Cap Index
  MID_CAP: "MOEXMM",   // Mid Cap Index
  INNOVATION: "MOEXINN", // Innovation Index
  TELECOM: "MOEXTLC",  // Telecom Index
  UTILITIES: "MOEXEU", // Utilities Index
  FINANCIALS: "MOEXFN", // Financials Index
  METALS_MINING: "MOEXMM", // Metals and Mining Index
}

// Trading sessions
export const TRADING_SESSIONS = {
  MORNING: 0,
  MAIN: 1,
  EVENING: 2,
  TOTAL: 3,
} 