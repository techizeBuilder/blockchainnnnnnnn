
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BotConfigSettings from "@/components/settings/BotConfigSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Configure your arbitrage bot and manage your account settings
        </p>
      </div>

      <Tabs defaultValue="bot" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="bot">Bot Configuration</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bot" className="space-y-6">
          <BotConfigSettings />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
