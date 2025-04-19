
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = forgotPassword(email);
    
    setIsLoading(false);
    if (success) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-budget-primary text-white mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">MDC-Cast-Budget</h1>
          <p className="text-gray-600 mt-1">Reset your password</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              {submitted
                ? "Check your email for reset instructions"
                : "Enter your email and we'll send you password reset instructions"}
            </CardDescription>
          </CardHeader>
          
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-budget-primary hover:bg-budget-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Send reset instructions'}
                </Button>
                <p className="text-center text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="text-budget-accent hover:underline">
                    Back to login
                  </Link>
                </p>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="bg-green-50 text-green-700 p-4 rounded-md">
                <p>We've sent reset instructions to <strong>{email}</strong>.</p>
                <p className="mt-2">Please check your email inbox.</p>
              </div>
              <div className="text-center pt-2">
                <Link 
                  to="/login" 
                  className="text-budget-accent hover:underline text-sm"
                >
                  Return to login
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
