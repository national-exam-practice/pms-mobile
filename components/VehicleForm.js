import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Picker } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const vehicleTypes = [
  { label: 'Sedan', value: 'sedan' },
  { label: 'SUV', value: 'suv' },
  { label: 'Truck', value: 'truck' },
  { label: 'Van', value: 'van' },
  { label: 'Hatchback', value: 'hatchback' },
  { label: 'Coupe', value: 'coupe' },
];

const VehicleForm = ({ onSubmit, isSubmitting, submitText, values, setFieldValue, errors, touched }) => {
  return (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Make</Text>
        <TextInput
          style={styles.input}
          value={values.make}
          onChangeText={(text) => setFieldValue('make', text)}
          placeholder="e.g., Toyota"
        />
        {touched?.make && errors?.make && <Text style={styles.error}>{errors.make}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Model</Text>
        <TextInput
          style={styles.input}
          value={values.model}
          onChangeText={(text) => setFieldValue('model', text)}
          placeholder="e.g., Corolla"
        />
        {touched?.model && errors?.model && <Text style={styles.error}>{errors.model}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Year</Text>
        <TextInput
          style={styles.input}
          value={values.year}
          onChangeText={(text) => setFieldValue('year', text)}
          placeholder="e.g., 2020"
          keyboardType="numeric"
        />
        {touched?.year && errors?.year && <Text style={styles.error}>{errors.year}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Type</Text>
        <Picker
          selectedValue={values.type}
          style={styles.picker}
          onValueChange={(itemValue) => setFieldValue('type', itemValue)}
        >
          {vehicleTypes.map((type) => (
            <Picker.Item key={type.value} label={type.label} value={type.value} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mileage (km)</Text>
        <TextInput
          style={styles.input}
          value={values.mileage}
          onChangeText={(text) => setFieldValue('mileage', text)}
          placeholder="e.g., 15000"
          keyboardType="numeric"
        />
        {touched?.mileage && errors?.mileage && <Text style={styles.error}>{errors.mileage}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>License Plate</Text>
        <TextInput
          style={styles.input}
          value={values.licensePlate}
          onChangeText={(text) => setFieldValue('licensePlate', text)}
          placeholder="e.g., ABC123"
        />
        {touched?.licensePlate && errors?.licensePlate && <Text style={styles.error}>{errors.licensePlate}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Service Date</Text>
        <TextInput
          style={styles.input}
          value={values.lastServiceDate}
          onChangeText={(text) => setFieldValue('lastServiceDate', text)}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={values.notes}
          onChangeText={(text) => setFieldValue('notes', text)}
          placeholder="Any additional notes about the vehicle"
          multiline
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={onSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Processing...' : submitText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VehicleForm;