import { Feather } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { Text } from "react-native"

const getTabOptions = (iconName: "home" | "user" | "help-circle", label: string) => ({
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <Feather name={iconName} size={size} color={color} />
  ),
  tabBarLabel: ({ focused, color }: { focused: boolean; color: string }) =>
    focused ? <Text style={{ color }}>{label}</Text> : null,
})

const TabsLayout = () => {
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
        name="home"
        options={{
          title: "Home",
          ...getTabOptions("home", "Home"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          ...getTabOptions("user", "Profile"),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "Help",
          ...getTabOptions("help-circle", "Help"),
        }}
      />
    </Tabs>
  )
}

export default TabsLayout
