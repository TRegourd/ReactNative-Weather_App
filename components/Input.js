import { View, TextInput } from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";

export function Input({
  requestPermissions,
  onChangeText,
  text,
  onPressSearch,
}) {
  return (
    <View style={styleInput.inputContainer}>
      <TouchableOpacity onPress={requestPermissions}>
        <FontAwesome5 name="location-arrow" size={24} color="black" />
      </TouchableOpacity>
      <TextInput
        style={styleInput.input}
        onChangeText={onChangeText}
        value={text}
      />
      <TouchableOpacity onPress={onPressSearch}>
        <FontAwesome name="search" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export const styleInput = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
