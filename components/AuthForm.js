import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AuthForm = ({ 
  fields, 
  onSubmit, 
  isSubmitting, 
  submitText, 
  error,
  handleChange,
  handleBlur,
  values,
  touched,
  errors
}) => {
  return (
    <View style={styles.formContainer}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {fields.map((field) => (
        <View key={field.name} style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <Ionicons 
              name={field.icon} 
              size={20} 
              color="#666" 
              style={styles.icon} 
            />
            <TextInput
              style={styles.input}
              placeholder={field.placeholder}
              secureTextEntry={field.secure}
              onChangeText={handleChange(field.name)}
              onBlur={handleBlur(field.name)}
              value={values[field.name]}
              autoCapitalize={field.autoCapitalize || 'none'}
              keyboardType={field.keyboardType || 'default'}
            />
          </View>
          {touched[field.name] && errors[field.name] && (
            <Text style={styles.fieldError}>{errors[field.name]}</Text>
          )}
        </View>
      ))}

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
    width: '100%',
    marginBottom: 15,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  fieldError: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AuthForm;