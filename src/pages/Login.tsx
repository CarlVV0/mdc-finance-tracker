
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = login(email, password);
    
    setIsLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1E90FF] via-[#9B51E0] to-[#E23B84] p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center space-x-6 mb-8">
          <img 
            src="/lovable-uploads/e73439e3-24a6-4ca0-97ab-73947d532fc3.png" 
            alt="MDC Logo" 
            className="w-24 h-24 object-contain"
          />
          <img 
            src="/lovable-uploads/e73439e3-24a6-4ca0-97ab-73947d532fc3.png" 
            alt="Cast Budget Logo" 
            className="w-24 h-24 object-contain"
          />
        </div>
        
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          MDC-CAST BUDGET TRACKER SYSTEM
        </h2>
        
        <Card className="bg-white/90 backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Username</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter your username" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-100 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-100 border-gray-300"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'LOGIN'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="w-full border-[#9B51E0] text-[#9B51E0] hover:bg-[#9B51E0]/10"
                onClick={() => navigate('/signup')}
              >
                SIGN UP
              </Button>
              <Link 
                to="/forgot-password" 
                className="text-sm text-[#E23B84] hover:underline"
              >
                Forgot password?
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
