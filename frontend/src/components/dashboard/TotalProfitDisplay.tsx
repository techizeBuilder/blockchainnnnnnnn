
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface TotalProfitDisplayProps {
  totalProfit: number;
  percentageChange: number;
  period: string;
}

const TotalProfitDisplay: React.FC<TotalProfitDisplayProps> = ({
  totalProfit,
  percentageChange,
  period,
}) => {
  const isPositive = totalProfit >= 0;
  const changeIsPositive = percentageChange >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {isPositive ? "+" : ""}${Math.abs(totalProfit).toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className={`inline-flex items-center ${changeIsPositive ? "text-green-600" : "text-red-600"}`}>
            {changeIsPositive ? (
              <ArrowUp className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4" />
            )}
            {changeIsPositive ? "+" : ""}
            {percentageChange.toFixed(2)}%
          </span>{" "}
          from {period}
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalProfitDisplay;
