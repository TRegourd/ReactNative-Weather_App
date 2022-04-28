import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function App() {
  const API_key = "ec9fe52a2e0a6f6f1d61a6988a138b94";
  const [weatherData, setweatherData] = useState();
  const [text, onChangeText] = useState();
  const [inputCity, setInputCity] = useState("Chambery");
  // const weatherLogoUri = `http://openweathermap.org/img/w/${weatherData?.weather[0]?.icon}.png`;

  async function fetchweatherData(city) {
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
    )
      .then((response) => response.json())
      .then((response) => {
        setweatherData(response);
      });
  }

  const onPressSearch = () => {
    setInputCity(text);
  };

  useEffect(() => {
    fetchweatherData(inputCity);
  }, [inputCity]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />
        <TouchableOpacity onPress={onPressSearch}>
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.city}>{weatherData?.name}</Text>
      <View style={styles.tempContainer}>
        <Text style={styles.currentTemp}>
          {Math.round(weatherData?.main?.temp)}°C
        </Text>
        <Image
          style={styles.weatherLogo}
          source={{
            uri: `http://openweathermap.org/img/w/${weatherData?.weather[0]?.icon}.png`,
          }}
        ></Image>
        <Text style={styles.currentWeather}>
          {weatherData?.weather[0]?.main}
        </Text>
        <View style={styles.tempMinMaxContainer}>
          <Text style={styles.tempMinMax}>
            Min {Math.round(weatherData?.main?.temp_min)}°C
          </Text>
          <Text style={styles.tempMinMax}>
            Max {Math.round(weatherData?.main?.temp_max)}°C
          </Text>
        </View>
      </View>
      <View style={styles.windContainer}>
        <FontAwesome5 name="wind" size={24} color="black" />
        <Text style={styles.windText}>
          Wind speed : {Math.round(weatherData?.wind?.speed)} km/h
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  weatherLogo: {
    width: 100,
    height: 100,
  },
  currentWeather: {
    margin: 10,
    fontSize: 20,
  },
  tempContainer: {
    //borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tempMinMaxContainer: {
    //borderWidth: 1,
    display: "flex",
    flexDirection: "row",
  },
  tempMinMax: {
    margin: 10,
    fontSize: 20,
  },
  currentTemp: {
    margin: 10,
    fontSize: 50,
  },
  city: {
    margin: 10,
    fontSize: 30,
  },
  windContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  windText: {
    margin: 10,
  },
});
