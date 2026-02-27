import { Pedometer } from "expo-sensors";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Pace() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState("checking");
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const handlePermissions = async () => {
    const { status, canAskAgain } = await Pedometer.getPermissionsAsync();
    console.log(
      "Pace Permission Status:",
      status,
      "Can Ask Again:",
      canAskAgain,
    );

    if (status === "granted") {
      setPermissionStatus(status);
      return;
    }

    if (status === "denied" && !canAskAgain) {
      Alert.alert(
        "Need Permission",
        "Permissions for pedometer access are required to track your steps. Please enable them in settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Go to Settings", onPress: () => Linking.openSettings() },
        ],
      );
    } else {
      const { status: newStatus } = await Pedometer.requestPermissionsAsync();
      setPermissionStatus(newStatus);
    }
  };

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    const checkAndStart = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      const { status } = await Pedometer.getPermissionsAsync();
      setPermissionStatus(status);

      if (isAvailable && status === "granted") {
        subscription = Pedometer.watchStepCount((result) => {
          setCurrentStepCount(result.steps);
        });
      }
    };

    checkAndStart();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [permissionStatus]);

  useEffect(() => {
    handlePermissions();
  }, []);

  if (isPedometerAvailable === "checking") {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Checking permissions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        Device Support:{" "}
        {isPedometerAvailable === "true" ? "✅ Available" : "❌ Not Available"}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Step Count</Text>
        <Text style={styles.stepText}>{currentStepCount}</Text>
      </View>

      {permissionStatus !== "granted" && (
        <TouchableOpacity style={styles.button} onPress={handlePermissions}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  status: {
    fontSize: 16,
    marginBottom: 40,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "100%",
  },
  label: {
    fontSize: 18,
    color: "#888",
    marginBottom: 10,
  },
  stepText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
