
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/arbitrage";
import { BarChart2 } from "lucide-react";

interface HeatmapChartProps {
  transactions: Transaction[];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ transactions }) => {
  // Process data for the heatmap
  const heatmapData = useMemo(() => {
    // Group transactions by token pair and DEX pairs
    const data: Record<string, Record<string, { profit: number; count: number }>> = {};
    
    transactions.forEach(tx => {
      const tokenPair = tx.tokenPair;
      const dexPair = `${tx.buyDex}-${tx.sellDex}`;
      
      if (!data[tokenPair]) {
        data[tokenPair] = {};
      }
      
      if (!data[tokenPair][dexPair]) {
        data[tokenPair][dexPair] = { profit: 0, count: 0 };
      }
      
      data[tokenPair][dexPair].profit += tx.profit;
      data[tokenPair][dexPair].count += 1;
    });
    
    return data;
  }, [transactions]);
  
  // Get all unique DEX pairs
  const dexPairs = useMemo(() => {
    const pairs = new Set<string>();
    
    transactions.forEach(tx => {
      pairs.add(`${tx.buyDex}-${tx.sellDex}`);
    });
    
    return Array.from(pairs);
  }, [transactions]);
  
  // Get most profitable combinations
  const topCombinations = useMemo(() => {
    const combinations: Array<{ 
      tokenPair: string; 
      dexPair: string; 
      profit: number; 
      count: number;
      avgProfit: number;
    }> = [];
    
    Object.entries(heatmapData).forEach(([tokenPair, dexEntries]) => {
      Object.entries(dexEntries).forEach(([dexPair, stats]) => {
        combinations.push({
          tokenPair,
          dexPair,
          profit: stats.profit,
          count: stats.count,
          avgProfit: stats.profit / stats.count
        });
      });
    });
    
    return combinations.sort((a, b) => b.profit - a.profit).slice(0, 8);
  }, [heatmapData]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart2 className="mr-2 h-5 w-5" />
          Profitability Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topCombinations.length > 0 ? (
          <div className="space-y-2">
            {topCombinations.map((combo, index) => (
              <div
                key={`${combo.tokenPair}-${combo.dexPair}`}
                className="flex items-center"
              >
                <div className="w-24 flex-shrink-0 text-sm font-medium truncate">
                  {combo.tokenPair}
                </div>
                <div className="ml-2 text-xs text-muted-foreground w-24 flex-shrink-0 truncate">
                  {combo.dexPair}
                </div>
                <div className="ml-4 flex-grow">
                  <div className="relative h-6 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                      style={{
                        width: `${Math.min(100, (combo.profit / topCombinations[0].profit) * 100)}%`,
                        opacity: 0.7 + (0.3 * index / topCombinations.length)
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-end px-2">
                      <span className="text-xs font-medium">
                        ${combo.profit.toFixed(2)} ({combo.count} trades)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            No transaction data available for heatmap
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeatmapChart;
