
import { ArbitrageOpportunity, PriceData, Transaction, ProfitData, TokenPairProfit } from "@/types/arbitrage";

// Token pairs
const TOKEN_PAIRS = ["ETH/USDT", "BTC/USDT", "ETH/BTC", "SOL/USDT", "MATIC/ETH"];
// DEXs
const DEXES = ["Uniswap", "SushiSwap", "Curve", "PancakeSwap", "1inch"];

// Generate random price with slight variation
const getRandomPrice = (base: number, variation = 0.05) => {
  return base * (1 + (Math.random() * variation * 2 - variation));
};

// Generate mock price data
export const generatePriceData = (): PriceData[] => {
  const now = Date.now();
  
  return TOKEN_PAIRS.flatMap(tokenPair => {
    // Base price for this token pair
    const basePrice = tokenPair.includes("BTC") 
      ? 30000 + Math.random() * 2000 
      : tokenPair.includes("ETH") 
        ? 2000 + Math.random() * 200
        : 1 + Math.random() * 10;
    
    return DEXES.map(dex => ({
      tokenPair,
      dex,
      price: getRandomPrice(basePrice),
      timestamp: now - Math.floor(Math.random() * 60000) // Within the last minute
    }));
  });
};

// Generate arbitrage opportunities based on price data
export const generateArbitrageOpportunities = (): ArbitrageOpportunity[] => {
  const priceData = generatePriceData();
  const opportunities: ArbitrageOpportunity[] = [];
  
  TOKEN_PAIRS.forEach(tokenPair => {
    const tokenPrices = priceData.filter(p => p.tokenPair === tokenPair);
    
    // Find min and max prices for this token pair
    const minPrice = tokenPrices.reduce((min, p) => p.price < min.price ? p : min, tokenPrices[0]);
    const maxPrice = tokenPrices.reduce((max, p) => p.price > max.price ? p : max, tokenPrices[0]);
    
    if (maxPrice.price > minPrice.price) {
      const priceDifference = maxPrice.price - minPrice.price;
      const priceDifferencePercentage = (priceDifference / minPrice.price) * 100;
      
      // Only create opportunity if difference is significant
      if (priceDifferencePercentage > 0.5) {
        opportunities.push({
          id: `arb-${Math.random().toString(36).substring(2, 9)}`,
          tokenPair,
          buyDex: minPrice.dex,
          sellDex: maxPrice.dex,
          buyPrice: minPrice.price,
          sellPrice: maxPrice.price,
          priceDifference,
          priceDifferencePercentage,
          estimatedProfit: priceDifference * (tokenPair.includes("BTC") ? 0.01 : tokenPair.includes("ETH") ? 0.1 : 1),
          timestamp: Date.now()
        });
      }
    }
  });
  
  return opportunities;
};

// Generate mock transaction history
export const generateTransactionHistory = (count = 20): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const tokenPair = TOKEN_PAIRS[Math.floor(Math.random() * TOKEN_PAIRS.length)];
    const basePrice = tokenPair.includes("BTC") 
      ? 30000 + Math.random() * 2000 
      : tokenPair.includes("ETH") 
        ? 2000 + Math.random() * 200
        : 1 + Math.random() * 10;
    
    const buyPrice = getRandomPrice(basePrice);
    const sellPrice = getRandomPrice(basePrice);
    const profit = sellPrice - buyPrice;
    
    transactions.push({
      id: `tx-${Math.random().toString(36).substring(2, 9)}`,
      tokenPair,
      buyDex: DEXES[Math.floor(Math.random() * DEXES.length)],
      sellDex: DEXES[Math.floor(Math.random() * DEXES.length)],
      buyPrice,
      sellPrice,
      profit,
      profitPercentage: (profit / buyPrice) * 100,
      timestamp: now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Within the last week
      status: Math.random() > 0.1 
        ? 'completed' 
        : Math.random() > 0.5 
          ? 'pending' 
          : 'failed',
      hash: `0x${Math.random().toString(16).substring(2, 42)}`,
      gasUsed: Math.floor(Math.random() * 200000) + 50000,
      gasPrice: Math.floor(Math.random() * 100) + 20,
    });
  }
  
  // Sort by timestamp, newest first
  return transactions.sort((a, b) => b.timestamp - a.timestamp);
};

// Generate profit data for chart
export const generateProfitData = (days = 30): ProfitData[] => {
  const data: ProfitData[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // More profits in recent days to show an uptrend
    const profit = Math.random() * 100 * (1 + (days - i) / days);
    
    data.push({
      date: date.toISOString().split('T')[0],
      profit: profit
    });
  }
  
  return data;
};

// Generate profit by token pair
export const generateTokenPairProfits = (): TokenPairProfit[] => {
  return TOKEN_PAIRS.map(tokenPair => ({
    tokenPair,
    profit: Math.random() * 5000 - 500, // Some might be negative
    trades: Math.floor(Math.random() * 100) + 10
  })).sort((a, b) => b.profit - a.profit);
};
