import { StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

const SocialRepLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the header
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Learning",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="question"
        options={{
          title: "Game Time",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller-outline" size={size} color={color} />
          ),
        }}
      />
     
      
      {/* Add other screens here */}
    </Tabs>
  );
};

export default SocialRepLayout;
