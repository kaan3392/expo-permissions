import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import * as Linking from "expo-linking";
import React, { useEffect } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Microphone = () => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const player = useAudioPlayer();
  const playerState = useAudioPlayerStatus(player);
  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      if (audioRecorder.uri) {
        console.log("Recording completed, file path:", audioRecorder.uri);
        player.replace(audioRecorder.uri);
      }
    } catch (err: any) {
      Alert.alert("Error", "Error stopping recording: " + err.message);
    }
  };

  const stopSound = () => {
    player.pause();
    player.seekTo(0); // Sesi en başa (0. saniyeye) sarar
  };

  useEffect(() => {
    const requestMicPermissions = async () => {
      const { granted, canAskAgain } =
        await AudioModule.requestRecordingPermissionsAsync();

      if (granted) {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
        return;
      }

      if (!canAskAgain) {
        Alert.alert(
          "Microphone Access Required",
          "Microphone access is permanently disabled. Please enable it in your device settings to record audio.",
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
      }
    };

    requestMicPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20 }}>
        State: {recorderState.isRecording ? "🔴 Recording..." : "⚪ Holding..."}
      </Text>

      <View
        style={[
          styles.button,
          { backgroundColor: recorderState.isRecording ? "red" : "#007AFF" },
        ]}
        onTouchStart={record}
        onTouchEnd={stopRecording}
      >
        <Text style={styles.buttonText}>Hold and Speak</Text>
      </View>

      {audioRecorder.uri && !audioRecorder.isRecording && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CD964" }]}
          onPress={() => (playerState.playing ? stopSound : player.play())}
        >
          <Text style={styles.buttonText}>Listen to your record.. ▶️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Microphone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 20,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
