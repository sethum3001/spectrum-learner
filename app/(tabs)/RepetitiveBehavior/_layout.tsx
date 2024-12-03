import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const RepetitiveBehaviorLayout = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Home", headerShown: false }} />
              
        {/* <Tabs.Screen name="game" options={{ title: "Game", headerShown: false }} /> */}
      </Tabs>
    </>
  );
};

export default RepetitiveBehaviorLayout;

const styles = StyleSheet.create({});