
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left side: Visual background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden md:block relative bg-gradient-to-br from-primary/5 to-primary/20 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full filter blur-3xl animate-pulse-subtle" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="absolute inset-0 flex flex-col items-start justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="text-4xl font-bold mb-6">Welcome to Wallet Auth Factory</h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Connect your wallet or sign in with your email to access your account.
            </p>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Right side: Authentication content */}
      <div className={cn(
        "flex flex-col items-center justify-center p-6 md:p-12",
        "bg-gradient-to-b from-background to-muted/30 md:from-transparent md:to-transparent"
      )}>
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
