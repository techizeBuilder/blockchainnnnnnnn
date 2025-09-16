
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/arbitrage";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

interface TransactionHistoryTableProps {
  transactions: Transaction[];
  onViewDetails: (transaction: Transaction) => void;
}

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({ 
  transactions,
  onViewDetails
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token Pair</TableHead>
                <TableHead>DEXs</TableHead>
                <TableHead className="text-right">Profit/Loss</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.tokenPair}</TableCell>
                  <TableCell>
                    {tx.buyDex} → {tx.sellDex}
                  </TableCell>
                  <TableCell className={`text-right ${tx.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.profit > 0 ? '+' : ''}{tx.profit.toFixed(2)} USD
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${tx.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(tx.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(tx)}
                    >
                      <InfoIcon className="h-4 w-4" />
                    </Button>
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

export default TransactionHistoryTable;
