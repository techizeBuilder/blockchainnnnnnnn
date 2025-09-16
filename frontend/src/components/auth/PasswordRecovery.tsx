import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "@/lib/toast";

interface PasswordRecoveryProps {
  onBack: () => void;
}

export function PasswordRecovery({ onBack }: PasswordRecoveryProps) {
  const { resetPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    const success = await resetPassword(email);
    
    if (success) {
      setIsSubmitted(true);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-border/40 shadow-subtle">
        <CardHeader>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute left-2 top-2 p-0 w-8 h-8" 
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl pt-4">Reset Password</CardTitle>
          <CardDescription>
            {isSubmitted ? 
              "Check your email for reset instructions" : 
              "Enter your email to receive password reset instructions"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                We've sent an email to <span className="font-medium">{email}</span> with instructions to reset your password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="transition-all duration-200"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Send Reset Instructions
              </Button>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            className="p-0 h-auto text-xs"
            onClick={onBack}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default PasswordRecovery;
