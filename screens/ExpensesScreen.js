import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getExpenses } from '../services/api';
import ExpenseItem from '../components/ExpenseItem';
import { AuthContext } from '../context/AuthContext';

const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      // Filter expenses by current user 
      const userExpenses = data.filter(expense => expense.userId === user?.id);
      setExpenses(userExpenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchExpenses();
  };

  const handleAddExpense = () => {
    navigation.navigate('NewExpense');
  };

  const handleExpensePress = (expense) => {
    navigation.navigate('ExpenseDetail', { expenseId: expense.id });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading expenses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Add Expense" onPress={handleAddExpense} />
      
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleExpensePress(item)}>
            <ExpenseItem expense={item} />
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No expenses found. Add your first expense!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default ExpensesScreen;