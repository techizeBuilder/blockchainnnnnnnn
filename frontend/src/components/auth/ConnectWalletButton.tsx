
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { useWallet } from "@/lib/wallet";
import { motion } from "framer-motion";

export function ConnectWalletButton() {
  const { isConnected, connectWallet, disconnectWallet, isConnecting } = useWallet();

  const handleClick = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={handleClick}
        className="relative overflow-hidden w-full group transition-all duration-300"
        variant={isConnected ? "outline" : "default"}
        size="lg"
        disabled={isConnecting}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        
        {isConnecting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wallet className="mr-2 h-4 w-4" />
        )}
        
        {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
      </Button>
    </motion.div>
  );
}

export default ConnectWalletButton;
