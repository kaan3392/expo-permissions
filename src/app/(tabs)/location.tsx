import * as Linking from "expo-linking";
import * as LocationExpo from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const Location = () => {
  const [location, setLocation] = useState({
    latitude: 41.0082,
    longitude: 28.9784,
  });

  const mapRef = useRef<MapView>(null);

  const getUserLocation = async () => {
    let { status, canAskAgain } =
      await LocationExpo.getForegroundPermissionsAsync();

    console.log("Location Permission Status:", status);

    if (status !== "granted" && canAskAgain) {
      const permission = await LocationExpo.requestForegroundPermissionsAsync();
      status = permission.status;
    }

    if (status !== "granted") {
      Alert.alert(
        "Your Location Permission is Required",
        "Please enable location permissions in settings to use this feature.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Go to Settings", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    try {
      console.log("Fetching user location...");
      let userLocation = await LocationExpo.getCurrentPositionAsync({});
      console.log("User Location Fetched:", userLocation);
      const coords = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      };

      console.log("Fetched User Location:", coords);

      setLocation(coords);

      // Haritayı otomatik olarak kullanıcının yanına kaydır
      mapRef.current?.animateToRegion(
        {
          ...coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    } catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert("Error", "Unable to fetch location. Please try again.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  console.log("Current Location:", location);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 41.0082, // İstanbul varsayılan
          longitude: 28.9784,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType="standard"
        zoomControlEnabled={true}
        zoomEnabled={true}
        provider="google"
      >
        {/* <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        /> */}

        {location && (
          <Marker
            coordinate={location}
            title="You are here"
            description="Your current location"
          />
        )}
      </MapView>
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({});
