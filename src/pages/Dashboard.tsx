
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useExpense } from '@/contexts/ExpenseContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Edit, BarChart2, Calendar, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { 
    getTodaysExpenses, 
    getLast7DaysExpenses, 
    getLast30DaysExpenses, 
    getOneYearExpenses, 
    getTotalExpenses 
  } = useExpense();
  const { isAdmin } = useAuth();
  
  const todaysExpenses = getTodaysExpenses();
  const last7DaysExpenses = getLast7DaysExpenses();
  const last30DaysExpenses = getLast30DaysExpenses();
  const oneYearExpenses = getOneYearExpenses();
  const totalExpenses = getTotalExpenses();
  
  const todaysTotal = todaysExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const last7DaysTotal = last7DaysExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const last30DaysTotal = last30DaysExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const oneYearTotal = oneYearExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to your budget dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Expenses */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Today's Expenses</CardTitle>
              <div className="bg-blue-100 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-budget-primary" />
              </div>
            </div>
            <CardDescription>
              Total spent today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-budget-primary mb-2">
                {formatCurrency(todaysTotal)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <span>{todaysExpenses.length} transactions</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Last 7 Days Expenses */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Last 7 Days</CardTitle>
              <div className="bg-purple-100 p-2 rounded-full">
                <BarChart2 className="h-5 w-5 text-budget-secondary" />
              </div>
            </div>
            <CardDescription>
              Expenses for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-budget-secondary mb-2">
                {formatCurrency(last7DaysTotal)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <span>{last7DaysExpenses.length} transactions</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Last 30 Days Expenses */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Last 30 Days</CardTitle>
              <div className="bg-blue-100 p-2 rounded-full">
                <BarChart2 className="h-5 w-5 text-budget-info" />
              </div>
            </div>
            <CardDescription>
              Monthly expense overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-budget-info mb-2">
                {formatCurrency(last30DaysTotal)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <span>{last30DaysExpenses.length} transactions</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* One Year Expenses */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">One Year Expenses</CardTitle>
              <div className="bg-green-100 p-2 rounded-full">
                <BarChart2 className="h-5 w-5 text-budget-success" />
              </div>
            </div>
            <CardDescription>
              Annual spending overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-budget-success mb-2">
                {formatCurrency(oneYearTotal)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <span>{oneYearExpenses.length} transactions</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Total Expenses */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Total Expenses</CardTitle>
              <div className="bg-yellow-100 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-budget-warning" />
              </div>
            </div>
            <CardDescription>
              All-time spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-budget-warning mb-2">
                {formatCurrency(totalExpenses)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <span>Lifetime total</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Expenses */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Expenses</h2>
          <Link to="/expenses/reports">
            <Button variant="outline" className="text-budget-primary border-budget-primary">
              <span>View All</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-500">Date</th>
                    <th className="text-left p-4 font-medium text-gray-500">Item</th>
                    <th className="text-left p-4 font-medium text-gray-500">Amount</th>
                    <th className="text-left p-4 font-medium text-gray-500">Added By</th>
                    {isAdmin() && <th className="text-right p-4 font-medium text-gray-500">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {last7DaysExpenses.slice(0, 5).map((expense) => (
                    <tr key={expense.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-4">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">{expense.itemName}</td>
                      <td className="p-4 font-medium">{formatCurrency(expense.amount)}</td>
                      <td className="p-4 text-gray-500">{expense.userName}</td>
                      {isAdmin() && (
                        <td className="p-4 text-right">
                          <Link to={`/expenses/${expense.id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))}
                  
                  {last7DaysExpenses.length === 0 && (
                    <tr>
                      <td colSpan={isAdmin() ? 5 : 4} className="p-4 text-center text-gray-500">
                        No recent expenses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center mt-8">
        <Link to="/expenses/add">
          <Button className="bg-budget-primary hover:bg-budget-primary/90">
            <Calendar className="h-4 w-4 mr-2" />
            Add New Expense
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Dashboard;
