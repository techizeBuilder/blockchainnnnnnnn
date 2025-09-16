
import React from "react";
import { useWallet } from "@/lib/wallet";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy } from "lucide-react";

export function WalletDisplay({ className }: { className?: string }) {
  const { address, balance, truncateAddress, formatBalance, isConnected } = useWallet();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn("w-full", className)}
    >
      <Card className="overflow-hidden bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Wallet Address</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={copyAddress}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      <Copy size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy Address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="font-mono text-sm font-medium">
              {address ? truncateAddress(address) : "Not Connected"}
            </div>
            
            <div className="text-sm text-muted-foreground mt-2">Balance</div>
            <div className="text-lg font-medium">
              {balance ? `${formatBalance(balance)} ETH` : "0 ETH"}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default WalletDisplay;
