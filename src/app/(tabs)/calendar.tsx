import * as CalendarExpo from "expo-calendar";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";

export default function Calendar() {
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

  return (
    <View style={styles.container}>
      <Text>Calendar Module Example</Text>
      <Button title="Create a new calendar" onPress={createCalendar} />
    </View>
  );
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await CalendarExpo.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : {
          isLocalAccount: true,
          name: "Expo Calendar",
          type: CalendarExpo.SourceType.LOCAL,
        };

  console.log("Default calendar source:", defaultCalendarSource);
  const newCalendarID = await CalendarExpo.createCalendarAsync({
    title: "Expo Calendar",
    color: "blue",
    entityType: CalendarExpo.EntityTypes.EVENT,
    sourceId:
      Platform.OS === "ios"
        ? defaultCalendarSource.id
        : defaultCalendarSource.name,

    source: defaultCalendarSource,
    name: "internalCalendarName",
    ownerAccount: "personal",
    accessLevel: CalendarExpo.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
