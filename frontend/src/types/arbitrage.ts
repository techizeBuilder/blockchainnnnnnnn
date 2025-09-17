
export interface PriceData {
  tokenPair: string;
  dex: string;
  price: number;
  timestamp: number;
}

export interface ArbitrageOpportunity {
  id: string;
  tokenPair: string;
  buyDex: string;
  sellDex: string;
  buyPrice: number;
  sellPrice: number;
  priceDifference: number;
  priceDifferencePercentage: number;
  estimatedProfit: number;
  timestamp: number;
}

export interface Transaction {
  id: string;
  tokenPair: string;
  buyDex: string;
  sellDex: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  profitPercentage: number;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
  gasUsed?: number;
  gasPrice?: number;
}

export interface ProfitData {
  date: string;
  profit: number;
}

export interface TokenPairProfit {
  tokenPair: string;
  profit: number;
  trades: number;
}
