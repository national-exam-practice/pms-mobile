import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This is the form to show the  details of the expense
const ExpenseItem = ({ expense }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.category}>{expense.category}</Text>
        <Text style={styles.description}>
          {expense.description || 'No description'}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.amount}>${parseFloat(expense.amount).toFixed(2)}</Text>
        <Text style={styles.date}>
          {new Date(expense.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContainer: {
    flex: 2,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  category: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: 'gray',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    color: 'gray',
    fontSize: 12,
  },
});

export default ExpenseItem;