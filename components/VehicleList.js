import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VehicleList = ({ vehicle, onPress, onEdit, onDelete }) => {
  const confirmDelete = () => {
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle.make} ${vehicle.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => onDelete(vehicle.id), style: 'destructive' },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
          <Text style={styles.subtitle}>{vehicle.year} • {vehicle.licensePlate}</Text>
          <Text style={styles.detail}>Mileage: {vehicle.mileage} km</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => onEdit(vehicle)} style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color="#3498db" />
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelete} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
  },
});

export default VehicleList;