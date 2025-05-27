import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BudgetContext } from '../context/BudgetContext';
import { CATEGORIES } from '../constants/config';

const BudgetScreen = () => {
  const { budgets, setBudget, deleteBudget } = useContext(BudgetContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [notificationThreshold, setNotificationThreshold] = useState('80');

  const handleSetBudget = async () => {
    if (!budgetAmount || isNaN(budgetAmount) || parseFloat(budgetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    if (!notificationThreshold || isNaN(notificationThreshold) || 
        parseFloat(notificationThreshold) < 0 || parseFloat(notificationThreshold) > 100) {
      Alert.alert('Error', 'Please enter a valid notification threshold (0-100%)');
      return;
    }

    try {
      await setBudget(selectedCategory, budgetAmount, parseFloat(notificationThreshold));
      setBudgetAmount('');
      setNotificationThreshold('80');
      setModalVisible(false);
      Alert.alert('Success', `Budget set for ${selectedCategory}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to set budget');
    }
  };

  const handleDeleteBudget = (category) => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete the budget for ${category}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBudget(category),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Budget Management</Text>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add New Budget</Text>
        </TouchableOpacity>

        <View style={styles.budgetsList}>
          {Object.keys(budgets).length === 0 ? (
            <Text style={styles.emptyText}>No budgets set yet</Text>
          ) : (
            Object.entries(budgets).map(([category, budget]) => (
              <View key={category} style={styles.budgetItem}>
                <View style={styles.budgetInfo}>
                  <Text style={styles.categoryText}>{category}</Text>
                  <Text style={styles.amountText}>${budget.amount.toFixed(2)}</Text>
                  <Text style={styles.thresholdText}>
                    Alert at {budget.notificationThreshold}%
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteBudget(category)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Budget Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Budget</Text>
            
            <Text style={styles.label}>Category</Text>
            <Picker
              selectedValue={selectedCategory}
              style={styles.picker}
              onValueChange={setSelectedCategory}
            >
              {CATEGORIES.filter(cat => !budgets[cat]).map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>

            <Text style={styles.label}>Budget Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter budget amount"
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Notification Threshold (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="80"
              value={notificationThreshold}
              onChangeText={setNotificationThreshold}
              keyboardType="decimal-pad"
            />
            <Text style={styles.helperText}>
              You'll be notified when spending reaches this percentage
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSetBudget}
              >
                <Text style={styles.saveButtonText}>Save Budget</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
// this is styles 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  budgetsList: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 50,
  },
  budgetItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  budgetInfo: {
    flex: 1,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  amountText: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 2,
  },
  thresholdText: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  saveButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BudgetScreen;