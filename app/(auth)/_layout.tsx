import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <View style={styles.container}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Welcome',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="log-in" 
          options={{
            title: 'Login',
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{
            title: 'Register',
          }} 
        />
      </Stack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AuthLayout;

