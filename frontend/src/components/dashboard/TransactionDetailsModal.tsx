
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/arbitrage";
import { ExternalLink } from "lucide-react";

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Detailed information about this arbitrage transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium">Token Pair:</div>
            <div className="col-span-2">{transaction.tokenPair}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium">Buy Exchange:</div>
            <div className="col-span-2">{transaction.buyDex}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium">Buy Price:</div>
            <div className="col-span-2">${transaction.buyPrice.toFixed(4)}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium">Sell Exchange:</div>
            <div className="col-span-2">{transaction.sellDex}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium">Sell Price:</div>
            <div className="col-span-2">${transaction.sellPrice.toFixed(4)}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium">Profit/Loss:</div>
            <div className={`col-span-2 ${transaction.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.profit > 0 ? '+' : ''}{transaction.profit.toFixed(4)} USD ({transaction.profitPercentage.toFixed(2)}%)
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium">Status:</div>
            <div className="col-span-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}
              >
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium">Timestamp:</div>
            <div className="col-span-2">{new Date(transaction.timestamp).toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium">Transaction Hash:</div>
            <div className="col-span-2 truncate">
              <a 
                href={`https://etherscan.io/tx/${transaction.hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center"
              >
                {transaction.hash.substring(0, 16)}...
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
          {transaction.gasUsed && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium">Gas Used:</div>
              <div className="col-span-2">{transaction.gasUsed.toLocaleString()} gas units</div>
            </div>
          )}
          {transaction.gasPrice && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-sm font-medium">Gas Price:</div>
              <div className="col-span-2">{transaction.gasPrice} Gwei</div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsModal;
