
import React, { useState, useEffect } from "react";
import LivePriceFeed from "@/components/dashboard/LivePriceFeed";
import ArbitrageTable from "@/components/dashboard/ArbitrageTable";
import ArbitrageOpportunityCard from "@/components/dashboard/ArbitrageOpportunityCard";
import { generatePriceData, generateArbitrageOpportunities } from "@/lib/mockData";
import { ArbitrageOpportunity, PriceData } from "@/types/arbitrage";
import { toast } from "@/lib/toast";
import TransactionDetailsModal from "@/components/dashboard/TransactionDetailsModal";

const ArbitrageOpportunities: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<ArbitrageOpportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    fetchPriceData();
    fetchOpportunities();

    const priceInterval = setInterval(fetchPriceData, 5000);
    const opportunitiesInterval = setInterval(fetchOpportunities, 10000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(opportunitiesInterval);
    };
  }, []);

  const fetchPriceData = () => {
    setPriceData(generatePriceData());
  };

  const fetchOpportunities = () => {
    setOpportunities(generateArbitrageOpportunities());
  };

  const handleExecuteTrade = (opportunity: ArbitrageOpportunity) => {
    toast.success(`Executing trade for ${opportunity.tokenPair} with estimated profit of $${opportunity.estimatedProfit.toFixed(2)}`);

    // In a real application, this would trigger a trade execution
    // and redirect to the trade execution page or show confirmation
  };

  return (
    <div className="space-y-6">
      <LivePriceFeed />

      <ArbitrageTable />

      <h2 className="text-2xl font-bold mt-8 mb-4">Featured Opportunities</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.slice(0, 3).map((opportunity) => (
          <ArbitrageOpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onExecute={handleExecuteTrade}
          />
        ))}
      </div>
    </div>
  );
};

export default ArbitrageOpportunities;
