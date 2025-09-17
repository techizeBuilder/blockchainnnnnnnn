
import React, { useState, useEffect } from "react";
import ProfitChart from "@/components/dashboard/ProfitChart";
import TotalProfitDisplay from "@/components/dashboard/TotalProfitDisplay";
import TokenPairProfitTable from "@/components/dashboard/TokenPairProfitTable";
import { generateProfitData, generateTokenPairProfits } from "@/lib/mockData";
import { ProfitData, TokenPairProfit } from "@/types/arbitrage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfitLossOverview: React.FC = () => {
  const [profitData, setProfitData] = useState<ProfitData[]>([]);
  const [tokenPairProfits, setTokenPairProfits] = useState<TokenPairProfit[]>([]);
  
  useEffect(() => {
    // Load profit data
    setProfitData(generateProfitData());
    setTokenPairProfits(generateTokenPairProfits());
  }, []);
  
  // Calculate total profit - adding a check for empty array
  const totalProfit = profitData.length > 0 ? profitData.reduce((sum, data) => sum + data.profit, 0) : 0;
  
  // Calculate percentage change by comparing last 7 days to previous 7 days
  // Add defensive checks to avoid accessing undefined values
  const last7Days = profitData.slice(-7);
  const previous7Days = profitData.slice(-14, -7);
  
  const last7DaysTotal = last7Days.length > 0 ? last7Days.reduce((sum, data) => sum + data.profit, 0) : 0;
  const previous7DaysTotal = previous7Days.length > 0 ? previous7Days.reduce((sum, data) => sum + data.profit, 0) : 0;
  
  const percentageChange = previous7DaysTotal !== 0 
    ? ((last7DaysTotal - previous7DaysTotal) / previous7DaysTotal) * 100 
    : 0;
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Profit/Loss Overview</h2>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <TotalProfitDisplay 
          totalProfit={totalProfit} 
          percentageChange={percentageChange}
          period="previous period" 
        />
        
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Last 24h Profit</div>
                <div className="text-2xl font-bold text-green-600">
                  {/* Add check for empty array */}
                  +${profitData.length > 0 ? profitData[profitData.length - 1]?.profit.toFixed(2) : "0.00"}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Most Profitable Pair</div>
                <div className="text-2xl font-bold">
                  {/* Add check for empty array */}
                  {tokenPairProfits.length > 0 ? tokenPairProfits[0]?.tokenPair : "N/A"}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <div className="text-sm font-medium text-muted-foreground mb-1">Avg. Profit per Trade</div>
                <div className="text-2xl font-bold">
                  {/* Add safe calculation with default of 0 */}
                  ${totalProfit && tokenPairProfits.length > 0 
                    ? (totalProfit / (tokenPairProfits.reduce((sum, item) => sum + item.trades, 0) || 1)).toFixed(2) 
                    : "0.00"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ProfitChart profitData={profitData} />
      
      <TokenPairProfitTable tokenPairProfits={tokenPairProfits} />
    </div>
  );
};

export default ProfitLossOverview;
