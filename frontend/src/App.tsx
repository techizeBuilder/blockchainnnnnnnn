
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ArbitrageOpportunities from "./pages/dashboard/ArbitrageOpportunities";
import TradeExecution from "./pages/dashboard/TradeExecution";
import ProfitLossOverview from "./pages/dashboard/ProfitLossOverview";
import Settings from "./pages/dashboard/Settings";
import Analytics from "./pages/dashboard/Analytics";
import HelpPage from "./pages/dashboard/Help";
import DecXPage from "./pages/DecXPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<ArbitrageOpportunities />} />
            <Route path="arbitrage" element={<ArbitrageOpportunities />} />
            <Route path="decx" element={<DecXPage />} />
            <Route path="trades" element={<TradeExecution />} />
            <Route path="profit-loss" element={<ProfitLossOverview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
