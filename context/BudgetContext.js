import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { AuthContext } from './AuthContext';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [budgets, setBudgets] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize notifications
  useEffect(() => {
    const setupNotifications = async () => {
      await Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    };

    setupNotifications();
  }, []);

  // Load budgets when user changes
  useEffect(() => {
    if (user) {
      loadBudgets();
    }
  }, [user]);

  const loadBudgets = async () => {
    try {
      const budgetData = await AsyncStorage.getItem(`budgets_${user.id}`);
      if (budgetData) {
        setBudgets(JSON.parse(budgetData));
      }
    } catch (error) {
      console.error('Error loading budgets:', error);
    } finally {
      setIsLoading(false);
    }
  };
// This is to save the budgets
  const saveBudgets = async (newBudgets) => {
    try {
      await AsyncStorage.setItem(`budgets_${user.id}`, JSON.stringify(newBudgets));
      setBudgets(newBudgets);
    } catch (error) {
      console.error('Error saving budgets:', error);
    }
  };

  const setBudget = async (category, amount, notificationThreshold = 80) => {
    const newBudgets = {
      ...budgets,
      [category]: {
        amount: parseFloat(amount),
        notificationThreshold,
        notified: false,
      },
    };
    await saveBudgets(newBudgets);
  };

//   This is to check the buget limits 
  const checkBudgetLimits = async (expenses) => {
    if (!expenses || Object.keys(budgets).length === 0) return;

    const spendingByCategory = expenses.reduce((acc, expense) => {
      const category = expense.category;
      acc[category] = (acc[category] || 0) + parseFloat(expense.amount);
      return acc;
    }, {});

    const updatedBudgets = { ...budgets };
    let hasUpdates = false;

    Object.keys(budgets).forEach((category) => {
      const budget = budgets[category];
      const spent = spendingByCategory[category] || 0;
      const percentage = (spent / budget.amount) * 100;

      if (percentage >= budget.notificationThreshold && !budget.notified) {
        sendBudgetNotification(category, spent, budget.amount, percentage);
        updatedBudgets[category] = { ...budget, notified: true };
        hasUpdates = true;
      }
      
      if (percentage < budget.notificationThreshold && budget.notified) {
        updatedBudgets[category] = { ...budget, notified: false };
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      await saveBudgets(updatedBudgets);
    }
  };

//   This is to send the budget notification
  const sendBudgetNotification = async (category, spent, budgetAmount, percentage) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Budget Alert: ${category}`,
          body: `You've spent $${spent.toFixed(2)} of your $${budgetAmount.toFixed(2)} budget (${percentage.toFixed(1)}%)`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { type: 'budget-alert' },
        },
        trigger: null, 
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

//   This is to delete the budget
  const deleteBudget = async (category) => {
    const newBudgets = { ...budgets };
    delete newBudgets[category];
    await saveBudgets(newBudgets);
  };

  const getBudgetStatus = (category, expenses) => {
    if (!budgets[category]) return null;

    const budget = budgets[category];
    const spent = expenses
      ? expenses
          .filter(expense => expense.category === category)
          .reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
      : 0;

    return {
      budget: budget.amount,
      spent,
      remaining: budget.amount - spent,
      percentage: budget.amount > 0 ? (spent / budget.amount) * 100 : 0,
    };
  };

  return (
    <BudgetContext.Provider value={{
      budgets,
      isLoading,
      setBudget,
      deleteBudget,
      checkBudgetLimits,
      getBudgetStatus,
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};