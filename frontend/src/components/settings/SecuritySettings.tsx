
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWallet } from "@/lib/wallet";
import { toast } from "@/lib/toast";

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const { address, isConnected, disconnectWallet, truncateAddress } = useWallet();

  const handleTwoFactorToggle = () => {
    if (!twoFactorEnabled) {
      // When enabling 2FA, show verification dialog
      setShowVerificationDialog(true);
    } else {
      // When disabling 2FA, just update state
      setTwoFactorEnabled(false);
      toast.success("Two-factor authentication disabled");
    }
  };

  const confirmEnableTwoFactor = () => {
    setTwoFactorEnabled(true);
    setShowVerificationDialog(false);
    toast.success("Two-factor authentication enabled");
  };

  const cancelEnableTwoFactor = () => {
    setShowVerificationDialog(false);
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enhance your account security with two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="two-factor">Two-Factor Authentication (2FA)</Label>
              <p className="text-sm text-muted-foreground">
                Adds an additional layer of security to your account
              </p>
            </div>
            <Switch 
              id="two-factor" 
              checked={twoFactorEnabled} 
              onCheckedChange={handleTwoFactorToggle}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Management</CardTitle>
          <CardDescription>
            Manage wallets connected to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <Label>Connected Wallet</Label>
                <div className="flex justify-between items-center">
                  <div className="font-mono text-sm">
                    {address && truncateAddress(address)}
                  </div>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={disconnectWallet}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No wallet connected</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              To enable 2FA, you would need to scan a QR code with your authenticator app and enter the verification code.
              For this demo, we'll simulate this process.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center mb-4">
              <p className="text-sm text-gray-500">QR Code Placeholder</p>
            </div>
            <Input
              className="w-full max-w-xs"
              placeholder="Enter 6-digit verification code"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cancelEnableTwoFactor}>Cancel</Button>
            <Button onClick={confirmEnableTwoFactor}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecuritySettings;
