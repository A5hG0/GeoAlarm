import * as Notifications from "expo-notifications";

export async function setupNotifications(): Promise<void> {
  // How notifications behave when app is in foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Request permission
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Notification permission not granted");
  }
}

export async function cancelDistanceNotification(): Promise<void> {
  await Notifications.dismissNotificationAsync("geoalarm-distance");
}
