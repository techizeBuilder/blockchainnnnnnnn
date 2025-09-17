
import React, { useState, useEffect } from "react";
import TransactionHistoryTable from "@/components/dashboard/TransactionHistoryTable";
import TransactionDetailsModal from "@/components/dashboard/TransactionDetailsModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateTransactionHistory } from "@/lib/mockData";
import { Transaction } from "@/types/arbitrage";
import { toast } from "@/lib/toast";
import { ArrowRightLeft } from "lucide-react";

const TradeExecution: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Load transaction history
    setTransactions(generateTransactionHistory());
  }, []);
  
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleMonitorButton = () => {
    toast.info("Monitoring mode enabled. You will be notified of new arbitrage opportunities.");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Trade Execution</h2>
        <Button onClick={handleMonitorButton}>
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Enable Auto-Trading
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Trade Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Trades</div>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Successful Trades</div>
              <div className="text-2xl font-bold text-green-600">
                {transactions.filter(tx => tx.status === 'completed').length}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Failed Trades</div>
              <div className="text-2xl font-bold text-red-600">
                {transactions.filter(tx => tx.status === 'failed').length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <TransactionHistoryTable 
        transactions={transactions} 
        onViewDetails={handleViewDetails} 
      />
      
      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TradeExecution;
