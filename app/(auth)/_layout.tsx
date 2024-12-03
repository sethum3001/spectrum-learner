// import { View, Text } from 'react-native'
// import React from 'react'

// const LoginLayout = () => {
//   return (
//     <View>
//       <Text>LoginLayout</Text>
//     </View>
//   )
// }

// export default LoginLayout


import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

const LoginLayout = () => {
  return (
    <View style={styles.container}>
      <Stack>
        {/* <Stack.Screen 
          name="index" 
          options={{
            title: 'Welcome',
            headerShown: false,
          }} 
        /> */}
        <Stack.Screen 
          name="log-in" 
          
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

export default LoginLayout;

