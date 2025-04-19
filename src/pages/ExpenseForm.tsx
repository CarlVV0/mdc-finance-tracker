
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useExpense, Expense } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ExpenseForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { expenses, addExpense, updateExpense } = useExpense();
  
  const [date, setDate] = useState<Date>(new Date());
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isEditMode && id) {
      const expenseToEdit = expenses.find(e => e.id === id);
      if (expenseToEdit) {
        setDate(new Date(expenseToEdit.date));
        setItemName(expenseToEdit.itemName);
        setAmount(expenseToEdit.amount.toString());
        setYearLevel(expenseToEdit.yearLevel);
      }
    }
  }, [isEditMode, id, expenses]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const expenseData = {
      date: date.toISOString(),
      itemName,
      amount: parseFloat(amount),
      yearLevel,
    };
    
    let success;
    if (isEditMode && id) {
      success = updateExpense(id, expenseData);
    } else {
      success = addExpense(expenseData);
    }
    
    setIsLoading(false);
    if (success) {
      navigate('/expenses/reports');
    }
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Expense' : 'Add Expense'}</h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update expense details' : 'Add a new expense to your budget'}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Edit Expense' : 'New Expense'}</CardTitle>
            <CardDescription>
              {isEditMode 
                ? 'Update the information for this expense' 
                : 'Fill in the details for your new expense'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => setDate(newDate || new Date())}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input 
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g., Groceries, Rent, Utilities"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₱</span>
                  </div>
                  <Input 
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearLevel">Year Level</Label>
                <Input 
                  id="yearLevel"
                  value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}
                  placeholder="e.g., Year 1, Year 2, etc."
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-budget-primary hover:bg-budget-primary/90"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isEditMode ? 'Updating...' : 'Adding...') 
                  : (isEditMode ? 'Update Expense' : 'Add Expense')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ExpenseForm;
