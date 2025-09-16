
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "@/lib/toast";

export function UIShowcase() {
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Operation completed successfully!");
    }, 2000);
  };

  const simulateError = () => {
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 5000);
  };

  const handleConfirmAction = () => {
    toast.success("Action confirmed and executed!");
    setConfirmDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="loading" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="loading">Loading Spinners</TabsTrigger>
          <TabsTrigger value="errors">Error Messages</TabsTrigger>
          <TabsTrigger value="tooltips">Tooltips</TabsTrigger>
          <TabsTrigger value="modals">Confirmation Modals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="loading" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Loading Spinners</CardTitle>
              <CardDescription>
                Display loading spinners during async operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center space-y-2">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm text-muted-foreground">Small</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <LoadingSpinner size="md" />
                  <span className="text-sm text-muted-foreground">Medium</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <LoadingSpinner size="lg" />
                  <span className="text-sm text-muted-foreground">Large</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center space-y-2">
                  <LoadingSpinner size="md" variant="default" />
                  <span className="text-sm text-muted-foreground">Default</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <LoadingSpinner size="md" variant="primary" />
                  <span className="text-sm text-muted-foreground">Primary</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <LoadingSpinner size="md" variant="secondary" />
                  <span className="text-sm text-muted-foreground">Secondary</span>
                </div>
              </div>
              
              <div className="border rounded-md p-4 relative min-h-[100px]">
                {isLoading ? (
                  <LoadingSpinner fullPage={false} text="Processing transaction..." />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    Content will appear here after loading
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={simulateLoading} disabled={isLoading}>
                {isLoading ? "Loading..." : "Simulate Loading"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Messages</CardTitle>
              <CardDescription>
                Display error messages for failed operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showError && (
                <ErrorMessage 
                  title="Transaction Failed" 
                  message="Unable to complete the transaction due to network issues."
                  variant="alert"
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Button 
                  variant="secondary" 
                  onClick={() => ErrorMessage.showToast("API request failed", "Error 500")}
                >
                  Show Error Toast
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={simulateError}
                >
                  Show Error Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tooltips" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tooltips</CardTitle>
              <CardDescription>
                Provide additional context with tooltips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-8 justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Help information</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Additional information about this feature</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <AlertTriangle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Warning: This action cannot be undone</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verification successful</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="modals" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Confirmation Modals</CardTitle>
              <CardDescription>
                Request user confirmation before critical actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => setConfirmDialogOpen(true)}
                >
                  Standard Confirmation
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={() => setConfirmDialogOpen(true)}
                >
                  Destructive Action
                </Button>
              </div>
              
              <ConfirmationDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
                title="Confirm Action"
                description="Are you sure you want to proceed with this action? This cannot be undone."
                confirmText="Yes, proceed"
                cancelText="Cancel"
                onConfirm={handleConfirmAction}
                variant="destructive"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
