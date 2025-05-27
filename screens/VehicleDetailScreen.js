import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VehicleDetailScreen = ({ route }) => {
  const { vehicle } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{vehicle.make} {vehicle.model} ({vehicle.year})</Text>
        
        <View style={styles.detailRow}>
          <Ionicons name="car-sport" size={20} color="#666" />
          <Text style={styles.detailText}>Type: {vehicle.type}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="speedometer" size={20} color="#666" />
          <Text style={styles.detailText}>Mileage: {vehicle.mileage} km</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={20} color="#666" />
          <Text style={styles.detailText}>Last Service: {vehicle.lastServiceDate || 'Not recorded'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="document-text" size={20} color="#666" />
          <Text style={styles.detailText}>License Plate: {vehicle.licensePlate}</Text>
        </View>
        
        {vehicle.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{vehicle.notes}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  notesContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  notesText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});

export default VehicleDetailScreen;