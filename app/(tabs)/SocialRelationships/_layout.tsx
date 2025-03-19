import { StyleSheet } from "react-native";
import React from "react";
import { Tabs, usePathname } from "expo-router";

const SocialRepLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the header
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Social Scenario Generator?" }} />
      <Tabs.Screen name="question" options={{ title: "Social Scenario Generasdasdator?" }} />
      {/* Add other screens here */}
    </Tabs>
  );
};

export default SocialRepLayout;

// const styles = StyleSheet.create({});