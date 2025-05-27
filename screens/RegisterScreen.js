import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const RegisterSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf(['USER', 'OWNER'], 'Invalid role')
    .required('Role is required'),
});

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      await register({
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      navigation.navigate('Login', { 
        success: 'Registration successful! Please login.' 
      });
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      
      <Formik
        initialValues={{ 
          firstname: '', 
          lastname: '', 
          email: '', 
          password: '', 
          confirmPassword: '',
          role: 'USER'
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ 
          handleSubmit, 
          isSubmitting, 
          errors, 
          handleChange, 
          handleBlur, 
          values,
          touched,
          setFieldValue
        }) => (
          <>
            <AuthForm
              fields={[
                { 
                  name: 'firstname', 
                  placeholder: 'First Name', 
                  icon: 'person-outline',
                  keyboardType: 'default'
                },
                { 
                  name: 'lastname', 
                  placeholder: 'Last Name', 
                  icon: 'person-outline',
                  keyboardType: 'default'
                },
                { 
                  name: 'email', 
                  placeholder: 'Email Address', 
                  icon: 'mail-outline',
                  keyboardType: 'email-address'
                },
                { 
                  name: 'password', 
                  placeholder: 'Password (min 8 characters)', 
                  icon: 'lock-closed-outline', 
                  secure: true 
                },
                { 
                  name: 'confirmPassword', 
                  placeholder: 'Confirm Password', 
                  icon: 'lock-closed-outline', 
                  secure: true 
                },
              ]}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitText="Register"
              error={errors.general}
              handleChange={handleChange}
              handleBlur={handleBlur}
              values={values}
              touched={touched}
              errors={errors}
            />
            
            {/* Role Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Type</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    values.role === 'USER' && styles.roleButtonSelected
                  ]}
                  onPress={() => setFieldValue('role', 'USER')}
                >
                  <Text style={[
                    styles.roleButtonText,
                    values.role === 'USER' && styles.roleButtonTextSelected
                  ]}>
                    Regular User
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    values.role === 'OWNER' && styles.roleButtonSelected
                  ]}
                  onPress={() => setFieldValue('role', 'OWNER')}
                >
                  <Text style={[
                    styles.roleButtonText,
                    values.role === 'OWNER' && styles.roleButtonTextSelected
                  ]}>
                    Parking Lot Owner
                  </Text>
                </TouchableOpacity>
              </View>
              {touched.role && errors.role && (
                <Text style={styles.fieldError}>{errors.role}</Text>
              )}
            </View>
          </>
        )}
      </Formik>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Sign in here</Text>
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
  inputGroup: {
    marginBottom: 15,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  roleButtonText: {
    color: '#333',
  },
  roleButtonTextSelected: {
    color: 'white',
  },
  fieldError: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default RegisterScreen;