
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/common/AuthLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { ConnectWalletButton } from "@/components/auth/ConnectWalletButton";
import { WalletDisplay } from "@/components/auth/WalletDisplay";
import { AuthForms } from "@/components/auth/AuthForms";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useWallet } from "@/lib/wallet";

export function Auth() {
  const { isAuthenticated, user, signOut } = useAuth();
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<string>("wallet");

  // If authenticated with email/password, redirect to index page
  if (isAuthenticated && !isConnected) {
    return <Navigate to="/" />;
  }

  return (
    <AuthLayout>
      <AuthForms />
    </AuthLayout>
  );
}

export default Auth;
