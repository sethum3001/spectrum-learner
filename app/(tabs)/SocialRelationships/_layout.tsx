import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text } from "react-native";

const getTabOptions = (iconName: "book-open" | "dribbble" | "help-circle", label: string) => ({
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <Feather name={iconName} size={size} color={color} />
  ),
  tabBarLabel: ({ focused, color }: { focused: boolean; color: string }) =>
    focused ? <Text style={{ color }}>{label}</Text> : null,
});

const SocialRepLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarLabelPosition: "beside-icon",
        tabBarStyle: {
          backgroundColor: "#ABC8A2",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Learning",
          ...getTabOptions("book-open", "Learning"),
        }}
      />
      <Tabs.Screen
        name="question"
        options={{
          title: "Game Time",
          ...getTabOptions("dribbble", "Game Time"),
        }}
      />
      <Tabs.Screen
        name="evaluation"
        options={{
          title: "Evaluate",
          ...getTabOptions("help-circle", "Evaluate"),
        }}
      />

    </Tabs>
  );
};

export default SocialRepLayout;
