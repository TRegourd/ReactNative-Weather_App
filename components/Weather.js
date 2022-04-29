import { Text, View, Image, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export function Weather({ weatherData }) {
  return (
    <View style={styleWeather.weatherContainer}>
      <Text style={styleWeather.city}>{weatherData?.name}</Text>
      <View style={styleWeather.tempContainer}>
        <Text style={styleWeather.currentTemp}>
          {Math.round(weatherData?.main?.temp)}°C
        </Text>
        <Image
          style={styleWeather.weatherLogo}
          source={{
            uri: `http://openweathermap.org/img/w/${weatherData?.weather[0]?.icon}.png`,
          }}
        />
        <Text style={styleWeather.currentWeather}>
          {weatherData?.weather[0]?.main}
        </Text>
        <View style={styleWeather.tempMinMaxContainer}>
          <Text style={styleWeather.tempMinMax}>
            Min {Math.round(weatherData?.main?.temp_min)}°C
          </Text>
          <Text style={styleWeather.tempMinMax}>
            Max {Math.round(weatherData?.main?.temp_max)}°C
          </Text>
        </View>
      </View>
      <View style={styleWeather.windContainer}>
        <FontAwesome5 name="wind" size={24} color="black" />
        <Text style={styleWeather.windText}>
          Wind speed: {Math.round(weatherData?.wind?.speed)} km/h
        </Text>
      </View>
    </View>
  );
}

export const styleWeather = StyleSheet.create({
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
});
