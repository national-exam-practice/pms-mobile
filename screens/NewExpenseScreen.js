import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createExpense } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CATEGORIES } from '../constants/config';

const NewExpenseScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.expense) {
      const { expense } = route.params;
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDescription(expense.description);
      setIsEditing(true);
    }
  }, [route.params]);

  const handleSubmit = async () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const expenseData = {
      amount: parseFloat(amount),
      category,
      description,
      userId: user?.id,
      createdAt: date.toISOString(),
    };

    setLoading(true);
    try {
      await createExpense(expenseData);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating expense:', error);
      Alert.alert('Error', 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />
      
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        {CATEGORIES.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>
      
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      
      <Button
        title={isEditing ? "Update Expense" : "Add Expense"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
});

export default NewExpenseScreen;