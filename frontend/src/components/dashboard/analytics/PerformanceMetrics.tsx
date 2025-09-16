
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { TrendingUp, BarChart2, RefreshCw } from "lucide-react";

interface PerformanceMetricsProps {
  winRate: number;
  avgProfit: number;
  totalTrades: number;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  winRate,
  avgProfit,
  totalTrades,
}) => {
  // Calculate the number of profitable trades based on win rate
  const profitableTrades = Math.round((winRate / 100) * totalTrades);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Win Rate</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16">
              <CircularProgressbar
                value={winRate}
                text={`${winRate.toFixed(0)}%`}
                styles={buildStyles({
                  textSize: '1.5rem',
                  pathColor: winRate >= 50 ? '#10B981' : '#EF4444',
                  textColor: '#64748B',
                  trailColor: '#E2E8F0',
                })}
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {winRate >= 50 ? 'Good performance' : 'Needs improvement'}
              </p>
              <p className="text-xs text-muted-foreground">
                {profitableTrades} profitable out of {totalTrades} trades
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Avg. Profit per Trade</h3>
            <BarChart2 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <div className="text-3xl font-bold mb-1">
              ${avgProfit.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              {avgProfit > 0 
                ? 'Positive average return' 
                : 'Negative average return'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Trades</h3>
            <RefreshCw className="h-5 w-5 text-purple-500" />
          </div>
          <div className="flex flex-col">
            <div className="text-3xl font-bold mb-1">
              {totalTrades}
            </div>
            <p className="text-sm text-muted-foreground">
              Lifetime executed trades
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
