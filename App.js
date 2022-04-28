import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import baseData from "./baseData.json";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const API_key = "5b1df37e12349a8c845b6a52a7b374cc";
  const [weatherData, setweatherData] = useState();
  const [forecastData, setForecastData] = useState([]);
  const [text, onChangeText] = useState();
  const [inputCity, setInputCity] = useState();
  const [location, setLocation] = useState(null);
  // const weatherLogoUri = `http://openweathermap.org/img/w/${weatherData?.weather[0]?.icon}.png`;

  // const localWeatherData = getWeatherData();
  // console.log(localWeatherData);

  const requestPermissions = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchweatherDataByLocation(location);
    } else {
      setErrorMsg("Permission to access location was denied");
      return;
    }
  };

  async function fetchweatherDataByLocation(location) {
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&appid=${API_key}&units=metric`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.cod === 200) {
          setweatherData(response);
        }
      });
  }

  const storeWeatherData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@weather", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const getWeatherData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@weather");
      console.log("JSON local", JSON.parse(jsonValue));
      return jsonValue != null ? setweatherData(JSON.parse(jsonValue)) : null;
    } catch (e) {
      console.log(e);
    }
  };

  const storeForecastData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@forecast", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const getForecastData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@forecast");
      console.log("JSON local", JSON.parse(jsonValue));
      return jsonValue != null ? setForecastData(JSON.parse(jsonValue)) : null;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getWeatherData();
    getForecastData();
  }, []);

  useEffect(() => {
    storeWeatherData(weatherData);
  }, [weatherData]);

  useEffect(() => {
    storeForecastData(forecastData);
  }, [forecastData]);

  async function fetchForecastDataByLocation(location) {
    await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${location?.coords.latitude}&lon=${location?.coords.longitude}&appid=${API_key}&units=metric`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.cod === "200") {
          let newList = response.list;
          setForecastData(newList);
        }
      });
  }

  async function fetchweatherDataByCity(city) {
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.cod === 200) {
          setweatherData(response);
        }
      });
  }

  async function fetchForecastDataByCity(city) {
    await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}&units=metric`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.cod === "200") {
          let newList = response.list;
          setForecastData(newList);
        }
      });
  }

  const onPressSearch = () => {
    setInputCity(text);
  };

  useEffect(() => {
    fetchweatherDataByLocation(location);
    fetchForecastDataByLocation(location);
  }, [location]);

  useEffect(() => {
    fetchweatherDataByCity(inputCity);
    fetchForecastDataByCity(inputCity);
  }, [inputCity]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={requestPermissions}>
          <FontAwesome5 name="location-arrow" size={24} color="black" />
        </TouchableOpacity>
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
        />
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
      <Text style={styles.forecastTitle}>5 days forecast</Text>
      <ScrollView horizontal={true} style={styles.forecastScrollContainer}>
        {forecastData.map((forecast) => {
          return (
            <View key={forecast.dt_txt} style={styles.forecast}>
              <Text>{dayjs(forecast.dt_txt).hour()}h</Text>
              <Image
                style={styles.forecastLogo}
                source={{
                  uri: `http://openweathermap.org/img/w/${forecast?.weather[0]?.icon}.png`,
                }}
              />
              <Text style={styles.currentForecast}>
                {forecast?.weather[0]?.main}
              </Text>
              <View style={styles.forecastMinMaxContainer}>
                <Text style={styles.forecastMinMax}>
                  Min {Math.round(forecast?.main?.temp_min)}°C
                </Text>
                <Text style={styles.forecastMinMax}>
                  Max {Math.round(forecast?.main?.temp_max)}°C
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
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
    borderWidth: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  weatherLogo: {
    width: 100,
    height: 100,
    borderWidth: 1,
  },
  currentWeather: {
    margin: 10,
    fontSize: 20,
    borderWidth: 1,
  },
  tempContainer: {
    //borderWidth: 1,
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
  },
  tempMinMaxContainer: {
    //borderWidth: 1,
    flexDirection: "row",
    borderWidth: 1,
  },
  tempMinMax: {
    margin: 10,
    fontSize: 20,
    borderWidth: 1,
  },
  currentTemp: {
    margin: 10,
    fontSize: 50,
    borderWidth: 1,
  },
  city: {
    margin: 10,
    fontSize: 30,
    borderWidth: 1,
  },
  windContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  windText: {
    margin: 10,
    borderWidth: 1,
  },

  forecastContainer: {
    margin: 10,
    borderWidth: 1,
  },

  forecastScrollContainer: {
    margin: 10,
    flexWrap: "wrap",
    borderWidth: 1,
  },

  forecast: {
    flexDirection: "column",
    alignItems: "center",
    margin: 5,
    borderRadius: 10,
    flexWrap: "wrap",
    backgroundColor: "#e9ecef",
    borderWidth: 1,
  },
  forecastLogo: {
    width: 50,
    height: 50,
    borderWidth: 1,
  },
  currentForecast: {
    margin: 10,
    fontSize: 10,
    borderWidth: 1,
  },
  forecastMinMaxContainer: {
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
  },
  forecastMinMax: {
    margin: 2,
    fontSize: 10,
    borderWidth: 1,
  },

  forecastTitle: {
    paddingTop: 20,
    fontSize: 20,
    borderWidth: 1,
  },
});
