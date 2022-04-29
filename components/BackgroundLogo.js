import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function BackgroundLogo() {
  return (
    <View>
      <Text>BackgroundLogo</Text>
      <Feather name="sun" size={24} color="black" />
    </View>
  );
}
