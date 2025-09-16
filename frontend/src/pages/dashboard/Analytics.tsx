
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PerformanceMetrics from "@/components/dashboard/analytics/PerformanceMetrics";
import HeatmapChart from "@/components/dashboard/analytics/HeatmapChart";
import HistoricalDataTable from "@/components/dashboard/analytics/HistoricalDataTable";
import TokenPairAnalytics from "@/components/dashboard/analytics/TokenPairAnalytics";
import { generateTransactionHistory } from "@/lib/mockData";
import { Transaction } from "@/types/arbitrage";

const Analytics: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTokenPair, setSelectedTokenPair] = useState<string | null>(null);
  
  useEffect(() => {
    // Load transaction history
    setTransactions(generateTransactionHistory());
  }, []);
  
  // Calculate metrics
  const totalTrades = transactions.length;
  const profitableTrades = transactions.filter(tx => tx.profit > 0).length;
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;
  const totalProfit = transactions.reduce((sum, tx) => sum + tx.profit, 0);
  const avgProfit = totalTrades > 0 ? totalProfit / totalTrades : 0;
  
  // Get unique token pairs for selection
  const tokenPairs = Array.from(new Set(transactions.map(tx => tx.tokenPair)));
  
  const handleTokenPairSelect = (tokenPair: string) => {
    setSelectedTokenPair(tokenPair);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      <PerformanceMetrics 
        winRate={winRate} 
        avgProfit={avgProfit} 
        totalTrades={totalTrades} 
      />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <HeatmapChart transactions={transactions} />
        
        <Card>
          <CardHeader>
            <CardTitle>Token Pair Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tokenPairs.map(pair => (
                <button
                  key={pair}
                  className={`p-2 rounded-md border ${selectedTokenPair === pair ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}
                  onClick={() => handleTokenPairSelect(pair)}
                >
                  {pair}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedTokenPair && (
        <TokenPairAnalytics 
          tokenPair={selectedTokenPair} 
          transactions={transactions.filter(tx => tx.tokenPair === selectedTokenPair)} 
        />
      )}
      
      <HistoricalDataTable transactions={transactions} />
    </div>
  );
};

export default Analytics;
