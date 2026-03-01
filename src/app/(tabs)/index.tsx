import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const uri =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFyaXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";

  const showImagePicker = () => {
    Alert.alert("Select Image", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const pickImage = async () => {
    const { status, canAskAgain } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log(
      "Media library permission status:",
      status,
      "Can ask again:",
      canAskAgain,
    );
    if (status !== "granted") {
      if (!canAskAgain) {
        Alert.alert(
          "Permission Required",
          "To select a profile picture, please enable photo library access in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () =>
                Platform.OS === "ios"
                  ? Linking.openURL("app-settings:")
                  : Linking.openSettings(),
            },
          ],
        );
      } else {
        Alert.alert(
          "Permission Denied",
          "You need to grant permission to access the photo library.",
        );
      }
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status, canAskAgain } =
      await ImagePicker.requestCameraPermissionsAsync();
    console.log(
      "Camera permission status:",
      status,
      "Can ask again:",
      canAskAgain,
    );
    if (status !== "granted") {
      if (!canAskAgain) {
        Alert.alert(
          "Permission Required",
          "To take a photo, please enable camera access in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () =>
                Platform.OS === "ios"
                  ? Linking.openURL("app-settings:")
                  : Linking.openSettings(),
            },
          ],
        );
      } else {
        Alert.alert(
          "Permission Denied",
          "You need to grant permission to access the camera.",
        );
      }

      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        source={{
          uri: imageUri || uri,
        }}
        style={styles.image}
      />
      <TouchableOpacity style={styles.button} onPress={showImagePicker}>
        <Text style={styles.buttonText}>Change Image</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
