
import React, { useState } from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  ChartBar,
  ArrowRightLeft,
  ListFilter,
  LogOut,
  Settings,
  BarChart2,
  HelpCircle,
  Wallet,
  Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { useNavigate } from "react-router-dom";
import NetworkDropdown from "@/components/MainComponents/NetworkDropdown";
import WalletModal from "@/components/MainComponents/WalletModal";
import { useAuth } from "@/lib/auth";
import LogoutButton from "@/components/common/LogoutButton";

const Dashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { signOut, isAuthenticated, user, isLoading } = useAuth();

  const navigate = useNavigate();

  console.log("is auth, user in dashboard : ", isAuthenticated, user)


  if (isLoading) {
    return <div className="text-center text-gray-600 dark:text-gray-300 mt-10">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" />;
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Arbitrage Bot Dashboard</h1>
          <div className="flex flex-row gap-4">
            <NetworkDropdown />
            <Button
              onClick={() => setModalOpen(true)}
              variant="outline"
              className="flex items-center space-x-2 bg-transparent border text-gray-800 hover:text-gray-900 transition-colors px-3  py-2 rounded-md"
            >
              Wallet <Wallet className="h-4 w-4" />
            </Button>
            <LogoutButton />
          </div>

        </header>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <Card className="p-4 h-screen overflow-y-auto">
              <nav className="space-y-2">
                <NavLink
                  to="/dashboard/arbitrage"
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`
                  }
                >
                  <ListFilter className="mr-2 h-5 w-5" />
                  Arbitrage Opportunities
                </NavLink>
                <NavLink
                  to="/dashboard/decx"
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`
                  }
                >
                  <Network className="mr-2 h-5 w-5" />
                  Networks DEX
                </NavLink>
                <NavLink
                  to="/dashboard/trades"
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`
                  }
                >
                  <ArrowRightLeft className="mr-2 h-5 w-5" />
                  Trade Execution
                </NavLink>
                <NavLink
                  to="/dashboard/profit-loss"
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`
                  }
                >
                  <ChartBar className="mr-2 h-5 w-5" />
                  Profit/Loss Overview
                </NavLink>
                <NavLink
                  to="/dashboard/analytics"
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`
                  }
                >
                  <BarChart2 className="mr-2 h-5 w-5" />
                  Analytics
                </NavLink>
                <NavLink
                  to="/dashboard/help"
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`
                  }
                >
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Help & Support
                </NavLink>
                <NavLink
                  to="/dashboard/settings"
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`
                  }
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </NavLink>
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-4">
            <Outlet />
          </main>
        </div>
      </div>
      {/* Wallet Modal */}
      <WalletModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
