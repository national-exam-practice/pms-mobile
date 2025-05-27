import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native'; // Add this import
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import NewExpenseScreen from '../screens/NewExpenseScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';
import { useAuth } from '../context/AuthContext';
import BudgetScreen from '../screens/BudgetScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// This is to deal with screen  and tab navigation 
const ExpensesStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ExpensesList" 
      component={ExpensesScreen} 
      options={{ title: 'My Expenses' }} 
    />
    <Stack.Screen 
      name="ExpenseDetail" 
      component={ExpenseDetailScreen} 
      options={{ title: 'Expense Details' }} 
    />
    <Stack.Screen 
      name="NewExpense" 
      component={NewExpenseScreen} 
      options={{ title: 'Add Expense' }} 
    />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Dashboard') {
          iconName = focused ? 'ios-home' : 'ios-home-outline';
        } else if (route.name === 'Expenses') {
          iconName = focused ? 'ios-list' : 'ios-list-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Expenses" component={ExpensesStack} />
     <Tab.Screen name="Budgets" component={BudgetScreen}/>
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="App" 
      component={AppTabs} 
      options={{ headerShown: false }} 
    />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <MainStack />}
    </NavigationContainer>
  );
};