import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values);
    } catch (error) {
      setErrors({ general: error.message || 'Login failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Management</Text>
      
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ 
          handleSubmit, 
          isSubmitting, 
          errors, 
          handleChange, 
          handleBlur, 
          values,
          touched
        }) => (
          <AuthForm
            fields={[
              { 
                name: 'email', 
                placeholder: 'Email', 
                icon: 'mail',
                keyboardType: 'email-address'
              },
              { 
                name: 'password', 
                placeholder: 'Password', 
                icon: 'lock-closed', 
                secure: true 
              },
            ]}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitText="Login"
            error={errors.general}
            handleChange={handleChange}
            handleBlur={handleBlur}
            values={values}
            touched={touched}
            errors={errors}
          />
        )}
      </Formik>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#3498db',
  },
});

export default LoginScreen;