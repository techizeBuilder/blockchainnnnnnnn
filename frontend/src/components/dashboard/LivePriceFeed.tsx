import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNetwork } from "@/lib/networkContext";
import Request from "@/lib/apiCall";
import api from "@/config/apiRoutes";

interface PriceData {
  tokenPair: string;
  dex: string;
  liquidityUsd: string;
  price: number;
  timestamp: number;
}

const LivePriceFeed: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const { selectedNetwork } = useNetwork();

  console.log("selected networks on arbitrage page : ", selectedNetwork);

  const fetchDexPairs = async () => {
    try {
      const res = await Request.get(`${api.getPairDecx}/${selectedNetwork.name}?limit=1&useThirdParty=true`);
      console.log("get pair response : ", res);

      if (res?.data?.dexes) {
        // ✅ Extract data from ALL DEXes
        const transformedData: PriceData[] = Object.entries(res.data.dexes).flatMap(([dexName, pairs]: [string, any]) =>
          pairs.map((pair: any) => ({
            tokenPair: pair.pairName,
            liquidityUsd: pair.liquidityUsd,
            dex: dexName, // Use the DEX name dynamically
            price: parseFloat(pair.price),
            timestamp: Date.now(),
          }))
        );

        setPriceData(transformedData);
      }
    } catch (error) {
      console.log("error in getting pair decs  : ", error);
    }
  };

  useEffect(() => {
    fetchDexPairs();
  }, [selectedNetwork]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Price Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">Token Pair</TableHead>
                <TableHead className="text-start">DEX</TableHead>
                <TableHead className="text-start">Liquidity USD</TableHead>
                <TableHead className="text-start">Price</TableHead>
                <TableHead className="text-start">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceData.map((price, index) => (
                <TableRow key={`${price.dex}-${price.tokenPair}-${index}`}>
                  <TableCell className="font-medium text-start">{price.tokenPair}</TableCell>
                  <TableCell className="text-start">{price.dex}</TableCell>
                  <TableCell className="text-start">{price.liquidityUsd}</TableCell>
                  <TableCell className="text-start">${price.price.toFixed(4)}</TableCell>
                  <TableCell className="text-start">
                    {new Date(price.timestamp).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePriceFeed;
