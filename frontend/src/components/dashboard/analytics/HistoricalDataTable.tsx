
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/arbitrage";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HistoricalDataTableProps {
  transactions: Transaction[];
}

const HistoricalDataTable: React.FC<HistoricalDataTableProps> = ({ 
  transactions 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Transaction>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(tx => 
    tx.tokenPair.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.buyDex.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.sellDex.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });
  
  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "ID,Token Pair,Buy DEX,Sell DEX,Buy Price,Sell Price,Profit,Timestamp,Status,Hash\n";
    
    // Add data rows
    filteredTransactions.forEach(tx => {
      csvContent += `${tx.id},${tx.tokenPair},${tx.buyDex},${tx.sellDex},${tx.buyPrice},${tx.sellPrice},${tx.profit},${new Date(tx.timestamp).toISOString()},${tx.status},${tx.hash}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "arbitrage-trades.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle>Historical Trade Data</CardTitle>
        <div className="flex items-center space-x-2">
          <Input
            className="w-60"
            placeholder="Search trades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("timestamp")}>
                Sort by Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("profit")}>
                Sort by Profit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("tokenPair")}>
                Sort by Token Pair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("tokenPair")} className="cursor-pointer">
                  Token Pair {sortField === "tokenPair" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>DEXs</TableHead>
                <TableHead onClick={() => handleSort("buyPrice")} className="cursor-pointer">
                  Buy Price {sortField === "buyPrice" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead onClick={() => handleSort("sellPrice")} className="cursor-pointer">
                  Sell Price {sortField === "sellPrice" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead onClick={() => handleSort("profit")} className="cursor-pointer text-right">
                  Profit {sortField === "profit" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer">
                  Date {sortField === "timestamp" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                  Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.tokenPair}</TableCell>
                    <TableCell>
                      {tx.buyDex} → {tx.sellDex}
                    </TableCell>
                    <TableCell>${tx.buyPrice.toFixed(4)}</TableCell>
                    <TableCell>${tx.sellPrice.toFixed(4)}</TableCell>
                    <TableCell className={`text-right ${tx.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.profit > 0 ? '+' : ''}{tx.profit.toFixed(2)} USD
                    </TableCell>
                    <TableCell>
                      {new Date(tx.timestamp).toLocaleString()}
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalDataTable;
