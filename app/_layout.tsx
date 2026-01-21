import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#DB7093' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ title: 'K-Dramas' }} />
      <Stack.Screen name="details/[id]" options={{ title: 'Add Review' }} />
      <Stack.Screen name="my-review/[id]" options={{ title: 'My Review' }} />
        <Stack.Screen name="episodes/[id]" options={{ title: 'Episodes' }} />
        <Stack.Screen name="episode-reviewer/[dramaId]/[episodeId]" options={{ title: 'Episode Review' }} />
    </Stack>
  );
}