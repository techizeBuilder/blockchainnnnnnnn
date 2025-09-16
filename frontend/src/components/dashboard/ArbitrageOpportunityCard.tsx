
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArbitrageOpportunity } from "@/types/arbitrage";
import { ArrowRightLeft } from "lucide-react";

interface ArbitrageOpportunityCardProps {
  opportunity: ArbitrageOpportunity;
  onExecute: (opportunity: ArbitrageOpportunity) => void;
}

const ArbitrageOpportunityCard: React.FC<ArbitrageOpportunityCardProps> = ({ 
  opportunity,
  onExecute 
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 pb-2">
        <CardTitle className="text-lg">{opportunity.tokenPair}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Buy On</div>
            <div className="font-medium">{opportunity.buyDex}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Sell On</div>
            <div className="font-medium">{opportunity.sellDex}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Buy Price</div>
            <div className="font-medium">${opportunity.buyPrice.toFixed(4)}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Sell Price</div>
            <div className="font-medium">${opportunity.sellPrice.toFixed(4)}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Difference</div>
            <div className="font-medium text-green-600">
              ${opportunity.priceDifference.toFixed(4)} ({opportunity.priceDifferencePercentage.toFixed(2)}%)
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">Estimated Profit</div>
            <div className="font-medium text-green-600">${opportunity.estimatedProfit.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full mt-2" 
          onClick={() => onExecute(opportunity)}
        >
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Execute Trade
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArbitrageOpportunityCard;
