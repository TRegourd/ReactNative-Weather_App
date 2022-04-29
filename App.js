import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";

import * as Location from "expo-location";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundLogo from "./components/BackgroundLogo";
import { Weather } from "./components/Weather";
import { Input } from "./components/Input";

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

      {/* <BackgroundLogo></BackgroundLogo> */}
      <Input
        requestPermissions={requestPermissions}
        onChangeText={onChangeText}
        text={text}
        onPressSearch={onPressSearch}
      ></Input>
      <Weather weatherData={weatherData}></Weather>
      <View style={styles.forecastContainer}>
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
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
    //
    flexDirection: "column",
    alignItems: "center",
  },
  tempMinMaxContainer: {
    //
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
    flexDirection: "row",
    alignItems: "center",
  },
  windText: {
    margin: 10,
  },

  weatherContainer: {
    flex: 4,
    margin: 10,

    alignItems: "center",
  },

  forecastContainer: {
    flex: 2.5,
    margin: 10,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    borderRadius: 10,
  },

  forecastScrollContainer: {
    flex: 1,
    margin: 10,
    flexWrap: "wrap",
  },

  forecast: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    margin: 5,
    borderRadius: 10,
    flexWrap: "wrap",
  },
  forecastLogo: {
    width: 50,
    height: 50,
  },
  currentForecast: {
    margin: 10,
    fontSize: 10,
  },
  forecastMinMaxContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  forecastMinMax: {
    margin: 2,
    fontSize: 10,
  },

  forecastTitle: {
    paddingTop: 20,
    fontSize: 20,
  },
});
