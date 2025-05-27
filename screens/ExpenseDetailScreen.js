import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { getExpense, deleteExpense } from '../services/api';

const ExpenseDetailScreen = ({ route, navigation }) => {
  const { expenseId } = route.params;
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const data = await getExpense(expenseId);
        setExpense(data);
      } catch (error) {
        console.error('Error fetching expense:', error);
        Alert.alert('Error', 'Failed to load expense details');
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId]);

  const handleDelete = async () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expenseId);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={styles.container}>
        <Text>Expense not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>${expense.amount}</Text>
      </View>
      
      <View style={styles.detailItem}>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{expense.category}</Text>
      </View>
      
      <View style={styles.detailItem}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{new Date(expense.createdAt).toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.detailItem}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{expense.description || 'N/A'}</Text>
      </View>
      
      <Button 
        title="Edit" 
        onPress={() => navigation.navigate('NewExpense', { expense })} 
      />
      
      <Button 
        title="Delete" 
        onPress={handleDelete} 
        color="red"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
});

export default ExpenseDetailScreen;