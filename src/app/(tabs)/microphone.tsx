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
        console.log("Kayıt tamamlandı, dosya yolu:", audioRecorder.uri);
        player.replace(audioRecorder.uri);
      }
    } catch (err: any) {
      Alert.alert(
        "Hata",
        "Kayıt durdurulurken bir hata oluştu: " + err.message,
      );
    }
  };

  const playSound = () => {
    if (audioRecorder.uri) {
      player.play();
    } else {
      Alert.alert("Hata", "Önce bir kayıt yapmalısınız.");
    }
  };

  const stopSound = () => {
    player.pause();
    player.seekTo(0); // Sesi en başa (0. saniyeye) sarar
  };

  useEffect(() => {
    (async () => {
      const { granted, canAskAgain } =
        await AudioModule.requestRecordingPermissionsAsync();

      if (!granted && canAskAgain) {
        const permission = await AudioModule.requestRecordingPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            "Microphone Permission Required",
            "Please enable microphone permissions in settings to use this feature.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Go to Settings",
                onPress: () =>
                  Platform.OS === "ios"
                    ? Linking.openURL("app-settings:")
                    : Linking.openSettings(),
              },
            ],
          );
          return;
        }
      } else if (!granted) {
        Alert.alert(
          "Microphone Permission Required",
          "Please enable microphone permissions in settings to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Go to Settings",
              onPress: () =>
                Platform.OS === "ios"
                  ? Linking.openURL("app-settings:")
                  : Linking.openSettings(),
            },
          ],
        );
        return;
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20 }}>
        Durum:{" "}
        {recorderState.isRecording ? "🔴 Kaydediliyor..." : "⚪ Beklemede"}
      </Text>

      <View
        style={[
          styles.button,
          { backgroundColor: recorderState.isRecording ? "red" : "#007AFF" },
        ]}
        onTouchStart={record}
        onTouchEnd={stopRecording}
      >
        <Text style={styles.buttonText}>Basılı Tut ve Konuş</Text>
      </View>

      {audioRecorder.uri && !audioRecorder.isRecording && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4CD964" }]}
          onPress={() => (playerState.playing ? stopSound : player.play())}
        >
          <Text style={styles.buttonText}>Son Kaydı Dinle ▶️</Text>
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
