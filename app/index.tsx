import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text className="text-red-500 text-center">
        Edit app/index.tsx to edit this screen.
      </Text>
      <Link href="/home">Go To Home</Link>
    </View>
  );
}
