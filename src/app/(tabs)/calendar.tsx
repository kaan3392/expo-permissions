import DateTimePicker from "@react-native-community/datetimepicker";
import * as CalendarExpo from "expo-calendar";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Calendar() {
  const [eventTitle, setEventTitle] = useState("");
  const [description, setDescription] = useState("");
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    (async () => {
      const { status, canAskAgain, granted } =
        await CalendarExpo.requestCalendarPermissionsAsync();

      if (status === "granted") {
        const calendars = await CalendarExpo.getCalendarsAsync(
          CalendarExpo.EntityTypes.EVENT,
        );
        console.log("********", calendars);
      } else if (!granted && !canAskAgain) {
        Alert.alert(
          "Your Calendar Permission is Required",
          "Please enable calendar permissions in settings to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Go to Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
      } else {
        console.log(
          "Calendar permission denied but can ask again. You can prompt the user again if needed.",
        );
      }
    })();
  }, []);

  const handleUnifiedSave = async () => {
    const { status } = await CalendarExpo.requestCalendarPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please enable calendar access in settings.",
      );
      return;
    }

    if (eventTitle.trim().length === 0 || description.trim().length === 0) {
      Alert.alert(
        "Missing Information",
        "Please provide both an event title and description.",
      );
      return;
    }

    try {
      let targetCalendarId = calendarId;

      if (!targetCalendarId) {
        const calendars = await CalendarExpo.getCalendarsAsync(
          CalendarExpo.EntityTypes.EVENT,
        );
        const existingCalendar = calendars.find(
          (cal) => cal.title === "My Portfolio Calendar",
        );

        if (existingCalendar) {
          targetCalendarId = existingCalendar.id;
          setCalendarId(targetCalendarId);
        } else {
          const source =
            Platform.OS === "ios"
              ? (await CalendarExpo.getDefaultCalendarAsync()).source
              : {
                  isLocalAccount: true,
                  name: "Expo Calendar",
                  type: CalendarExpo.SourceType.LOCAL,
                };

          targetCalendarId = await CalendarExpo.createCalendarAsync({
            title: "My Portfolio Calendar",
            color: "blue",
            entityType: CalendarExpo.EntityTypes.EVENT,
            sourceId: Platform.OS === "ios" ? source.id : source.name,
            source: source,
            name: "internalPortfolioCal",
            ownerAccount: "personal",
            accessLevel: CalendarExpo.CalendarAccessLevel.OWNER,
          });
          setCalendarId(targetCalendarId);
        }
      }

      if (targetCalendarId) {
        const endDate = new Date(date);
        endDate.setHours(date.getHours() + 1);

        await CalendarExpo.createEventAsync(targetCalendarId, {
          title: eventTitle || "New Event",
          notes: description,
          startDate: date,
          endDate: endDate,
          timeZone: "GMT+3",
        });

        setDescription("");
        setEventTitle("");
        setDate(new Date());

        Alert.alert(
          "Saved!",
          "The event has been successfully added to your calendar.",
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Smart Calendar Manager</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Dentist Appointment"
            placeholderTextColor="#999"
            value={eventTitle}
            onChangeText={setEventTitle}
          />
          <Text style={styles.label}>Description / Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add details like location or Zoom link..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.label}>Select Date & Time</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateText}>
              📅 {date.toLocaleDateString()} at{" "}
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              style={{
                backgroundColor: "gray",
                borderRadius: 50,
                marginBottom: 20,
              }}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selectedDate) => {
                if (Platform.OS === "android") setShowPicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
              onTouchCancel={() => setShowPicker(false)}
            />
          )}
          {Platform.OS === "ios" && showPicker && (
            <Button title="Done" onPress={() => setShowPicker(false)} />
          )}
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUnifiedSave}
            >
              <Text style={styles.saveButtonText}>Save Event to Phone</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#F5F7FA",
    padding: 25,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 30,
    color: "#1A1A1A",
  },
  statusContainer: {
    backgroundColor: "#E3FCEC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 25,
  },
  successText: {
    color: "#00875A",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  initButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
  },
  initButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#444",
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  datePickerButton: {
    backgroundColor: "#F0F4FF",
    borderWidth: 1,
    borderColor: "#C7D6FF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 25,
  },
  dateText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#007AFF",
  },
  saveButtonContainer: {
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#4CD964",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#4CD964",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
