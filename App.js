import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppNavigator } from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BudgetProvider } from './context/BudgetContext';
import * as Notifications from 'expo-notifications';

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  useEffect(() => {
    // Request permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('You need to enable notifications for budget alerts');
      }
    };

    requestPermissions();

    // Handle notifications that caused the app to open
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification opened the app:', response);
    });

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BudgetProvider>
          <AppNavigator />
        </BudgetProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}