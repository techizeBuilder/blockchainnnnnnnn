import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { useNetwork } from "@/lib/networkContext";
import Request from "@/lib/apiCall";
import api from "@/config/apiRoutes";

interface ArbitrageOpportunity {
  buyDex: string;
  sellDex: string;
  buyPrice: number;
  sellPrice: number;
  token0: string;
  token1: string;
  priceDiffPercent: number;
  profitUsd: number;
  pairName: string;
  buyPairAddress: string;
  sellPairAddress: string;
  tradeAmountUsd: number;
}

const ArbitrageTable: React.FC = () => {
  const { selectedNetwork } = useNetwork();
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDexPairs = async () => {
    setLoading(true);
    try {
      const res = await Request.get(
        `${api.getArbitrageOpportunity}/${selectedNetwork.name}?minLiquidity=0&tradeAmountUsd=1000&gasCostUsd=0&limit=5&minProfitUsd=0&useWhitelist=false`
      );
      console.log("get arbitrage opportunity response: ", res);
      if (res?.data?.opportunities?.length) {
        setOpportunities(res.data.opportunities);
      }
    } catch (error) {
      console.error("Error fetching arbitrage opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedNetwork?.name) {
      fetchDexPairs();
    }
  }, [selectedNetwork]);

  const handleExecute = (opportunity: ArbitrageOpportunity) => {
    // You can modify this based on your app logic
    console.log("Executing trade for:", opportunity);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Arbitrage Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-500">Loading opportunities...</p>
          ) : opportunities.length === 0 ? (
            <p className="text-center text-gray-500">No opportunities found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">Token Pair</TableHead>
                  <TableHead className="text-start">Buy DEX</TableHead>
                  <TableHead className="text-start">Sell DEX</TableHead>
                  <TableHead className="text-start">Price Difference</TableHead>
                  <TableHead className="text-start">Estimated Profit</TableHead>
                  <TableHead className="text-start">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opportunity, index) => (
                  <TableRow key={`${opportunity.buyPairAddress}-${index}`}>
                    <TableCell className="font-medium text-start">{opportunity.pairName}</TableCell>
                    <TableCell className="text-start">
                      {opportunity.buyDex} (${opportunity.buyPrice.toFixed(6)})
                    </TableCell>
                    <TableCell className="text-start">
                      {opportunity.sellDex} (${opportunity.sellPrice.toFixed(6)})
                    </TableCell>
                    <TableCell className="text-start text-green-600">
                      {opportunity.priceDiffPercent.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-start text-green-600">
                      ${opportunity.profitUsd.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-start">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExecute(opportunity)}
                      >
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Execute
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArbitrageTable;
