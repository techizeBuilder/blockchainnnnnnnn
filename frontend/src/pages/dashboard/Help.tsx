
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FAQ, FAQItem } from "@/components/help/FAQ";
import { UIShowcase } from "@/components/ui/ui-showcase";

// Sample FAQ data
const faqData: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is cryptocurrency arbitrage?",
    answer: "Cryptocurrency arbitrage is the practice of taking advantage of price differences for the same cryptocurrency across different exchanges or markets to generate profit.",
    tags: ["arbitrage", "basics"]
  },
  {
    id: "faq-2",
    question: "How does the arbitrage bot work?",
    answer: "Our arbitrage bot constantly monitors price discrepancies across multiple exchanges. When it identifies a profitable opportunity, it executes trades automatically to capture the price difference.",
    tags: ["bot", "functionality"]
  },
  {
    id: "faq-3",
    question: "What fees are associated with arbitrage trading?",
    answer: "Arbitrage trading involves exchange fees, network transaction fees, and potentially slippage. Our bot factors these costs into its calculations to ensure profitable trades.",
    tags: ["fees", "trading"]
  },
  {
    id: "faq-4",
    question: "Is arbitrage trading risk-free?",
    answer: "While arbitrage is generally lower risk than other trading strategies, it still involves risks such as market volatility, execution delays, and technical issues. Our bot implements risk management strategies to minimize these risks.",
    tags: ["risk", "trading"]
  },
  {
    id: "faq-5",
    question: "How do I configure the bot settings?",
    answer: "You can configure the bot settings in the Settings page. There, you can adjust parameters such as minimum profit threshold, maximum trade size, and target exchanges.",
    tags: ["configuration", "settings"]
  }
];

const HelpPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Help & Support</h1>
      
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="components">UI Components</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <FAQ faqs={faqData} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="components" className="mt-4">
          <UIShowcase />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpPage;
