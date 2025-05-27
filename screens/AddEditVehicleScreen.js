import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { createVehicle, updateVehicle } from '../api/vehicles';
import VehicleForm from '../components/VehicleForm';

const VehicleSchema = Yup.object().shape({
  make: Yup.string().required('Required'),
  model: Yup.string().required('Required'),
  year: Yup.number()
    .min(1900, 'Too old')
    .max(new Date().getFullYear() + 1, 'Invalid year')
    .required('Required'),
  type: Yup.string().required('Required'),
  mileage: Yup.number().min(0, 'Invalid mileage').required('Required'),
  licensePlate: Yup.string().required('Required'),
});

const AddEditVehicleScreen = ({ navigation, route }) => {
  const { vehicle } = route.params || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      if (vehicle) {
        await updateVehicle(vehicle.id, values);
        Alert.alert('Success', 'Vehicle updated successfully');
      } else {
        await createVehicle(values);
        Alert.alert('Success', 'Vehicle added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          make: vehicle?.make || '',
          model: vehicle?.model || '',
          year: vehicle?.year?.toString() || '',
          type: vehicle?.type || 'sedan',
          mileage: vehicle?.mileage?.toString() || '',
          licensePlate: vehicle?.licensePlate || '',
          lastServiceDate: vehicle?.lastServiceDate || '',
          notes: vehicle?.notes || '',
        }}
        validationSchema={VehicleSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <VehicleForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitText={vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            values={values}
            setFieldValue={setFieldValue}
          />
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
});

export default AddEditVehicleScreen;