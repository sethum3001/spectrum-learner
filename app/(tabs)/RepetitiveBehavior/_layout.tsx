import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const SocialRepLayout = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Customize your own story", headerShown: false }} />
        <Tabs.Screen name="game" options={{ title: "Lets get started!", headerShown: false }} />
        <Tabs.Screen name="Scorecard" options={{ title: "Progress", headerShown: false }} />

       
        {/* <Tabs.Screen name="game" options={{ title: "Game", headerShown: false }} /> */}
      </Tabs>
    </>
  );
};

export default SocialRepLayout;

const styles = StyleSheet.create({});