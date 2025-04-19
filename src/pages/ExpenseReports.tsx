
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useExpense, Expense } from '@/contexts/ExpenseContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Edit, 
  FileText, 
  Plus, 
  Search,
  Trash2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ExpenseReports = () => {
  const { expenses, deleteExpense } = useExpense();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Expense>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(expense => 
    expense.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.yearLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortField === 'amount') {
      return sortDirection === 'asc' 
        ? (a.amount - b.amount) 
        : (b.amount - a.amount);
    }
    
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime() 
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
  
  const handleSort = (field: keyof Expense) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getSortIcon = (field: keyof Expense) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
      setExpenseToDelete(null);
      setIsDialogOpen(false);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Expense Reports</h1>
        <p className="text-gray-600">View and manage all your expenses</p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
            <div className="w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search expenses..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-80"
                />
              </div>
            </div>
            <Link to="/expenses/add">
              <Button className="bg-budget-primary hover:bg-budget-primary/90 w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th 
                    className="text-left p-4 font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date {getSortIcon('date')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('itemName')}
                  >
                    <div className="flex items-center">
                      Item {getSortIcon('itemName')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      Amount {getSortIcon('amount')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('yearLevel')}
                  >
                    <div className="flex items-center">
                      Year Level {getSortIcon('yearLevel')}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('userName')}
                  >
                    <div className="flex items-center">
                      Added By {getSortIcon('userName')}
                    </div>
                  </th>
                  {(isAdmin() || true) && (
                    <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {sortedExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">{expense.itemName}</td>
                    <td className="p-4 font-medium">{formatCurrency(expense.amount)}</td>
                    <td className="p-4">{expense.yearLevel}</td>
                    <td className="p-4 text-gray-500">{expense.userName}</td>
                    {(isAdmin() || true) && (
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/expenses/${expense.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          
                          {isAdmin() && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 hover:text-red-700"
                              onClick={() => {
                                setExpenseToDelete(expense.id);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                
                {sortedExpenses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(sortedExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-budget-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    sortedExpenses
                      .filter(exp => {
                        const expenseDate = new Date(exp.date);
                        const today = new Date();
                        return expenseDate.getMonth() === today.getMonth() &&
                               expenseDate.getFullYear() === today.getFullYear();
                      })
                      .reduce((sum, exp) => sum + exp.amount, 0)
                  )}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-budget-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Per Day</p>
                <p className="text-2xl font-bold">
                  {sortedExpenses.length > 0
                    ? formatCurrency(
                        sortedExpenses.reduce((sum, exp) => sum + exp.amount, 0) / 
                        Math.max(
                          1, 
                          new Set(
                            sortedExpenses.map(exp => 
                              new Date(exp.date).toDateString()
                            )
                          ).size
                        )
                      )
                    : formatCurrency(0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-budget-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ExpenseReports;
