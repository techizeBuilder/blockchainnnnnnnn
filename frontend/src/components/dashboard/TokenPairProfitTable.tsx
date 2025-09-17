
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TokenPairProfit } from "@/types/arbitrage";

interface TokenPairProfitTableProps {
  tokenPairProfits: TokenPairProfit[];
}

const TokenPairProfitTable: React.FC<TokenPairProfitTableProps> = ({ tokenPairProfits }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit/Loss by Token Pair</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {tokenPairProfits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token Pair</TableHead>
                  <TableHead className="text-right">Total Trades</TableHead>
                  <TableHead className="text-right">Profit/Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenPairProfits.map((item) => (
                  <TableRow key={item.tokenPair}>
                    <TableCell className="font-medium">{item.tokenPair}</TableCell>
                    <TableCell className="text-right">{item.trades}</TableCell>
                    <TableCell className={`text-right ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.profit >= 0 ? '+' : ''}{item.profit.toFixed(2)} USD
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No token pair profit data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenPairProfitTable;
