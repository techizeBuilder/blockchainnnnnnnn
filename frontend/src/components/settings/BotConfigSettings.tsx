
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/lib/toast";

// Define available DEXs for the arbitrage bot
const AVAILABLE_DEXES = [
  { id: "uniswap", name: "Uniswap" },
  { id: "sushiswap", name: "SushiSwap" },
  { id: "pancakeswap", name: "PancakeSwap" },
  { id: "balancer", name: "Balancer" },
  { id: "curve", name: "Curve" },
];

const BotConfigSettings = () => {
  // Strategy settings state
  const [enabledDexes, setEnabledDexes] = useState(
    AVAILABLE_DEXES.map(dex => ({ id: dex.id, enabled: true }))
  );
  const [minProfitThreshold, setMinProfitThreshold] = useState(0.5); // 0.5%

  // Gas fee settings state
  const [gasFee, setGasFee] = useState(50); // Default gas fee (GWEI)
  const [customGasFee, setCustomGasFee] = useState(gasFee.toString());

  // Auto-trading state
  const [autoTrading, setAutoTrading] = useState(false);

  const handleDexToggle = (dexId: string) => {
    setEnabledDexes(
      enabledDexes.map(dex => 
        dex.id === dexId ? { ...dex, enabled: !dex.enabled } : dex
      )
    );
  };

  const handleProfitThresholdChange = (value: number[]) => {
    setMinProfitThreshold(value[0]);
  };

  const handleGasFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomGasFee(e.target.value);
  };

  const applyGasFee = () => {
    const parsedFee = parseInt(customGasFee, 10);
    if (isNaN(parsedFee) || parsedFee < 0) {
      toast.error("Please enter a valid gas fee");
      return;
    }
    setGasFee(parsedFee);
    toast.success("Gas fee updated successfully");
  };

  const handleAutoTradingToggle = () => {
    const newAutoTradingState = !autoTrading;
    setAutoTrading(newAutoTradingState);
    
    toast.success(
      newAutoTradingState 
        ? "Auto-trading enabled" 
        : "Auto-trading disabled"
    );
  };

  const saveSettings = () => {
    // In a real app, you would save these settings to a database or localStorage
    toast.success("Settings saved successfully");
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Arbitrage Strategy Settings</CardTitle>
          <CardDescription>
            Configure which DEXs to use and set profit thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-4">Enabled DEXs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_DEXES.map(dex => (
                <div key={dex.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`dex-${dex.id}`} 
                    checked={enabledDexes.find(d => d.id === dex.id)?.enabled} 
                    onCheckedChange={() => handleDexToggle(dex.id)}
                  />
                  <Label htmlFor={`dex-${dex.id}`}>{dex.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium mb-4">Minimum Profit Threshold</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Only execute trades with at least {minProfitThreshold.toFixed(2)}% profit</p>
                <Slider 
                  value={[minProfitThreshold]} 
                  min={0.1} 
                  max={5} 
                  step={0.1} 
                  onValueChange={handleProfitThresholdChange} 
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.1%</span>
                  <span>5%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gas Fee Settings</CardTitle>
          <CardDescription>
            Configure custom gas fees for your transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Current gas fee: {gasFee} GWEI</p>
            <div className="flex space-x-2">
              <Input 
                type="number" 
                placeholder="Custom gas fee (GWEI)" 
                value={customGasFee}
                onChange={handleGasFeeChange}
              />
              <Button onClick={applyGasFee}>Apply</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Higher gas fees may result in faster transaction confirmation</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auto-Trading</CardTitle>
          <CardDescription>
            Enable or disable automatic execution of profitable arbitrage opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-trading">Auto-Trading</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, the bot will automatically execute trades that meet your profit threshold
              </p>
            </div>
            <Switch 
              id="auto-trading" 
              checked={autoTrading} 
              onCheckedChange={handleAutoTradingToggle}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button onClick={saveSettings}>Save All Settings</Button>
      </div>
    </>
  );
};

export default BotConfigSettings;
