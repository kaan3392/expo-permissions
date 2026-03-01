export default {
  expo: {
    name: "expo-permissions",
    slug: "expo-permissions",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "expopermissions",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/expo.icon",
      infoPlist: {
        NSPhotoLibraryUsageDescription:
          "This app requires access to your photo library to let you select a profile picture.",
        NSCameraUsageDescription:
          "This app requires access to your camera to let you take a profile photo.",
        NSLocationWhenInUseUsageDescription:
          "This app requires access to your location to provide location-based features.",
        UIBackgroundModes: ["audio"],
        NSMicrophoneUsageDescription:
          "This app requires access to your microphone to let you record audio.",
        NSCalendarsUsageDescription:
          "This app requires access to your calendar to let you create and manage events.",
        NSMotionUsageDescription:
          "This app requires access to your device motion to provide motion-based features.",
        NSActivityRecognitionUsageDescription:
          "This app requires access to your activity recognition to provide activity-based features.",
        NSSpeechRecognitionUsageDescription:
          "This app requires access to speech recognition to let you use voice commands and dictation features.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "This app requires access to your location to provide location-based features even when the app is in the background.",
        NSLocationAlwaysUsageDescription:
          "This app requires access to your location to provide location-based features even when the app is in the background.",
        NSLocationUsageDescription:
          "This app requires access to your location to provide location-based features.",
        NSNotificationsUsageDescription:
          "This app requires access to notifications to let you receive important updates and alerts.",
      },
      bundleIdentifier: "com.knlcl.expopermissions",
    },
    android: {
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
        "android.permission.READ_CALENDAR",
        "android.permission.WRITE_CALENDAR",
        "android.permission.ACTIVITY_RECOGNITION",
        "android.permission.USE_SIP",
        "android.permission.BODY_SENSORS",
        "android.permission.ACCESS_BACKGROUND_LOCATION",
        "android.permission.ACCESS_MEDIA_LOCATION",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.SCHEDULE_EXACT_ALARM",
      ],
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
      package: "com.knlcl.expopermissions",
      googleServicesFile: "./google-services.json",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          android: {
            image: "./assets/images/splash-icon.png",
            imageWidth: 76,
          },
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Allow this app to access your photos to let you choose and upload a profile picture.",
          cameraPermission:
            "Allow this app to access your camera so you can take a profile photo directly.",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow this app to access your location to provide location-based features and personalized content.",
        },
      ],
      [
        "expo-audio",
        {
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone.",
        },
      ],
      [
        "expo-calendar",
        {
          calendarPermission:
            "Allow this app to access your calendar to let you create and manage events.",
        },
      ],
      [
        "expo-sensors",
        {
          motionPermission:
            "Allow $(PRODUCT_NAME) to access your device motion",
          activityRecognitionPermission:
            "Allow $(PRODUCT_NAME) to access your activity recognition",
          bodySensorsPermission:
            "Allow $(PRODUCT_NAME) to access your body sensors",
          pedometerPermission:
            "Allow $(PRODUCT_NAME) to access your pedometer data",
          gyroscopePermission:
            "Allow $(PRODUCT_NAME) to access your gyroscope data",
          accelerometerPermission:
            "Allow $(PRODUCT_NAME) to access your accelerometer data",
          magnetometerPermission:
            "Allow $(PRODUCT_NAME) to access your magnetometer data",
        },
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          color: "#ffffff",
          defaultChannel: "default",
          enableBackgroundRemoteNotifications: false,
        },
      ],
      "expo-font",
      "expo-web-browser",
      "@react-native-community/datetimepicker",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: false,
    },
    extra: {
      router: {},
      eas: {
        projectId: "e737b550-fffd-4210-8298-55670aa23718",
      },
    },
    owner: "knlcl",
  },
};
