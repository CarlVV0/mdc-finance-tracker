
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call signup with the correct parameter order: email, password, name
      await signup(email, password, name);
      // Navigate after successful signup
      navigate('/login');
    } catch (error: any) {
      setError(error.message || 'Failed to create an account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1E90FF] via-[#9B51E0] to-[#E23B84] p-4 rounded-none py-0 px-0">
      <div className="max-w-md w-full">
        <div className="flex justify-center space-x-6 mb-8">
          <img src="/lovable-uploads/e73439e3-24a6-4ca0-97ab-73947d532fc3.png" alt="MDC Logo" className="w-24 h-24 object-contain" />
          <img src="/lovable-uploads/e73439e3-24a6-4ca0-97ab-73947d532fc3.png" alt="Cast Budget Logo" className="w-24 h-24 object-contain" />
        </div>
        
        <h2 className="text-center text-3xl font-bold text-white mb-6">
          MDC-CAST BUDGET TRACKER SYSTEM
        </h2>
        
        <Card className="glass mx-0 px-0 py-0 my-0 rounded-2xl">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/20 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/20 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white/20 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'CREATE ACCOUNT'}
              </Button>
              <p className="text-center text-sm text-white">
                Already have an account?{' '}
                <Link to="/login" className="text-[#E23B84] hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
