import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { BudgetContext } from '../context/BudgetContext';
import { getExpenses } from '../services/api';

const DashboardScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const { getBudgetStatus, checkBudgetLimits } = useContext(BudgetContext);
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
        
        // Calculate total spent
        const total = data.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        setTotalSpent(total);

        // Check budget limits and send notifications if needed
        await checkBudgetLimits(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [checkBudgetLimits]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.name || 'User'}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Spent</Text>
        <Text style={styles.cardAmount}>${totalSpent.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Expenses</Text>
        {expenses.slice(0, 3).map((expense) => (
          <View key={expense.id} style={styles.expenseItem}>
            <Text>{expense.category}: ${expense.amount}</Text>
            <Text>{expense.description}</Text>
          </View>
        ))}
      </View>

      {/* Budget Status Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Budget Status</Text>
        {expenses.length > 0 && (
          <View>
            {['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills'].map((category) => {
              const budgetStatus = getBudgetStatus(category, expenses);
              if (!budgetStatus) return null;
              
              const isOverBudget = budgetStatus.percentage > 100;
              const isNearLimit = budgetStatus.percentage >= 80;
              
              return (
                <View key={category} style={styles.budgetStatusItem}>
                  <View style={styles.budgetHeader}>
                    <Text style={styles.budgetCategory}>{category}</Text>
                    <Text style={[
                      styles.budgetPercentage,
                      isOverBudget && styles.overBudget,
                      isNearLimit && !isOverBudget && styles.nearLimit
                    ]}>
                      {budgetStatus.percentage.toFixed(1)}%
                    </Text>
                  </View>
                  <Text style={styles.budgetDetails}>
                    ${budgetStatus.spent.toFixed(2)} / ${budgetStatus.budget.toFixed(2)}
                    {budgetStatus.remaining > 0 
                      ? ` (${budgetStatus.remaining.toFixed(2)} remaining)`
                      : ` (${Math.abs(budgetStatus.remaining).toFixed(2)} over budget)`
                    }
                  </Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${Math.min(budgetStatus.percentage, 100)}%` },
                        isOverBudget && styles.overBudgetBar,
                        isNearLimit && !isOverBudget && styles.nearLimitBar
                      ]} 
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'tomato',
  },
  expenseItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  budgetStatusItem: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  budgetPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  nearLimit: {
    color: '#ffc107',
  },
  overBudget: {
    color: '#dc3545',
  },
  budgetDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 3,
  },
  nearLimitBar: {
    backgroundColor: '#ffc107',
  },
  overBudgetBar: {
    backgroundColor: '#dc3545',
  },
});

export default DashboardScreen;