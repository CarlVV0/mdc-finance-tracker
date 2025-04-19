
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, User } from './AuthContext';
import { toast } from "sonner";

// Define the Expense type
export interface Expense {
  id: string;
  date: string;
  itemName: string;
  amount: number;
  yearLevel: string;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

// Define the ExpenseContextType
interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>) => boolean;
  updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>>) => boolean;
  deleteExpense: (id: string) => boolean;
  getTodaysExpenses: () => Expense[];
  getLast7DaysExpenses: () => Expense[];
  getLast30DaysExpenses: () => Expense[];
  getOneYearExpenses: () => Expense[];
  getTotalExpenses: () => number;
  getFilteredExpenses: (filter: object) => Expense[];
}

// Create the ExpenseContext
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Create a provider component
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { currentUser, isAdmin } = useAuth();

  // Load expenses from localStorage
  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Add a new expense
  const addExpense = (expense: Omit<Expense, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>): boolean => {
    if (!currentUser) {
      toast.error('You must be logged in to add an expense');
      return false;
    }

    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setExpenses(prev => [...prev, newExpense]);
    toast.success('Expense added successfully');
    return true;
  };

  // Update an existing expense
  const updateExpense = (id: string, updates: Partial<Omit<Expense, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>>): boolean => {
    if (!currentUser) {
      toast.error('You must be logged in to update an expense');
      return false;
    }

    // Only admin can edit any expense, regular users can only edit their own
    const expenseToUpdate = expenses.find(e => e.id === id);
    if (!expenseToUpdate) {
      toast.error('Expense not found');
      return false;
    }

    if (!isAdmin() && expenseToUpdate.userId !== currentUser.id) {
      toast.error('You can only edit your own expenses');
      return false;
    }

    setExpenses(prev => prev.map(expense => {
      if (expense.id === id) {
        return {
          ...expense,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return expense;
    }));

    toast.success('Expense updated successfully');
    return true;
  };

  // Delete an expense
  const deleteExpense = (id: string): boolean => {
    if (!currentUser) {
      toast.error('You must be logged in to delete an expense');
      return false;
    }

    // Only admin can delete any expense, regular users can only delete their own
    const expenseToDelete = expenses.find(e => e.id === id);
    if (!expenseToDelete) {
      toast.error('Expense not found');
      return false;
    }

    if (!isAdmin() && expenseToDelete.userId !== currentUser.id) {
      toast.error('You can only delete your own expenses');
      return false;
    }

    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast.success('Expense deleted successfully');
    return true;
  };

  // Get expenses for today
  const getTodaysExpenses = (): Expense[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      expenseDate.setHours(0, 0, 0, 0);
      return expenseDate.getTime() === today.getTime();
    });
  };

  // Get expenses for the last 7 days
  const getLast7DaysExpenses = (): Expense[] => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= sevenDaysAgo && expenseDate <= today;
    });
  };

  // Get expenses for the last 30 days
  const getLast30DaysExpenses = (): Expense[] => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= thirtyDaysAgo && expenseDate <= today;
    });
  };

  // Get expenses for the last year
  const getOneYearExpenses = (): Expense[] => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= oneYearAgo && expenseDate <= today;
    });
  };

  // Get total expenses (sum of all amounts)
  const getTotalExpenses = (): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Get filtered expenses based on criteria
  const getFilteredExpenses = (filter: any): Expense[] => {
    return expenses.filter(expense => {
      for (const key in filter) {
        if (filter[key] !== undefined && expense[key as keyof Expense] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
  };

  // Return the provider
  return (
    <ExpenseContext.Provider value={{
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      getTodaysExpenses,
      getLast7DaysExpenses,
      getLast30DaysExpenses,
      getOneYearExpenses,
      getTotalExpenses,
      getFilteredExpenses,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

// Create a hook to use the expense context
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
