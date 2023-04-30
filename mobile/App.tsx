import {Button, StatusBar} from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts
} from "@expo-google-fonts/inter";

import './src/lib/dayjs'
import {Routes} from "./src/routes";
import {Loading} from "./src/components/Loading";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  })
})

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  })

  async function scheduleNotification() {
    const trigger = new Date(Date.now())
    trigger.setMinutes(trigger.getMinutes() + 1)

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hi, Susana! 🌟',
        body: 'Did you practice your habits today?'
      },
      trigger,
    })
  }

  if(!fontsLoaded) {
    return (<Loading />)
  }

  return (
    <>
      <Routes />
      <Button title="Send Notification" onPress={scheduleNotification} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    </>
  );
}