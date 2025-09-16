
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/arbitrage";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ArrowUpRight, ArrowDownRight, BarChart2, PieChart } from "lucide-react";

interface TokenPairAnalyticsProps {
  tokenPair: string;
  transactions: Transaction[];
}

const TokenPairAnalytics: React.FC<TokenPairAnalyticsProps> = ({
  tokenPair,
  transactions,
}) => {
  // Calculate metrics for the token pair
  const totalTrades = transactions.length;
  const profitableTrades = transactions.filter(tx => tx.profit > 0).length;
  const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;
  const totalProfit = transactions.reduce((sum, tx) => sum + tx.profit, 0);
  const avgProfit = totalTrades > 0 ? totalProfit / totalTrades : 0;
  
  // Prepare data for line chart
  const chartData = useMemo(() => {
    return transactions
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(tx => ({
        date: new Date(tx.timestamp).toLocaleDateString(),
        timestamp: tx.timestamp,
        profit: tx.profit,
        buyPrice: tx.buyPrice,
        sellPrice: tx.sellPrice,
      }));
  }, [transactions]);
  
  // Get best and worst trades
  const bestTrade = useMemo(() => {
    return transactions.reduce((best, current) => 
      current.profit > best.profit ? current : best, 
      transactions[0] || null
    );
  }, [transactions]);
  
  const worstTrade = useMemo(() => {
    return transactions.reduce((worst, current) => 
      current.profit < worst.profit ? current : worst, 
      transactions[0] || null
    );
  }, [transactions]);
  
  // Calculate performance by DEX
  const dexPerformance = useMemo(() => {
    const performance: Record<string, { profit: number; count: number }> = {};
    
    transactions.forEach(tx => {
      const dexPair = `${tx.buyDex}-${tx.sellDex}`;
      
      if (!performance[dexPair]) {
        performance[dexPair] = { profit: 0, count: 0 };
      }
      
      performance[dexPair].profit += tx.profit;
      performance[dexPair].count += 1;
    });
    
    return Object.entries(performance)
      .map(([dexPair, stats]) => ({
        dexPair,
        profit: stats.profit,
        count: stats.count,
        avgProfit: stats.profit / stats.count,
      }))
      .sort((a, b) => b.profit - a.profit);
  }, [transactions]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <span>{tokenPair} Analysis</span>
              <span className={`ml-2 text-sm px-2 py-1 rounded-full ${totalProfit > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {totalProfit > 0 ? 'Profitable' : 'Loss-making'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Profit/Loss</div>
              <div className={`text-2xl font-bold ${totalProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalProfit > 0 ? '+' : ''}{totalProfit.toFixed(2)} USD
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Win Rate</div>
              <div className="text-2xl font-bold">
                {winRate.toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Avg. Profit per Trade</div>
              <div className={`text-2xl font-bold ${avgProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {avgProfit > 0 ? '+' : ''}{avgProfit.toFixed(2)} USD
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Trades</div>
              <div className="text-2xl font-bold">
                {totalTrades}
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Profit Trend
              </h3>
              <div className="h-[300px]">
                {chartData.length > 0 ? (
                  <ChartContainer config={{}} className="h-full">
                    <LineChart data={chartData}>
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => {
                          if (!value) return "";
                          return value.split('/')[1]; // Just show day
                        }}
                      />
                      <YAxis />
                      <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <ChartTooltipContent 
                                className="bg-white p-2 border rounded shadow-md"
                              >
                                <div className="text-sm font-bold">
                                  {new Date(payload[0].payload.timestamp).toLocaleDateString()}
                                </div>
                                <div className="text-sm">
                                  Profit: ${parseFloat(payload[0].value as string).toFixed(2)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Buy: ${payload[0].payload.buyPrice.toFixed(4)} | Sell: ${payload[0].payload.sellPrice.toFixed(4)}
                                </div>
                              </ChartTooltipContent>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#8884d8" 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No profit data available
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <PieChart className="mr-2 h-5 w-5" />
                DEX Performance
              </h3>
              <div className="space-y-4">
                {dexPerformance.map(dex => (
                  <div key={dex.dexPair} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{dex.dexPair}</div>
                      <div className={`text-sm font-medium ${dex.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {dex.profit > 0 ? '+' : ''}{dex.profit.toFixed(2)} USD
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{dex.count} trades</span>
                      <span>Avg: {dex.avgProfit.toFixed(2)} USD per trade</span>
                    </div>
                    <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${dex.profit > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, Math.abs(dex.profit / (bestTrade?.profit || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                {dexPerformance.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No DEX performance data available
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <ArrowUpRight className="mr-2 h-5 w-5 text-green-500" />
                  Best Trade
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bestTrade ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date</span>
                      <span>{new Date(bestTrade.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">DEXs</span>
                      <span>{bestTrade.buyDex} → {bestTrade.sellDex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Buy Price</span>
                      <span>${bestTrade.buyPrice.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sell Price</span>
                      <span>${bestTrade.sellPrice.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Profit</span>
                      <span className="text-green-600 font-medium">
                        +{bestTrade.profit.toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No trade data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <ArrowDownRight className="mr-2 h-5 w-5 text-red-500" />
                  Worst Trade
                </CardTitle>
              </CardHeader>
              <CardContent>
                {worstTrade ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date</span>
                      <span>{new Date(worstTrade.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">DEXs</span>
                      <span>{worstTrade.buyDex} → {worstTrade.sellDex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Buy Price</span>
                      <span>${worstTrade.buyPrice.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sell Price</span>
                      <span>${worstTrade.sellPrice.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Profit</span>
                      <span className="text-red-600 font-medium">
                        {worstTrade.profit.toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No trade data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenPairAnalytics;
